import React, { useState } from 'react';
import { ethers } from 'ethers';

const UpdateProgress = ({ account, provider, contract, contractAddress, contractABI, showModal, checkNetwork }) => {
  const [progressBetId, setProgressBetId] = useState('');
  const [progress, setProgress] = useState('');

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

  const updateProgress = async () => {
    if (!contract || !account || !provider) {
      showModal('Please connect wallet');
      return;
    }
    if (!progressBetId || !progress || isNaN(progress) || Number(progress) < 0 || Number(progress) > 100) {
      showModal('Please enter valid Bet ID and Progress (0-100)');
      return;
    }
    if (!(await checkNetwork())) return;
    try {
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
      const bet = await contractInstance.getBet(progressBetId);
      if (bet[0].toLowerCase() !== account.toLowerCase() && (await contractInstance.owner()).toLowerCase() !== account.toLowerCase()) {
        showModal('Only the bet creator or contract owner can update progress');
        return;
      }
      await withRetry(async () => {
        const estimatedGas = await contractInstance.updateProgress.estimateGas(progressBetId, parseInt(progress));
        const tx = await contractInstance.updateProgress(progressBetId, parseInt(progress), {
          gasLimit: estimatedGas * 12n / 10n
        });
        await tx.wait();
      });
      showModal('Progress updated!');
      setProgressBetId('');
      setProgress('');
    } catch (error) {
      console.error('Error updating progress:', error);
      showModal(`Failed to update progress: ${error.reason || error.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700">
      <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Admin: Update Progress</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="number"
          placeholder="Bet ID"
          value={progressBetId}
          onChange={(e) => setProgressBetId(e.target.value)}
          className="bg-gray-900 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <input
          type="number"
          placeholder="Progress (0-100)"
          value={progress}
          onChange={(e) => setProgress(e.target.value)}
          className="bg-gray-900 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg transform hover:scale-105 transition-all duration-300"
          onClick={updateProgress}
        >
          Update Progress
        </button>
      </div>
    </div>
  );
};

export default UpdateProgress;