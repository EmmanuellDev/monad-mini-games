'use client';

import { useState } from 'react';
import { FilterSidebar } from '@/components/features/marketplace/FilterSidebar';
import { DatasetGrid } from '@/components/features/marketplace/DatasetGrid';
import { motion } from 'framer-motion';
import { useMonadWallet } from '@/lib/wallet/MonadWalletProvider';
import { Wallet, AlertCircle } from 'lucide-react';

export default function MarketplacePage() {
  const { isConnected, address, chainId, connect } = useMonadWallet();
  
  const [filters, setFilters] = useState({
    search: '',
    qualityRange: [0, 100] as [number, number],
    priceRange: [0, 10000] as [number, number],
    categories: [] as string[],
    dataSize: '' as string,
    verification: [] as string[],
  });

  const [sortBy, setSortBy] = useState('recent');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <>
      <main className="min-h-screen bg-background-base pt-24">
        <div className="container-center py-12">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground-primary mb-2">
                  Dataset Marketplace
                </h1>
                <p className="text-lg md:text-xl text-foreground-secondary">
                  Discover high-quality datasets powered by blockchain
                </p>
              </div>
              
              {isConnected && address && chainId === 10143 && (
                <div className="hidden md:flex items-center gap-3 bg-background-elevated border border-purple-500/30 rounded-xl px-6 py-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-foreground-secondary font-mono">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </span>
                </div>
              )}
            </div>

            {/* Wallet Not Connected */}
            {!isConnected && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6 mb-8"
              >
                <div className="flex items-start gap-4">
                  <Wallet className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-purple-400 mb-2">
                      Connect Wallet to Purchase
                    </h3>
                    <p className="text-sm text-foreground-secondary mb-4">
                      Browse datasets freely. Connect your wallet when you're ready to make a purchase.
                    </p>
                    <button
                      onClick={connect}
                      className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors"
                      suppressHydrationWarning
                    >
                      Connect Wallet
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Wrong Network */}
            {isConnected && chainId !== 10143 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-8"
              >
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-500 mb-2">
                      Wrong Network
                    </h3>
                    <p className="text-sm text-foreground-secondary">
                      Please switch to Monad Testnet (Chain ID: 10143) to purchase datasets.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden mb-6 w-full bg-background-elevated border border-border-DEFAULT rounded-xl px-6 py-4 flex items-center justify-between text-foreground-primary hover:border-purple-400/40 transition-colors"
          >
            <span className="font-semibold">Filters</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${mobileFiltersOpen ? 'rotate-180' : ''}`}>
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filter Sidebar */}
            <aside className={`lg:w-64 flex-shrink-0 ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
              <FilterSidebar filters={filters} setFilters={setFilters} />
            </aside>

            {/* Dataset Grid */}
            <div className="flex-1 min-w-0">
              <DatasetGrid 
                filters={filters} 
                sortBy={sortBy} 
                setSortBy={setSortBy}
                isConnected={isConnected}
                userAddress={address}
                chainId={chainId}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
