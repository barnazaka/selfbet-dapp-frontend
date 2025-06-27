import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

const SettleBet = ({ account, provider, contract, contractAddress, contractABI, showModal, checkNetwork }) => {
  const [settleBetId, setSettleBetId] = useState('');
  const [claimableBets, setClaimableBets] = useState([]);

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

  const fetchClaimableBets = useCallback(async () => {
    if (!contract || !account) return;
    try {
      const betCount = await contract.betCount();
      const userBets = [];
      for (let i = 1; i <= betCount; i++) {
        const bet = await contract.getBet(i);
        const deadline = Number(bet[3]) * 1000;
        const now = Date.now();
        if (now >= deadline && !bet[5] && bet[0].toLowerCase() === account.toLowerCase()) {
          userBets.push({
            id: i,
            stake: ethers.formatUnits(bet[1], 6),
            progress: bet[2].toString(),
            deadline: new Date(deadline).toLocaleString(),
          });
        }
      }
      setClaimableBets(userBets);
    } catch (error) {
      console.error('Error fetching claimable bets:', error);
    }
  }, [contract, account]);

  useEffect(() => {
    if (contract && account) {
      fetchClaimableBets();
    }
  }, [contract, account, fetchClaimableBets]);

  const settleBet = async () => {
    if (!contract || !account || !provider) {
      showModal('Please connect wallet');
      return;
    }
    if (!settleBetId) {
      showModal('Please enter Bet ID');
      return;
    }
    if (!(await checkNetwork())) return;
    try {
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
      const bet = await contractInstance.getBet(settleBetId);
      const deadline = Number(bet[3]) * 1000;
      const now = Date.now();
      if (now < deadline) {
        showModal(`Cannot settle Bet ID ${settleBetId}: Deadline not reached (expires ${new Date(deadline).toLocaleString()})`);
        return;
      }
      if (bet[5]) {
        showModal(`Bet ID ${settleBetId} is already settled`);
        return;
      }
      await withRetry(async () => {
        const estimatedGas = await contractInstance.settleBet.estimateGas(settleBetId);
        const tx = await contractInstance.settleBet(settleBetId, {
          gasLimit: estimatedGas * 12n / 10n
        });
        await tx.wait();
      });
      showModal('Bet settled!');
      setSettleBetId('');
      fetchClaimableBets();
    } catch (error) {
      console.error('Error settling bet:', error);
      showModal(`Failed to settle bet: ${error.reason || error.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Settle Bet</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="number"
            placeholder="Bet ID"
            value={settleBetId}
            onChange={(e) => setSettleBetId(e.target.value)}
            className="bg-gray-900 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-3 rounded-lg transform hover:scale-105 transition-all duration-300"
            onClick={settleBet}
          >
            Settle Bet
          </button>
        </div>
      </div>
      <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Claimable Bets</h2>
        {claimableBets.length === 0 ? (
          <p className="text-gray-300">No bets are ready to be settled.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-700">
              <thead>
                <tr className="bg-gray-900/50">
                  <th className="border border-gray-700 p-3">Bet ID</th>
                  <th className="border border-gray-700 p-3">Stake (USDC)</th>
                  <th className="border border-gray-700 p-3">Progress (%)</th>
                  <th className="border border-gray-700 p-3">Deadline</th>
                </tr>
              </thead>
              <tbody>
                {claimableBets.map(bet => (
                  <tr key={bet.id} className="hover:bg-gray-700/50">
                    <td className="border border-gray-700 p-3">{bet.id}</td>
                    <td className="border border-gray-700 p-3">{bet.stake}</td>
                    <td className="border border-gray-700 p-3">{bet.progress}%</td>
                    <td className="border border-gray-700 p-3">{bet.deadline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettleBet;