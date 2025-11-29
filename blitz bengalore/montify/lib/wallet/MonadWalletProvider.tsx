'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

interface MonadWalletContextType {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  balance: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToMonad: () => Promise<void>;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
}

const MonadWalletContext = createContext<MonadWalletContextType>({
  address: null,
  isConnected: false,
  chainId: null,
  balance: null,
  connect: async () => {},
  disconnect: () => {},
  switchToMonad: async () => {},
  provider: null,
  signer: null,
});

export const useMonadWallet = () => useContext(MonadWalletContext);

const MONAD_TESTNET = {
  chainId: '0x279F', // 10143 in hex
  chainName: 'Monad Testnet',
  nativeCurrency: {
    name: 'Monad',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: ['https://testnet-rpc.monad.xyz'],
  blockExplorerUrls: ['https://testnet.monadexplorer.com'],
};

export function MonadWalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  const getBalance = useCallback(async (address: string, provider: ethers.BrowserProvider) => {
    try {
      const balance = await provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      return null;
    }
  }, []);

  const switchToMonad = useCallback(async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask or another Web3 wallet');
      return;
    }

    try {
      // Try to switch to Monad testnet
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: MONAD_TESTNET.chainId }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [MONAD_TESTNET],
          });
        } catch (addError) {
          console.error('Error adding Monad network:', addError);
          throw addError;
        }
      } else {
        console.error('Error switching to Monad network:', switchError);
        throw switchError;
      }
    }
  }, []);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask or another Web3 wallet');
      return;
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const currentChainId = Number(network.chainId);

        setProvider(provider);
        setSigner(signer);
        setAddress(accounts[0]);
        setChainId(currentChainId);
        setIsConnected(true);

        // Get balance
        const bal = await getBalance(accounts[0], provider);
        setBalance(bal);

        // Check if we're on Monad testnet
        if (currentChainId !== 10143) {
          // Automatically switch to Monad testnet
          await switchToMonad();
        }
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  }, [getBalance, switchToMonad]);

  const disconnect = useCallback(() => {
    setAddress(null);
    setIsConnected(false);
    setChainId(null);
    setBalance(null);
    setProvider(null);
    setSigner(null);
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else if (accounts[0] !== address) {
        setAddress(accounts[0]);
        if (provider) {
          getBalance(accounts[0], provider).then(setBalance);
        }
      }
    };

    const handleChainChanged = (chainId: string) => {
      const newChainId = parseInt(chainId, 16);
      setChainId(newChainId);
      
      // Reload page when chain changes (recommended by MetaMask)
      window.location.reload();
    };

    const handleDisconnect = () => {
      disconnect();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    window.ethereum.on('disconnect', handleDisconnect);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
      window.ethereum?.removeListener('disconnect', handleDisconnect);
    };
  }, [address, provider, disconnect, getBalance]);

  // Auto-connect if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      if (!window.ethereum) return;

      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });

        if (accounts.length > 0) {
          await connect();
        }
      } catch (error) {
        console.error('Error auto-connecting:', error);
      }
    };

    autoConnect();
  }, []);

  const value: MonadWalletContextType = {
    address,
    isConnected,
    chainId,
    balance,
    connect,
    disconnect,
    switchToMonad,
    provider,
    signer,
  };

  return (
    <MonadWalletContext.Provider value={value}>
      {children}
    </MonadWalletContext.Provider>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
