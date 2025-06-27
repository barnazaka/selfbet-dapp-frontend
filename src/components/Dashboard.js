import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = ({ account }) => (
  <div className="space-y-8">
    <section className="text-center py-8">
      <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 mb-4">
        Welcome, {account.slice(0, 6)}...{account.slice(-4)}!
      </h1>
      <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
        Get started with SelfBet by creating a bet, tracking your progress, and claiming rewards. Follow the steps below to achieve your goals!
      </p>
      <Link
        to="/create-bet"
        className="px-12 py-6 text-xl font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50"
      >
        Create Your First Bet
      </Link>
    </section>
    <section className="bg-gray-800/50 p-8 rounded-xl shadow-lg border border-gray-700">
      <h2 className="text-3xl font-semibold text-cyan-400 mb-4">How to Use SelfBet</h2>
      <ol className="list-decimal list-inside text-gray-300 space-y-4">
        <li>
          <strong>Create a Bet</strong>: Set a goal, stake USDC, and choose a deadline.{' '}
          <Link to="/create-bet" className="text-cyan-400 hover:underline">Go to Create Bet</Link>
        </li>
        <li>
          <strong>Submit Progress</strong>: Upload updates about your progress to IPFS.{' '}
          <Link to="/submit-progress" className="text-cyan-400 hover:underline">Go to Submit Progress</Link>
        </li>
        <li>
          <strong>Update Progress</strong>: Admins can update your progress percentage.{' '}
          <Link to="/update-progress" className="text-cyan-400 hover:underline">Go to Update Progress</Link>
        </li>
        <li>
          <strong>Settle Bet</strong>: Claim rewards for completed bets after the deadline.{' '}
          <Link to="/settle-bet" className="text-cyan-400 hover:underline">Go to Settle Bet</Link>
        </li>
        <li>
          <strong>View Your Bets</strong>: Track all your bets and their status.{' '}
          <Link to="/your-bets" className="text-cyan-400 hover:underline">Go to Your Bets</Link>
        </li>
      </ol>
    </section>
  </div>
);

export default Dashboard;