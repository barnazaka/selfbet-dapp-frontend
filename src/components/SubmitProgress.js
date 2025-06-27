import React, { useState } from 'react';
import axios from 'axios';

const SubmitProgress = ({ account, contract, showModal }) => {
  const [progressBetId, setProgressBetId] = useState('');
  const [summary, setSummary] = useState('');

  const submitProgress = async () => {
    if (!contract || !account) {
      showModal('Please connect wallet');
      return;
    }
    if (!progressBetId || !summary) {
      showModal('Please enter Bet ID and Summary');
      return;
    }
    try {
      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        { summary, betId: progressBetId },
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_PINATA_JWT}`,
            'Content-Type': 'application/json'
          }
        }
      );
      showModal(`Progress submitted! IPFS Hash: ${response.data.IpfsHash}`);
      setSummary('');
      setProgressBetId('');
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      showModal(`Failed to submit progress: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700">
      <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Submit Progress</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="number"
          placeholder="Bet ID"
          value={progressBetId}
          onChange={(e) => setProgressBetId(e.target.value)}
          className="bg-gray-900 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <input
          type="text"
          placeholder="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="bg-gray-900 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-3 rounded-lg transform hover:scale-105 transition-all duration-300"
          onClick={submitProgress}
        >
          Submit Progress
        </button>
      </div>
    </div>
  );
};

export default SubmitProgress;