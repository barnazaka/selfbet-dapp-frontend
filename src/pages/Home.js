import React from 'react';
import { motion } from 'framer-motion';

const Home = ({ connectWallet }) => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  const buttonVariants = {
    hover: { scale: 1.1, boxShadow: '0 0 20px rgba(0, 255, 255, 0.7)', transition: { duration: 0.3 } },
    tap: { scale: 0.95 }
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse"></div>
        <motion.h1
          className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 mb-6 text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
        >
          SelfBet
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 text-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          A decentralized Web3 platform on Polygon Amoy to bet on your goals, stake USDC, and achieve greatness with blockchain transparency.
        </motion.p>
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="px-16 py-6 text-2xl font-semibold rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white shadow-lg shadow-cyan-500/50 transform transition-all duration-300"
          onClick={connectWallet}
        >
          Login with MetaMask
        </motion.button>
      </motion.section>

      {/* About Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-gray-800/30 backdrop-blur-md p-8 rounded-2xl border border-cyan-500/20 shadow-xl shadow-cyan-500/10"
      >
        <h2 className="text-4xl font-semibold text-cyan-400 mb-4">About SelfBet</h2>
        <p className="text-gray-300 text-lg">
          SelfBet is your gateway to self-improvement through blockchain. Built on Polygon Amoy, it lets you stake USDC on personal goals, track progress transparently with IPFS, and claim rewards when you succeed. Embrace the Web3 revolution to stay accountable!
        </p>
      </motion.section>

      {/* Features Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-gray-900/50 backdrop-blur-md p-8 rounded-2xl border border-purple-500/20 shadow-xl shadow-purple-500/10"
      >
        <h2 className="text-4xl font-semibold text-purple-400 mb-6">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: 'Decentralized Betting', desc: 'Stake USDC on your goals with secure smart contracts.' },
            { title: 'IPFS Progress Tracking', desc: 'Upload progress updates to IPFS for transparency.' },
            { title: 'Admin Progress Updates', desc: 'Trusted admins update your progress percentages.' },
            { title: 'Reward Claims', desc: 'Settle bets and claim rewards when you succeed.' }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-cyan-500 transition-all duration-300"
              whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)' }}
            >
              <h3 className="text-xl font-semibold text-cyan-300">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-gray-800/30 backdrop-blur-md p-8 rounded-2xl border border-pink-500/20 shadow-xl shadow-pink-500/10"
      >
        <h2 className="text-4xl font-semibold text-pink-400 mb-6">How It Works</h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-4 text-lg">
          <li><strong>Connect Wallet</strong>: Use MetaMask to join the platform.</li>
          <li><strong>Create a Bet</strong>: Set your goal, stake USDC, and choose a deadline.</li>
          <li><strong>Submit Progress</strong>: Upload updates to IPFS to track your journey.</li>
          <li><strong>Update Progress</strong>: Admins verify and update your progress.</li>
          <li><strong>Settle & Claim</strong>: Achieve your goal and claim your rewards!</li>
        </ol>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-gray-900/50 backdrop-blur-md p-8 rounded-2xl border border-cyan-500/20 shadow-xl shadow-cyan-500/10"
      >
        <h2 className="text-4xl font-semibold text-cyan-400 mb-6">FAQ</h2>
        <div className="space-y-6">
          {[
            { q: 'What is SelfBet?', a: 'A Web3 platform to bet on personal goals using USDC on Polygon Amoy.' },
            { q: 'How do I get USDC?', a: 'Use a Polygon Amoy faucet or swap MATIC for USDC on a DEX.' },
            { q: 'What if I miss my deadline?', a: 'If progress is below the threshold, you may lose your stake per contract rules.' }
          ].map((faq, index) => (
            <motion.div
              key={index}
              className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-purple-500 transition-all duration-300"
              whileHover={{ scale: 1.03 }}
            >
              <h3 className="text-xl font-semibold text-purple-300">{faq.q}</h3>
              <p className="text-gray-400">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default Home;