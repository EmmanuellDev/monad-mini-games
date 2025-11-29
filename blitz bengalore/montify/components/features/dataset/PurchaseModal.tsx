'use client';

import { Modal } from '@/components/ui/Modal';
import { motion } from 'framer-motion';
import { type DatasetOnChain } from '@/lib/contract/datasetContract';
import { ShoppingCart, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  dataset: DatasetOnChain;
}

export function PurchaseModal({
  isOpen,
  onClose,
  onConfirm,
  dataset,
}: PurchaseModalProps) {
  const platformFee = (parseFloat(dataset.price) * 0.025).toFixed(4); // 2.5% platform fee
  const total = (parseFloat(dataset.price) + parseFloat(platformFee)).toFixed(4);

  return (
    <Modal open={isOpen} onClose={onClose} size="md">
      <div>
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center shadow-glow-purple">
            <ShoppingCart className="w-10 h-10 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold text-foreground-primary mb-2">
            Confirm Purchase
          </h3>
          <p className="text-foreground-secondary">
            Review the details before completing your purchase
          </p>
        </div>

        {/* Dataset Info */}
        <div className="bg-background-surface/60 rounded-xl p-6 mb-6 space-y-4">
          <div className="flex justify-between items-start">
            <span className="text-foreground-secondary">Dataset ID</span>
            <span className="font-semibold text-foreground-primary">#{dataset.id}</span>
          </div>
          
          <div className="flex justify-between items-start">
            <span className="text-foreground-secondary">Category</span>
            <span className="font-semibold text-foreground-primary capitalize">{dataset.category}</span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-foreground-secondary">IPFS Hash</span>
            <a
              href={`https://green-obedient-lizard-820.mypinata.cloud/ipfs/${dataset.dataHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
            >
              {dataset.dataHash.slice(0, 8)}...{dataset.dataHash.slice(-6)}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="border-t border-purple-500/20 pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-foreground-secondary">Dataset Price</span>
              <span className="font-semibold text-foreground-primary">{dataset.price} MONAD</span>
            </div>
            
            <div className="flex justify-between mb-2">
              <span className="text-foreground-secondary">Platform Fee (2.5%)</span>
              <span className="font-semibold text-foreground-primary">{platformFee} MONAD</span>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-foreground-secondary">Network Fee (est.)</span>
              <span className="font-semibold text-foreground-primary">~0.001 MONAD</span>
            </div>

            <div className="border-t border-purple-500/20 pt-3 mt-3 flex justify-between">
              <span className="font-bold text-foreground-primary text-lg">Total</span>
              <span className="font-bold text-purple-400 text-2xl">{total} MONAD</span>
            </div>
          </div>
        </div>

        {/* What You'll Receive */}
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-purple-400 mb-2">What you'll receive:</p>
              <ul className="text-sm text-foreground-secondary space-y-1.5">
                <li>• Full access to dataset via IPFS</li>
                <li>• Permanent ownership record on blockchain</li>
                <li>• Download rights and usage license</li>
                <li>• Metadata and quality information</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Payment Destination Notice */}
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-foreground-secondary">
                <strong className="text-orange-400">Payment Destination:</strong>
                <br />
                All payments go to the platform address. The blockchain will record your purchase and grant you access to the dataset.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onConfirm}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-full font-semibold hover:from-purple-500 hover:to-violet-500 hover:shadow-glow-purple transition-all duration-200 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Confirm Purchase ({total} MONAD)
          </button>
          <button
            onClick={onClose}
            className="w-full px-6 py-4 bg-transparent border-2 border-purple-500/50 text-foreground-primary rounded-full font-semibold hover:bg-purple-500/10 hover:border-purple-400/80 transition-all duration-200"
          >
            Cancel
          </button>
        </div>

        {/* Transaction Note */}
        <p className="text-xs text-foreground-tertiary text-center mt-4">
          This will trigger a transaction in your wallet. Please confirm when prompted.
        </p>
      </div>
    </Modal>
  );
}
