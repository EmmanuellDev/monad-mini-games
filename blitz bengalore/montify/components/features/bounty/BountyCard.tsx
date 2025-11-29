'use client';

import { motion } from 'framer-motion';
import { Trophy, Clock, Users, ExternalLink, CheckCircle2, XCircle } from 'lucide-react';
import { useState } from 'react';
import { Bounty } from '@/lib/contract/bountyContract';
import { ethers } from 'ethers';
import { SubmitBountyModal } from './SubmitBountyModal';

interface BountyCardProps {
  bounty: Bounty;
  onSubmit?: (bountyId: number) => void;
  isOwner?: boolean;
}

export function BountyCard({ bounty, onSubmit, isOwner }: BountyCardProps) {
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  
  const rewardInEth = ethers.formatEther(bounty.reward);
  const now = Math.floor(Date.now() / 1000);
  const timeLeft = bounty.deadline - now;
  const daysLeft = Math.floor(timeLeft / 86400);
  const hoursLeft = Math.floor((timeLeft % 86400) / 3600);
  const isExpired = timeLeft <= 0;
  
  const statusConfig = {
    0: { label: 'Active', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-400/30' },
    1: { label: 'Fulfilled', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-400/30' },
    2: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-400/30' }
  };
  
  const config = statusConfig[bounty.status];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background-elevated/60 backdrop-blur-2xl border border-purple-500/30 rounded-2xl p-6 hover:border-purple-400/50 hover:shadow-sm-glow-purple transition-all"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-purple-400" />
              <span className={`px-2 py-1 ${config.bg} border ${config.border} rounded-full text-xs ${config.color} font-semibold`}>
                {config.label}
              </span>
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground-primary mb-2">
              {bounty.title}
            </h3>
            <p className="text-sm text-foreground-secondary line-clamp-2">
              {bounty.description}
            </p>
          </div>
          
          <div className="ml-4 text-right">
            <div className="text-2xl font-bold text-purple-400">
              {Number(rewardInEth).toFixed(4)} MONAD
            </div>
            <div className="text-xs text-foreground-secondary">Reward</div>
          </div>
        </div>

        {/* Category */}
        <div className="mb-4">
          <span className="px-3 py-1 bg-purple-500/10 border border-purple-400/20 rounded-full text-purple-300 text-xs">
            {bounty.category}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm text-foreground-secondary">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {isExpired ? (
              <span className="text-red-400">Expired</span>
            ) : (
              <span>
                {daysLeft > 0 ? `${daysLeft}d ` : ''}{hoursLeft}h left
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>{bounty.submissionCount} submission{bounty.submissionCount !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* IPFS Metadata Link */}
        {bounty.metadataHash && (
          <div className="mb-4">
            <a
              href={`https://gateway.pinata.cloud/ipfs/${bounty.metadataHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              View Full Requirements
            </a>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {bounty.status === 0 && !isExpired && !isOwner && (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-violet-500 hover:shadow-glow-purple transition-all duration-200"
            >
              Submit Solution
            </button>
          )}
          {isOwner && bounty.status === 0 && (
            <div className="flex-1 px-4 py-2.5 bg-purple-500/10 border border-purple-400/30 text-purple-400 rounded-xl font-semibold text-center">
              Your Bounty
            </div>
          )}
          {bounty.status === 1 && (
            <div className="flex-1 px-4 py-2.5 bg-green-500/10 border border-green-400/30 rounded-xl flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-semibold">Fulfilled</span>
            </div>
          )}
          {bounty.status === 2 && (
            <div className="flex-1 px-4 py-2.5 bg-red-500/10 border border-red-400/30 rounded-xl flex items-center justify-center gap-2">
              <XCircle className="w-4 h-4 text-red-400" />
              <span className="text-red-400 font-semibold">Cancelled</span>
            </div>
          )}
        </div>

        {/* Creator Info */}
        <div className="mt-4 pt-4 border-t border-white/5 text-xs text-foreground-secondary">
          <div className="flex items-center justify-between">
            <span>Creator: {bounty.creator.slice(0, 6)}...{bounty.creator.slice(-4)}</span>
            <span>{new Date(bounty.timestamp * 1000).toLocaleDateString()}</span>
          </div>
        </div>
      </motion.div>

      <SubmitBountyModal
        open={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        bounty={bounty}
        onSubmitSuccess={() => {
          setShowSubmitModal(false);
          onSubmit?.(bounty.id);
        }}
      />
    </>
  );
}
