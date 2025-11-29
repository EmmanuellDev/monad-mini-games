'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Trophy, Plus, TrendingUp, AlertCircle, Loader2, Filter } from 'lucide-react';
import { BountyCard } from '@/components/features/bounty/BountyCard';
import { CreateBountyModal } from '@/components/features/bounty/CreateBountyModal';
import { Bounty, getTotalBounties, getBountyDetails, BOUNTY_CONTRACT_ADDRESS } from '@/lib/contract/bountyContract';
import { ethers } from 'ethers';

export default function BountiesPage() {
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'fulfilled' | 'cancelled'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'reward' | 'deadline'>('newest');

  // Connect wallet
  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      if (!window.ethereum) {
        alert('Please install MetaMask to use this feature');
        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  // Load bounties from blockchain
  const loadBounties = async () => {
    try {
      setIsLoading(true);

      // Check if contract is deployed
      if (BOUNTY_CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
        console.log('Bounty contract not deployed yet');
        setBounties([]);
        return;
      }

      const provider = new ethers.JsonRpcProvider('https://testnet-rpc.monad.xyz');
      const total = await getTotalBounties(provider);

      const loadedBounties: Bounty[] = [];
      for (let i = 0; i < total; i++) {
        try {
          const bounty = await getBountyDetails(provider, i);
          loadedBounties.push(bounty);
        } catch (err) {
          console.error(`Error loading bounty ${i}:`, err);
        }
      }

      setBounties(loadedBounties);
    } catch (err) {
      console.error('Error loading bounties:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBounties();

    // Check if wallet is already connected
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      });
    }
  }, []);

  // Filter and sort bounties
  const filteredBounties = bounties
    .filter(bounty => {
      if (filterStatus === 'all') return true;
      if (filterStatus === 'active') return bounty.status === 0;
      if (filterStatus === 'fulfilled') return bounty.status === 1;
      if (filterStatus === 'cancelled') return bounty.status === 2;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return b.timestamp - a.timestamp;
      if (sortBy === 'reward') return Number(b.reward - a.reward);
      if (sortBy === 'deadline') return a.deadline - b.deadline;
      return 0;
    });

  const activeBounties = bounties.filter(b => b.status === 0).length;
  const totalRewards = bounties.reduce((sum, b) => sum + Number(ethers.formatEther(b.reward)), 0);

  return (
    <>
      <main className="min-h-screen bg-background-base pt-24">
        <div className="container-center py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center shadow-glow-purple">
              <Trophy className="w-10 h-10 text-white" />
            </div>

            <h1 className="font-display text-5xl font-bold text-foreground-primary mb-4">
              Bounty Board
            </h1>

            <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
              Post dataset requests or compete to fulfill bounties and earn rewards
            </p>
          </motion.div>

          {/* Wallet Connection Banner */}
          {BOUNTY_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000' && !walletAddress && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-6 bg-purple-500/10 border border-purple-400/30 rounded-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-purple-400" />
                  <p className="text-foreground-primary font-medium">
                    Connect your wallet to create or submit to bounties
                  </p>
                </div>
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-violet-500 hover:shadow-glow-purple disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    'Connect Wallet'
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* Contract Not Deployed Notice */}
          {BOUNTY_CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-6 bg-yellow-500/10 border border-yellow-400/30 rounded-2xl"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-foreground-primary font-medium mb-1">
                    Bounty Contract Not Deployed
                  </p>
                  <p className="text-sm text-foreground-secondary">
                    Deploy the BountyRegistry.sol contract and update the address in lib/contract/bountyContract.ts
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="p-6 bg-background-elevated/60 backdrop-blur-2xl border border-purple-500/30 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-5 h-5 text-purple-400" />
                <span className="text-foreground-secondary text-sm">Active Bounties</span>
              </div>
              <div className="text-3xl font-bold text-foreground-primary">{activeBounties}</div>
            </div>

            <div className="p-6 bg-background-elevated/60 backdrop-blur-2xl border border-purple-500/30 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span className="text-foreground-secondary text-sm">Total Rewards</span>
              </div>
              <div className="text-3xl font-bold text-foreground-primary">{totalRewards.toFixed(2)} MONAD</div>
            </div>

            <div className="p-6 bg-background-elevated/60 backdrop-blur-2xl border border-purple-500/30 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-5 h-5 text-purple-400" />
                <span className="text-foreground-secondary text-sm">Total Bounties</span>
              </div>
              <div className="text-3xl font-bold text-foreground-primary">{bounties.length}</div>
            </div>
          </motion.div>

          {/* Filters and Create Button */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-foreground-secondary" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 bg-background-elevated border border-border-DEFAULT rounded-xl text-foreground-primary focus:outline-none focus:ring-2 focus:ring-purple-500"
                suppressHydrationWarning
              >
                <option value="all">All Bounties</option>
                <option value="active">Active Only</option>
                <option value="fulfilled">Fulfilled</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 bg-background-elevated border border-border-DEFAULT rounded-xl text-foreground-primary focus:outline-none focus:ring-2 focus:ring-purple-500"
                suppressHydrationWarning
              >
                <option value="newest">Newest First</option>
                <option value="reward">Highest Reward</option>
                <option value="deadline">Ending Soon</option>
              </select>
            </div>

            {walletAddress && BOUNTY_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-violet-500 hover:shadow-glow-purple transition-all duration-200 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Bounty
              </button>
            )}
          </div>

          {/* Bounties Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
            </div>
          ) : filteredBounties.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {filteredBounties.map((bounty) => (
                <BountyCard
                  key={bounty.id}
                  bounty={bounty}
                  onSubmit={loadBounties}
                  isOwner={walletAddress.toLowerCase() === bounty.creator.toLowerCase()}
                />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-24">
              <Trophy className="w-16 h-16 text-foreground-tertiary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground-primary mb-2">
                No bounties found
              </h3>
              <p className="text-foreground-secondary">
                {filterStatus !== 'all' ? 'Try changing the filter' : 'Be the first to create a bounty!'}
              </p>
            </div>
          )}
        </div>
      </main>

      <CreateBountyModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateSuccess={loadBounties}
      />
    </>
  );
}
