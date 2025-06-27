import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import Navbar from './components/Navbar';
import Modal from './components/Modal';
import Home from './pages/Home';
import Dashboard from './components/Dashboard';
import CreateBet from './components/CreateBet';
import SubmitProgress from './components/SubmitProgress';
import UpdateProgress from './components/UpdateProgress';
import SettleBet from './components/SettleBet';
import YourBets from './components/YourBets';
import './index.css';

const App = () => {
  const [account, setAccount] = useState(localStorage.getItem('selfbet_account') || null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const contractAddress = '0x9E42ae1436c4d196Fa6F98F23601dd94138e01D7';
  const usdcAddress = '0xb6eF6F7Dee6a25EA6e24f32C248fa42A00173398';
  const contractABI = [
    {
      "inputs": [{"internalType": "address", "name": "_usdc", "type": "address"}],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {"indexed": false, "internalType": "uint256", "name": "betId", "type": "uint256"},
        {"indexed": false, "internalType": "address", "name": "user", "type": "address"},
        {"indexed": false, "internalType": "uint256", "name": "stake", "type": "uint256"},
        {"indexed": false, "internalType": "uint256", "name": "deadline", "type": "uint256"}
      ],
      "name": "BetCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {"indexed": false, "internalType": "uint256", "name": "betId", "type": "uint256"},
        {"indexed": false, "internalType": "address", "name": "user", "type": "address"},
        {"indexed": false, "internalType": "bool", "name": "success", "type": "bool"},
        {"indexed": false, "internalType": "uint256", "name": "payout", "type": "uint256"}
      ],
      "name": "BetSettled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {"indexed": false, "internalType": "uint256", "name": "betId", "type": "uint256"},
        {"indexed": false, "internalType": "uint256", "name": "progress", "type": "uint256"}
      ],
      "name": "ProgressUpdated",
      "type": "event"
    },
    {
      "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "name": "bets",
      "outputs": [
        {"internalType": "address", "name": "user", "type": "address"},
        {"internalType": "uint256", "name": "stake", "type": "uint256"},
        {"internalType": "uint256", "name": "progress", "type": "uint256"},
        {"internalType": "uint256", "name": "deadline", "type": "uint256"},
        {"internalType": "bool", "name": "completed", "type": "bool"},
        {"internalType": "bool", "name": "settled", "type": "bool"}
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "betCount",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "_stake", "type": "uint256"},
        {"internalType": "uint256", "name": "_duration", "type": "uint256"}
      ],
      "name": "createBet",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "uint256", "name": "_betId", "type": "uint256"}],
      "name": "getBet",
      "outputs": [
        {"internalType": "address", "name": "", "type": "address"},
        {"internalType": "uint256", "name": "", "type": "uint256"},
        {"internalType": "uint256", "name": "", "type": "uint256"},
        {"internalType": "uint256", "name": "", "type": "uint256"},
        {"internalType": "bool", "name": "", "type": "bool"},
        {"internalType": "bool", "name": "", "type": "bool"}
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [{"internalType": "address", "name": "", "type": "address"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "uint256", "name": "_betId", "type": "uint256"}],
      "name": "settleBet",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "_betId", "type": "uint256"},
        {"internalType": "uint256", "name": "_progress", "type": "uint256"}
      ],
      "name": "updateProgress",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "usdc",
      "outputs": [{"internalType": "address", "name": "", "type": "address"}],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  const usdcABI = [
    {
      "constant": true,
      "inputs": [{"name": "_owner", "type": "address"}],
      "name": "balanceOf",
      "outputs": [{"name": "balance", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {"name": "spender", "type": "address"},
        {"name": "value", "type": "uint256"}
      ],
      "name": "approve",
      "outputs": [{"name": "", "type": "bool"}],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {"name": "owner", "type": "address"},
        {"name": "spender", "type": "address"}
      ],
      "name": "allowance",
      "outputs": [{"name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  const showModal = (message) => {
    console.log('Showing modal:', message);
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage('');
  };

  const checkNetwork = async () => {
    if (!window.ethereum) {
      showModal('MetaMask not detected! Please install MetaMask.');
      console.error('MetaMask not detected');
      return false;
    }
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      console.log('Current chainId:', chainId);
      if (chainId !== '0x13882') {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x13882' }],
          });
        } catch (error) {
          if (error.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x13882',
                chainName: 'Polygon Amoy',
                rpcUrls: ['https://rpc-amoy.polygon.technology'],
                nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                blockExplorerUrls: ['https://amoy.polygonscan.com']
              }]
            });
          } else {
            console.error('Network switch error:', error);
            showModal('Please switch to Polygon Amoy in MetaMask');
            return false;
          }
        }
      }
      return true;
    } catch (error) {
      console.error('Error checking network:', error);
      showModal(`Network error: ${error.message || 'Unknown error'}`);
      return false;
    }
  };

  const connectWallet = async () => {
    console.log('Initiating wallet connection');
    if (!(await checkNetwork())) return;
    try {
      if (!window.ethereum) {
        showModal('MetaMask not detected! Please install MetaMask.');
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      console.log('Requesting accounts from MetaMask');
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Accounts received:', accounts);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
      const accountAddress = accounts[0];
      console.log('Setting account:', accountAddress);
      setAccount(accountAddress);
      setProvider(provider);
      setContract(contractInstance);
      localStorage.setItem('selfbet_account', accountAddress);
      localStorage.setItem('selfbet_login_time', Date.now().toString());
      showModal('Wallet connected successfully!');
      console.log('Redirecting to /dashboard');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      showModal(`Failed to connect wallet: ${error.message || 'Unknown error'}`);
    }
  };

  useEffect(() => {
    console.log('Current account state:', account);
    const loginTime = localStorage.getItem('selfbet_login_time');
    const fiveMinutes = 5 * 60 * 1000;

    if (loginTime && Date.now() - parseInt(loginTime) >= fiveMinutes) {
      console.log('Auto-logout triggered');
      setAccount(null);
      setProvider(null);
      setContract(null);
      localStorage.removeItem('selfbet_account');
      localStorage.removeItem('selfbet_login_time');
      navigate('/');
    }

    const handleAccountsChanged = (accounts) => {
      console.log('Accounts changed:', accounts);
      if (accounts.length === 0 || !accounts.includes(localStorage.getItem('selfbet_account'))) {
        console.log('No accounts or account mismatch, logging out');
        setAccount(null);
        setProvider(null);
        setContract(null);
        localStorage.removeItem('selfbet_account');
        localStorage.removeItem('selfbet_login_time');
        navigate('/');
      } else {
        setAccount(accounts[0]);
        localStorage.setItem('selfbet_account', accounts[0]);
        localStorage.setItem('selfbet_login_time', Date.now().toString());
        navigate('/dashboard');
      }
    };

    const handleChainChanged = () => {
      console.log('Chain changed, logging out');
      setAccount(null);
      setProvider(null);
      setContract(null);
      localStorage.removeItem('selfbet_account');
      localStorage.removeItem('selfbet_login_time');
      navigate('/');
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [account, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white font-orbitron">
      <Navbar account={account} connectWallet={connectWallet} logout={() => {
        console.log('Logging out');
        setAccount(null);
        setProvider(null);
        setContract(null);
        localStorage.removeItem('selfbet_account');
        localStorage.removeItem('selfbet_login_time');
        navigate('/');
      }} />
      <div className="container mx-auto p-6 max-w-7xl">
        <Routes>
          <Route path="/" element={<Home connectWallet={connectWallet} />} />
          <Route
            path="/dashboard"
            element={
              account ? (
                <Dashboard
                  account={account}
                  provider={provider}
                  contract={contract}
                  contractAddress={contractAddress}
                  usdcAddress={usdcAddress}
                  contractABI={contractABI}
                  usdcABI={usdcABI}
                  showModal={showModal}
                  checkNetwork={checkNetwork}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/create-bet"
            element={
              account ? (
                <CreateBet
                  account={account}
                  provider={provider}
                  contract={contract}
                  contractAddress={contractAddress}
                  usdcAddress={usdcAddress}
                  contractABI={contractABI}
                  usdcABI={usdcABI}
                  showModal={showModal}
                  checkNetwork={checkNetwork}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/submit-progress"
            element={
              account ? (
                <SubmitProgress
                  account={account}
                  contract={contract}
                  showModal={showModal}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/update-progress"
            element={
              account ? (
                <UpdateProgress
                  account={account}
                  provider={provider}
                  contract={contract}
                  contractAddress={contractAddress}
                  contractABI={contractABI}
                  showModal={showModal}
                  checkNetwork={checkNetwork}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/settle-bet"
            element={
              account ? (
                <SettleBet
                  account={account}
                  provider={provider}
                  contract={contract}
                  contractAddress={contractAddress}
                  contractABI={contractABI}
                  showModal={showModal}
                  checkNetwork={checkNetwork}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/your-bets"
            element={
              account ? (
                <YourBets
                  account={account}
                  contract={contract}
                  showModal={showModal}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </div>
      {isModalOpen && (
        <Modal message={modalMessage} closeModal={closeModal} />
      )}
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;