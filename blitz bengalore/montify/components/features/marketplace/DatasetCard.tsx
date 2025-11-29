'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { type DatasetOnChain } from '@/lib/contract/datasetContract';
import { purchaseDataset } from '@/lib/contract/datasetContract';
import { useToast } from '@/lib/context/ToastContext';
import { addPurchaseToStorage } from '@/lib/storage/purchaseStorage';
import { ethers } from 'ethers';
import { 
  Database, 
  Calendar, 
  Tag, 
  ShoppingCart, 
  ExternalLink,
  Copy,
  Loader2,
  CheckCircle,
  User
} from 'lucide-react';
import { getIPFSUrl } from '@/lib/ipfs/pinataService';
import { PurchaseModal } from '@/components/features/dataset/PurchaseModal';

interface DatasetCardProps {
  dataset: DatasetOnChain;
  index: number;
  isConnected: boolean;
  userAddress: string | null;
  chainId: number | null;
  onPurchaseComplete?: () => void;
}

export function DatasetCard({ dataset, index, isConnected, userAddress, chainId, onPurchaseComplete }: DatasetCardProps) {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const { showToast } = useToast();

  const isOwner = userAddress?.toLowerCase() === dataset.owner.toLowerCase();
  const canPurchase = isConnected && chainId === 10143 && !isOwner;

  const handlePurchase = async () => {
    if (!canPurchase) {
      if (!isConnected) {
        showToast('Please connect your wallet first', 'warning');
      } else if (chainId !== 10143) {
        showToast('Please switch to Monad Testnet', 'warning');
      } else if (isOwner) {
        showToast('You cannot purchase your own dataset', 'warning');
      }
      return;
    }

    setShowPurchaseModal(true);
  };

  const confirmPurchase = async () => {
    setIsPurchasing(true);
    setShowPurchaseModal(false);
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const buyerAddress = await signer.getAddress();
      
      const txHash = await purchaseDataset(signer, dataset.id, dataset.price);
      
      // Store purchase in localStorage for persistence
      addPurchaseToStorage({
        datasetId: dataset.id,
        price: dataset.price,
        timestamp: Math.floor(Date.now() / 1000),
        txHash: txHash,
        buyerAddress: buyerAddress
      });
      
      showToast('Purchase successful! 🎉', 'success');
      
      if (onPurchaseComplete) {
        onPurchaseComplete();
      }
    } catch (error: any) {
      console.error('Purchase error:', error);
      if (error.message?.includes('user rejected')) {
        showToast('Purchase cancelled', 'warning');
      } else {
        showToast('Purchase failed: ' + (error.message || 'Unknown error'), 'error');
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied!`, 'success');
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const renderThumbnail = () => {
    const colors = ['#9D4EDD', '#7B2CBF', '#5A189A', '#C77DFF', '#E0AAFF'];
    const color1 = colors[index % colors.length];
    const color2 = colors[(index + 2) % colors.length];

    return (
      <div className="h-full flex items-center justify-center p-6">
        <Database className="w-20 h-20" style={{ color: color1 }} />
        <div className="absolute inset-0 bg-gradient-to-br opacity-20" style={{
          backgroundImage: `linear-gradient(135deg, ${color1}, ${color2})`
        }} />
      </div>
    );
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
      >
        <GlassCard
          hover={true}
          className="group h-full flex flex-col overflow-hidden hover:shadow-glow-purple transition-all duration-300 border-purple-500/30"
        >
          {/* Status Badge */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            {isOwner && (
              <div className="bg-green-500/20 border border-green-500/40 rounded-full px-3 py-1 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span className="text-xs font-semibold text-green-400">Your Dataset</span>
              </div>
            )}
            <div className="bg-purple-500/20 border border-purple-500/40 rounded-full px-3 py-1 flex items-center gap-1">
              <Database className="w-3 h-3 text-purple-400" />
              <span className="text-xs font-semibold text-purple-400">#{dataset.id}</span>
            </div>
          </div>

          {/* Thumbnail */}
          <div className="relative w-full h-48 bg-gradient-to-br from-background-elevated to-background-surface rounded-t-xl overflow-hidden">
            {renderThumbnail()}
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col p-5">
            {/* Category Badge */}
            <div className="mb-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/30 rounded-full text-xs text-violet-400 font-semibold capitalize">
                <Tag className="w-3 h-3" />
                {dataset.category}
              </span>
            </div>

            {/* Owner Info */}
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-purple-500/20">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground-secondary">Owner</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(dataset.owner, 'Owner address');
                  }}
                  className="text-sm text-foreground-primary font-mono hover:text-purple-400 transition-colors flex items-center gap-1"
                >
                  {formatAddress(dataset.owner)}
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* IPFS Hash */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-foreground-secondary font-semibold">IPFS Hash</span>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(dataset.dataHash, 'IPFS hash');
                    }}
                    className="p-1 hover:bg-purple-500/10 rounded transition-colors"
                  >
                    <Copy className="w-3 h-3 text-purple-400" />
                  </button>
                  <a
                    href={getIPFSUrl(dataset.dataHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 hover:bg-purple-500/10 rounded transition-colors"
                  >
                    <ExternalLink className="w-3 h-3 text-purple-400" />
                  </a>
                </div>
              </div>
              <code className="text-xs text-foreground-primary font-mono bg-background-surface px-2 py-1 rounded block truncate">
                {dataset.dataHash}
              </code>
            </div>

            {/* Created Date */}
            <div className="flex items-center gap-2 mb-4 text-xs text-foreground-secondary">
              <Calendar className="w-4 h-4" />
              <span>Created {formatDate(dataset.timestamp)}</span>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Price and Purchase */}
            <div className="mt-4 pt-4 border-t border-purple-500/20">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-foreground-secondary mb-1">Price</p>
                  <p className="text-2xl font-bold text-purple-400">{dataset.price} MONAD</p>
                </div>
              </div>

              {isOwner ? (
                <button
                  disabled
                  className="w-full px-4 py-3 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg text-sm font-semibold cursor-not-allowed"
                >
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  You Own This
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePurchase();
                  }}
                  disabled={isPurchasing || !dataset.active}
                  className={`w-full px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                    !dataset.active
                      ? 'bg-gray-500/10 border border-gray-500/30 text-gray-400 cursor-not-allowed'
                      : canPurchase
                      ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-500 hover:to-violet-500 hover:shadow-glow-purple'
                      : 'bg-purple-500/10 border border-purple-500/30 text-purple-400 hover:bg-purple-500/20'
                  }`}
                >
                  {isPurchasing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : !dataset.active ? (
                    'Inactive'
                  ) : canPurchase ? (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      Purchase Dataset
                    </>
                  ) : !isConnected ? (
                    'Connect Wallet to Purchase'
                  ) : chainId !== 10143 ? (
                    'Switch to Monad Testnet'
                  ) : (
                    'Cannot Purchase'
                  )}
                </button>
              )}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Purchase Confirmation Modal */}
      <PurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        onConfirm={confirmPurchase}
        dataset={dataset}
      />
    </>
  );
}
