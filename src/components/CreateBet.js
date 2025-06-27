import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

const CreateBet = ({ account, provider, contract, contractAddress, usdcAddress, contractABI, usdcABI, showModal, checkNetwork }) => {
  const [stake, setStake] = useState('');
  const [duration, setDuration] = useState('');
  const navigate = useNavigate();

  const withRetry = async (operation, maxRetries = 3, delayMs = 1000) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === maxRetries) throw error;
        console.warn(`Attempt ${attempt} failed: ${error.message}. Retrying...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  };

  const createBet = async () => {
    if (!contract || !account || !provider) {
      showModal('Please connect wallet');
      return;
    }
    if (!stake || isNaN(stake) || Number(stake) <= 0) {
      showModal('Please enter a valid stake amount (positive number)');
      return;
    }
    if (!duration || isNaN(duration) || Number(duration) <= 0) {
      showModal('Please enter a valid duration (positive number of days)');
      return;
    }
    if (!(await checkNetwork())) return;
    try {
      const signer = await provider.getSigner();
      const usdcContract = new ethers.Contract(usdcAddress, usdcABI, signer);
      const stakeWei = ethers.parseUnits(stake, 6);
      const durationSeconds = parseInt(duration) * 24 * 60 * 60;

      const balance = await usdcContract.balanceOf(account);
      if (balance < stakeWei) {
        showModal(`Insufficient USDC balance: ${ethers.formatUnits(balance, 6)} USDC available`);
        return;
      }

      const allowance = await usdcContract.allowance(account, contractAddress);
      if (allowance < stakeWei) {
        console.log('Approving USDC:', { stakeWei: stakeWei.toString(), contractAddress });
        await withRetry(async () => {
          const estimatedGas = await usdcContract.approve.estimateGas(contractAddress, stakeWei);
          const approveTx = await usdcContract.approve(contractAddress, stakeWei, {
            gasLimit: estimatedGas * 12n / 10n
          });
          await approveTx.wait();
          console.log('USDC approved');
        });
      }

      console.log('Creating bet:', { stakeWei: stakeWei.toString(), durationSeconds });
      await withRetry(async () => {
        const estimatedGas = await contract.createBet.estimateGas(stakeWei, durationSeconds);
        const tx = await contract.createBet(stakeWei, durationSeconds, {
          gasLimit: estimatedGas * 12n / 10n
        });
        await tx.wait();
      });
      showModal('Bet created successfully!');
      setStake('');
      setDuration('');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating bet:', error);
      showModal(`Failed to create bet: ${error.reason || error.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700">
      <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Create Bet</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="number"
          placeholder="Stake (USDC)"
          value={stake}
          onChange={(e) => setStake(e.target.value)}
          className="bg-gray-900 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <input
          type="number"
          placeholder="Duration (days)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="bg-gray-900 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button
          className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3 rounded-lg transform hover:scale-105 transition-all duration-300"
          onClick={createBet}
        >
          Create Bet
        </button>
      </div>
    </div>
  );
};

export default CreateBet;