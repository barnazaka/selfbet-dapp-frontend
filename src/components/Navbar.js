import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = ({ account, connectWallet, logout }) => {
  const [isPagesDropdownOpen, setIsPagesDropdownOpen] = useState(false);
  const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);

  const buttonVariants = {
    hover: { scale: 1.1, boxShadow: '0 0 20px rgba(0, 255, 255, 0.7)', transition: { duration: 0.3 } },
    tap: { scale: 0.95 }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } }
  };

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setIsWalletDropdownOpen(false);
    }
  };

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/create-bet', label: 'Create Bet' },
    { path: '/submit-progress', label: 'Submit Progress' },
    { path: '/update-progress', label: 'Update Progress' },
    { path: '/settle-bet', label: 'Settle Bet' },
    { path: '/your-bets', label: 'Your Bets' },
  ];

  return (
    <nav className="bg-gray-900/80 backdrop-blur-md p-4 sticky top-0 z-50 border-b border-cyan-500/20">
      <div className="container mx-auto max-w-7xl flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
          SelfBet
        </Link>
        <div className="flex items-center space-x-6">
          {!account ? (
            <>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="px-8 py-3 text-xl font-semibold rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white shadow-lg shadow-cyan-500/50 transform transition-all duration-300"
                onClick={connectWallet}
              >
                Login with MetaMask
              </motion.button>
              <button
                className="px-8 py-3 text-xl font-semibold rounded-full bg-gray-600 text-gray-400 cursor-not-allowed"
                disabled
              >
                Sign Up
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="relative">
                <motion.button
                  className="font-mono text-lg text-cyan-400 hover:text-cyan-300 transition-colors"
                  onClick={() => {
                    setIsPagesDropdownOpen(!isPagesDropdownOpen);
                    setIsWalletDropdownOpen(false); // Close wallet dropdown when opening pages
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Menu
                </motion.button>
                {isPagesDropdownOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="absolute right-0 mt-2 w-48 bg-gray-800/90 backdrop-blur-md border border-cyan-500/30 rounded-lg shadow-lg shadow-cyan-500/20 z-20 flex flex-col"
                  >
                    {navLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className="px-4 py-2 text-sm text-white hover:bg-cyan-500/30 transition-colors border-b border-cyan-500/10 last:border-b-0"
                        onClick={() => setIsPagesDropdownOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>
              <div className="relative">
                <motion.button
                  className="font-mono text-lg text-cyan-400 hover:text-cyan-300 transition-colors"
                  onClick={() => {
                    setIsWalletDropdownOpen(!isWalletDropdownOpen);
                    setIsPagesDropdownOpen(false); // Close pages dropdown when opening wallet
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {account.slice(0, 6)}...{account.slice(-4)}
                </motion.button>
                {isWalletDropdownOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="absolute right-0 mt-2 w-48 bg-gray-800/90 backdrop-blur-md border border-cyan-500/30 rounded-lg shadow-lg shadow-cyan-500/20 z-20 flex flex-col"
                  >
                    <button
                      className="px-4 py-2 text-sm text-white hover:bg-cyan-500/30 transition-colors border-b border-cyan-500/10"
                      onClick={copyAddress}
                    >
                      Copy Address
                    </button>
                    <button
                      className="px-4 py-2 text-sm text-white hover:bg-cyan-500/30 transition-colors"
                      onClick={() => {
                        logout();
                        setIsWalletDropdownOpen(false);
                      }}
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;