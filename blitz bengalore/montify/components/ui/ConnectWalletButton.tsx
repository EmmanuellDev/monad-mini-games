'use client';

import React, { useState } from 'react';
import { Wallet, LogOut, AlertCircle, Check } from 'lucide-react';
import { useMonadWallet } from '@/lib/wallet/MonadWalletProvider';
import { motion, AnimatePresence } from 'framer-motion';

export function ConnectWalletButton() {
  const { address, isConnected, chainId, balance, connect, disconnect, switchToMonad } = useMonadWallet();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      await connect();
    } catch (error) {
      console.error('Connection error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setShowDropdown(false);
  };

  const handleSwitchNetwork = async () => {
    setIsLoading(true);
    try {
      await switchToMonad();
    } catch (error) {
      console.error('Network switch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBalance = (bal: string | null) => {
    if (!bal) return '0.00';
    const num = parseFloat(bal);
    return num.toFixed(4);
  };

  const isCorrectNetwork = chainId === 10143;

  if (!isConnected) {
    return (
      <button
        onClick={handleConnect}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Wallet size={18} />
        {isLoading ? 'Connecting...' : 'Connect Wallet'}
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          isCorrectNetwork
            ? 'bg-white/10 hover:bg-white/20 border border-white/20'
            : 'bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50'
        }`}
      >
        <div className="flex items-center gap-2">
          {isCorrectNetwork ? (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          ) : (
            <AlertCircle size={16} className="text-orange-500" />
          )}
          <span className="text-sm font-mono">{formatAddress(address!)}</span>
        </div>
        <div className="h-4 w-px bg-white/20" />
        <span className="text-sm font-semibold">{formatBalance(balance)} MON</span>
      </button>

      <AnimatePresence>
        {showDropdown && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-80 bg-[#1C1C1E] border border-white/10 rounded-lg shadow-2xl overflow-hidden z-50"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Wallet Address</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(address!);
                    }}
                    className="text-xs text-pink-500 hover:text-pink-400"
                  >
                    Copy
                  </button>
                </div>
                <p className="font-mono text-sm text-white">{address}</p>
              </div>

              {/* Balance */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Balance</span>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">{formatBalance(balance)} MON</p>
                    <p className="text-xs text-gray-500">Monad Testnet</p>
                  </div>
                </div>
              </div>

              {/* Network Status */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Network</span>
                  {isCorrectNetwork ? (
                    <div className="flex items-center gap-1 text-green-500 text-xs">
                      <Check size={14} />
                      <span>Connected</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-orange-500 text-xs">
                      <AlertCircle size={14} />
                      <span>Wrong Network</span>
                    </div>
                  )}
                </div>
                
                {isCorrectNetwork ? (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm text-white">Monad Testnet</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      <span className="text-sm text-white">Chain ID: {chainId}</span>
                    </div>
                    <button
                      onClick={handleSwitchNetwork}
                      disabled={isLoading}
                      className="w-full px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Switching...' : 'Switch to Monad Testnet'}
                    </button>
                  </div>
                )}
              </div>

              {/* Explorer Link */}
              <div className="p-4 border-b border-white/10">
                <a
                  href={`https://testnet.monadexplorer.com/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-sm text-pink-500 hover:text-pink-400"
                >
                  <span>View on Explorer</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              {/* Disconnect */}
              <div className="p-4">
                <button
                  onClick={handleDisconnect}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg font-medium transition-colors"
                >
                  <LogOut size={18} />
                  Disconnect Wallet
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
