import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

const YourBets = ({ account, contract }) => {
  const [bets, setBets] = useState([]);

  const fetchBets = useCallback(async () => {
    if (!contract || !account) return;
    try {
      const betCount = await contract.betCount();
      const userBets = [];
      for (let i = 1; i <= betCount; i++) {
        const bet = await contract.getBet(i);
        if (bet[0].toLowerCase() === account.toLowerCase()) {
          const deadline = Number(bet[3]) * 1000;
          const now = Date.now();
          userBets.push({
            id: i,
            stake: ethers.formatUnits(bet[1], 6),
            progress: bet[2].toString(),
            deadline: new Date(deadline).toLocaleString(),
            timeUntilDeadline: deadline > now ? Math.ceil((deadline - now) / (1000 * 60 * 60 * 24)) + ' days' : 'Expired',
            completed: bet[4],
            settled: bet[5]
          });
        }
      }
      setBets(userBets);
    } catch (error) {
      console.error('Error fetching bets:', error);
    }
  }, [contract, account]);

  useEffect(() => {
    if (contract && account) {
      fetchBets();
    }
  }, [contract, account, fetchBets]);

  return (
    <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700">
      <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Your Bets</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border border-gray-700">
          <thead>
            <tr className="bg-gray-900/50">
              <th className="border border-gray-700 p-3">Bet ID</th>
              <th className="border border-gray-700 p-3">Stake (USDC)</th>
              <th className="border border-gray-700 p-3">Progress (%)</th>
              <th className="border border-gray-700 p-3">Deadline</th>
              <th className="border border-gray-700 p-3">Time Until Deadline</th>
              <th className="border border-gray-700 p-3">Completed</th>
              <th className="border border-gray-700 p-3">Settled</th>
            </tr>
          </thead>
          <tbody>
            {bets.map(bet => (
              <tr key={bet.id} className="hover:bg-gray-700/50">
                <td className="border border-gray-700 p-3">{bet.id}</td>
                <td className="border border-gray-700 p-3">{bet.stake}</td>
                <td className="border border-gray-700 p-3">
                  <div className="w-full bg-gray-600 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        bet.progress >= 70
                          ? 'bg-green-500'
                          : bet.progress >= 30
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${bet.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm mt-1 block text-center">{bet.progress}%</span>
                </td>
                <td className="border border-gray-700 p-3">{bet.deadline}</td>
                <td className="border border-gray-700 p-3">{bet.timeUntilDeadline}</td>
                <td className="border border-gray-700 p-3">{bet.completed ? 'Yes' : 'No'}</td>
                <td className="border border-gray-700 p-3">{bet.settled ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default YourBets;