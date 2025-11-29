'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useMonadWallet } from '@/lib/wallet/MonadWalletProvider';
import { 
  getDatasetsByOwner, 
  getDatasetDetails, 
  getTotalDatasets, 
  getPurchaseHistory,
  getTotalPurchases,
  type DatasetOnChain 
} from '@/lib/contract/datasetContract';
import { getStoredPurchases, getStoredPurchaseCount } from '@/lib/storage/purchaseStorage';
import { getIPFSUrl } from '@/lib/ipfs/pinataService';
import { ethers } from 'ethers';
import { 
  Wallet, 
  Database, 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  ExternalLink, 
  Copy,
  Eye,
  Calendar,
  Tag,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/lib/context/ToastContext';

interface DashboardStats {
  totalEarnings: string;
  datasetsListed: number;
  totalPurchases: number;
  totalDatasets: number;
}

export default function DashboardPage() {
  const { isConnected, address, chainId, connect } = useMonadWallet();
  const { showToast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalEarnings: '0',
    datasetsListed: 0,
    totalPurchases: 0,
    totalDatasets: 0,
  });
  const [myDatasets, setMyDatasets] = useState<DatasetOnChain[]>([]);
  const [purchasedDatasets, setPurchasedDatasets] = useState<Array<{
    dataset: DatasetOnChain;
    purchasePrice: string;
    purchaseTimestamp: number;
  }>>([]);
  const [activeTab, setActiveTab] = useState<'my-datasets' | 'purchases' | 'analytics'>('my-datasets');

  useEffect(() => {
    if (isConnected && address && chainId === 10143) {
      loadDashboardData();
    }
  }, [isConnected, address, chainId]);

  const loadDashboardData = async () => {
    if (!address) return;
    
    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Get total datasets in the system
      const total = await getTotalDatasets(provider);
      
      // Get user's datasets
      const datasetIds = await getDatasetsByOwner(provider, address);
      
      // Fetch details for each dataset
      const datasetDetails = await Promise.all(
        datasetIds.map(id => getDatasetDetails(provider, id))
      );
      
      setMyDatasets(datasetDetails);
      
      // Get purchase history from localStorage (persisted across sessions)
      const storedPurchases = getStoredPurchases(address);
      
      // Also try to get recent purchases from blockchain (last 100 blocks)
      let blockchainPurchases: any[] = [];
      try {
        blockchainPurchases = await getPurchaseHistory(provider, address);
      } catch (error) {
        console.log('Could not fetch blockchain purchases, using stored only');
      }
      
      // Merge blockchain and stored purchases, removing duplicates by txHash
      const allPurchaseData = [...storedPurchases];
      
      // Add blockchain purchases that aren't already in storage
      for (const bcPurchase of blockchainPurchases) {
        const exists = storedPurchases.some(sp => sp.datasetId === bcPurchase.datasetId);
        if (!exists) {
          allPurchaseData.push({
            datasetId: bcPurchase.datasetId,
            price: ethers.formatEther(bcPurchase.price),
            timestamp: bcPurchase.timestamp,
            txHash: 'N/A',
            buyerAddress: address
          });
        }
      }
      
      // Fetch dataset details for each purchase
      const purchasedDetails = await Promise.all(
        allPurchaseData.map(async (purchase) => {
          const dataset = await getDatasetDetails(provider, purchase.datasetId);
          return {
            dataset,
            purchasePrice: purchase.price,
            purchaseTimestamp: purchase.timestamp
          };
        })
      );
      
      setPurchasedDatasets(purchasedDetails);
      
      const totalPurchasesCount = allPurchaseData.length;
      
      // Calculate total earnings (sum of prices of user's datasets)
      const totalEarnings = datasetDetails.reduce((sum, dataset) => {
        return sum + parseFloat(dataset.price);
      }, 0);
      
      setStats({
        totalEarnings: totalEarnings.toFixed(4),
        datasetsListed: datasetDetails.length,
        totalPurchases: totalPurchasesCount,
        totalDatasets: total,
      });
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`, 'success');
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <main className="min-h-screen bg-background-base pt-24">
        <div className="container-center py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground-primary mb-2">
                  Dashboard
                </h1>
                <p className="text-lg text-foreground-secondary">
                  Manage your datasets and track your earnings
                </p>
              </div>
              
              {isConnected && address && (
                <div className="hidden md:flex items-center gap-3 bg-background-elevated border border-purple-500/30 rounded-xl px-6 py-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-foreground-secondary">
                    {formatAddress(address)}
                  </span>
                </div>
              )}
            </div>

            {/* Wallet Connection Prompt */}
            {!isConnected && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-8 text-center"
              >
                <Wallet className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground-primary mb-2">
                  Connect Your Wallet
                </h3>
                <p className="text-foreground-secondary mb-6">
                  Connect your wallet to view your dashboard and manage your datasets
                </p>
                <button
                  onClick={connect}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-full font-semibold hover:from-purple-500 hover:to-violet-500 hover:shadow-glow-purple transition-all duration-200"
                >
                  Connect Wallet
                </button>
              </motion.div>
            )}

            {/* Wrong Network Warning */}
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
                      Please switch to Monad Testnet (Chain ID: 10143) to view your dashboard.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Dashboard Content */}
          {isConnected && chainId === 10143 && (
            <>
              {/* Stats Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
              >
                <div className="bg-background-elevated/60 backdrop-blur-2xl border border-purple-500/30 rounded-xl p-6 hover:border-purple-400/50 hover:shadow-glow-purple transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <DollarSign className="w-8 h-8 text-purple-400" />
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="text-3xl font-bold text-foreground-primary mb-1">
                    {isLoading ? '...' : `${stats.totalEarnings} MONAD`}
                  </div>
                  <div className="text-sm text-foreground-secondary">Total Earnings</div>
                </div>

                <div className="bg-background-elevated/60 backdrop-blur-2xl border border-purple-500/30 rounded-xl p-6 hover:border-purple-400/50 hover:shadow-glow-purple transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <Database className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold text-foreground-primary mb-1">
                    {isLoading ? '...' : stats.datasetsListed}
                  </div>
                  <div className="text-sm text-foreground-secondary">Datasets Listed</div>
                </div>

                <div className="bg-background-elevated/60 backdrop-blur-2xl border border-purple-500/30 rounded-xl p-6 hover:border-purple-400/50 hover:shadow-glow-purple transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <ShoppingCart className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold text-foreground-primary mb-1">
                    {isLoading ? '...' : stats.totalPurchases}
                  </div>
                  <div className="text-sm text-foreground-secondary">Purchases</div>
                </div>

                <div className="bg-background-elevated/60 backdrop-blur-2xl border border-purple-500/30 rounded-xl p-6 hover:border-purple-400/50 hover:shadow-glow-purple transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <Eye className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold text-foreground-primary mb-1">
                    {isLoading ? '...' : stats.totalDatasets}
                  </div>
                  <div className="text-sm text-foreground-secondary">Total in Marketplace</div>
                </div>
              </motion.div>

              {/* Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="mb-8"
              >
                <div className="flex gap-4 border-b border-border-DEFAULT">
                  <button
                    onClick={() => setActiveTab('my-datasets')}
                    className={`px-6 py-3 font-semibold transition-all ${
                      activeTab === 'my-datasets'
                        ? 'text-purple-400 border-b-2 border-purple-400'
                        : 'text-foreground-secondary hover:text-foreground-primary'
                    }`}
                  >
                    My Datasets
                  </button>
                  <button
                    onClick={() => setActiveTab('purchases')}
                    className={`px-6 py-3 font-semibold transition-all ${
                      activeTab === 'purchases'
                        ? 'text-purple-400 border-b-2 border-purple-400'
                        : 'text-foreground-secondary hover:text-foreground-primary'
                    }`}
                  >
                    Purchases
                  </button>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`px-6 py-3 font-semibold transition-all ${
                      activeTab === 'analytics'
                        ? 'text-purple-400 border-b-2 border-purple-400'
                        : 'text-foreground-secondary hover:text-foreground-primary'
                    }`}
                  >
                    Analytics
                  </button>
                </div>
              </motion.div>

              {/* Tab Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                {/* My Datasets Tab */}
                {activeTab === 'my-datasets' && (
                  <div>
                    {isLoading ? (
                      <div className="text-center py-12">
                        <div className="animate-spin w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full mx-auto mb-4" />
                        <p className="text-foreground-secondary">Loading your datasets...</p>
                      </div>
                    ) : myDatasets.length === 0 ? (
                      <div className="text-center py-12 bg-background-elevated/60 backdrop-blur-2xl border border-purple-500/20 rounded-xl">
                        <Database className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-bold text-foreground-primary mb-2">
                          No Datasets Yet
                        </h3>
                        <p className="text-foreground-secondary mb-6">
                          Start by uploading your first dataset to the marketplace
                        </p>
                        <Link href="/upload">
                          <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-full font-semibold hover:from-purple-500 hover:to-violet-500 hover:shadow-glow-purple transition-all duration-200">
                            Upload Dataset
                          </button>
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-6">
                        {myDatasets.map((dataset) => (
                          <motion.div
                            key={dataset.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-background-elevated/60 backdrop-blur-2xl border border-purple-500/20 rounded-xl p-6 hover:border-purple-400/40 hover:shadow-glow-purple transition-all"
                          >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm font-semibold">
                                    #{dataset.id}
                                  </span>
                                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                    dataset.active 
                                      ? 'bg-green-500/10 text-green-400' 
                                      : 'bg-gray-500/10 text-gray-400'
                                  }`}>
                                    {dataset.active ? 'Active' : 'Inactive'}
                                  </span>
                                  <span className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full text-sm font-semibold capitalize">
                                    {dataset.category}
                                  </span>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <div className="flex items-center gap-2 text-sm text-foreground-secondary mb-1">
                                      <Database className="w-4 h-4" />
                                      Data Hash
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <code className="text-sm text-foreground-primary font-mono">
                                        {dataset.dataHash.slice(0, 12)}...{dataset.dataHash.slice(-8)}
                                      </code>
                                      <button
                                        onClick={() => copyToClipboard(dataset.dataHash, 'Data Hash')}
                                        className="p-1 hover:bg-purple-500/10 rounded transition-colors"
                                      >
                                        <Copy className="w-4 h-4 text-purple-400" />
                                      </button>
                                      <a
                                        href={getIPFSUrl(dataset.dataHash)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1 hover:bg-purple-500/10 rounded transition-colors"
                                      >
                                        <ExternalLink className="w-4 h-4 text-purple-400" />
                                      </a>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <div className="flex items-center gap-2 text-sm text-foreground-secondary mb-1">
                                      <Calendar className="w-4 h-4" />
                                      Created
                                    </div>
                                    <p className="text-sm text-foreground-primary">
                                      {formatDate(dataset.timestamp)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex flex-col items-end gap-2">
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-purple-400 mb-1">
                                    {dataset.price} MONAD
                                  </div>
                                  <div className="text-sm text-foreground-secondary">
                                    List Price
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Purchases Tab */}
                {activeTab === 'purchases' && (
                  <div>
                    {isLoading ? (
                      <div className="text-center py-12">
                        <div className="animate-spin w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full mx-auto mb-4" />
                        <p className="text-foreground-secondary">Loading your purchases...</p>
                      </div>
                    ) : purchasedDatasets.length === 0 ? (
                      <div className="text-center py-12 bg-background-elevated/60 backdrop-blur-2xl border border-purple-500/20 rounded-xl">
                        <ShoppingCart className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-bold text-foreground-primary mb-2">
                          No Purchases Yet
                        </h3>
                        <p className="text-foreground-secondary mb-6">
                          Browse the marketplace to find datasets for your projects
                        </p>
                        <Link href="/marketplace">
                          <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-full font-semibold hover:from-purple-500 hover:to-violet-500 hover:shadow-glow-purple transition-all duration-200">
                            Browse Marketplace
                          </button>
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-6">
                        {purchasedDatasets.map((purchase, index) => (
                          <motion.div
                            key={`${purchase.dataset.id}-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-background-elevated/60 backdrop-blur-2xl border border-purple-500/20 rounded-xl p-6 hover:border-purple-400/40 hover:shadow-glow-purple transition-all"
                          >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm font-semibold">
                                    Purchased
                                  </span>
                                  <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm font-semibold">
                                    #{purchase.dataset.id}
                                  </span>
                                  <span className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full text-sm font-semibold capitalize">
                                    {purchase.dataset.category}
                                  </span>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <div className="flex items-center gap-2 text-sm text-foreground-secondary mb-1">
                                      <Database className="w-4 h-4" />
                                      Data Hash
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <code className="text-sm text-foreground-primary font-mono">
                                        {purchase.dataset.dataHash.slice(0, 12)}...{purchase.dataset.dataHash.slice(-8)}
                                      </code>
                                      <button
                                        onClick={() => copyToClipboard(purchase.dataset.dataHash, 'Data Hash')}
                                        className="p-1 hover:bg-purple-500/10 rounded transition-colors"
                                      >
                                        <Copy className="w-4 h-4 text-purple-400" />
                                      </button>
                                      <a
                                        href={getIPFSUrl(purchase.dataset.dataHash)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1 hover:bg-purple-500/10 rounded transition-colors"
                                      >
                                        <ExternalLink className="w-4 h-4 text-purple-400" />
                                      </a>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <div className="flex items-center gap-2 text-sm text-foreground-secondary mb-1">
                                      <Calendar className="w-4 h-4" />
                                      Purchased On
                                    </div>
                                    <p className="text-sm text-foreground-primary">
                                      {formatDate(purchase.purchaseTimestamp)}
                                    </p>
                                  </div>

                                  <div>
                                    <div className="flex items-center gap-2 text-sm text-foreground-secondary mb-1">
                                      <Wallet className="w-4 h-4" />
                                      Seller
                                    </div>
                                    <p className="text-sm text-foreground-primary font-mono">
                                      {formatAddress(purchase.dataset.owner)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex flex-col items-end gap-2">
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-green-400 mb-1">
                                    {purchase.purchasePrice} MONAD
                                  </div>
                                  <div className="text-sm text-foreground-secondary">
                                    Purchase Price
                                  </div>
                                </div>
                                <a
                                  href={getIPFSUrl(purchase.dataset.dataHash)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-4 py-2 bg-purple-500/20 border border-purple-400/30 text-purple-400 rounded-lg font-semibold hover:bg-purple-500/30 transition-all flex items-center gap-2"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  View Dataset
                                </a>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                  <div className="bg-background-elevated/60 backdrop-blur-2xl border border-purple-500/20 rounded-xl p-8">
                    <h3 className="text-2xl font-bold text-foreground-primary mb-6">
                      Analytics Overview
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-background-surface/60 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-foreground-primary mb-4">
                          Earnings Breakdown
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-foreground-secondary">Total Revenue</span>
                            <span className="font-bold text-purple-400">{stats.totalEarnings} MONAD</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-foreground-secondary">Active Listings</span>
                            <span className="font-bold text-foreground-primary">{stats.datasetsListed}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-foreground-secondary">Avg. Price</span>
                            <span className="font-bold text-foreground-primary">
                              {stats.datasetsListed > 0 
                                ? (parseFloat(stats.totalEarnings) / stats.datasetsListed).toFixed(4)
                                : '0.00'} MONAD
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-background-surface/60 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-foreground-primary mb-4">
                          Performance Metrics
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-foreground-secondary">Total Views</span>
                            <span className="font-bold text-foreground-primary">Coming Soon</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-foreground-secondary">Conversion Rate</span>
                            <span className="font-bold text-foreground-primary">Coming Soon</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-foreground-secondary">Downloads</span>
                            <span className="font-bold text-foreground-primary">Coming Soon</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="mt-12 flex gap-4 justify-center"
              >
                <Link href="/upload">
                  <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-full font-semibold hover:from-purple-500 hover:to-violet-500 hover:shadow-glow-purple transition-all duration-200">
                    Upload New Dataset
                  </button>
                </Link>
                <Link href="/marketplace">
                  <button className="px-8 py-4 bg-transparent border-2 border-purple-500/50 text-white rounded-full font-semibold hover:bg-purple-500/10 hover:border-purple-400/80 transition-all duration-200">
                    Browse Marketplace
                  </button>
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
