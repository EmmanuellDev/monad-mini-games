'use client';

import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';
import { createBounty } from '@/lib/contract/bountyContract';
import { ethers } from 'ethers';
import { Loader2, Calendar, DollarSign } from 'lucide-react';
import { pinJSONToIPFS } from '@/lib/ipfs/pinataService';

interface CreateBountyModalProps {
  open: boolean;
  onClose: () => void;
  onCreateSuccess?: () => void;
}

const CATEGORIES = [
  'Healthcare',
  'Finance',
  'Education',
  'Transportation',
  'Energy',
  'Agriculture',
  'Retail',
  'Manufacturing',
  'Entertainment',
  'Real Estate',
  'Other'
];

export function CreateBountyModal({ open, onClose, onCreateSuccess }: CreateBountyModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Healthcare',
    reward: '',
    daysUntilDeadline: '7',
    requirements: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleCreate = async () => {
    // Validation
    if (!formData.title.trim()) {
      setError('Please enter a bounty title');
      return;
    }
    if (!formData.description.trim()) {
      setError('Please enter a description');
      return;
    }
    if (!formData.reward || parseFloat(formData.reward) <= 0) {
      setError('Please enter a valid reward amount');
      return;
    }
    if (!formData.daysUntilDeadline || parseInt(formData.daysUntilDeadline) <= 0) {
      setError('Please enter a valid deadline');
      return;
    }

    try {
      setIsCreating(true);
      setError('');

      if (!window.ethereum) {
        throw new Error('Please install MetaMask');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Upload detailed requirements to IPFS
      const metadata = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        requirements: formData.requirements || 'No specific requirements provided',
        reward: formData.reward,
        createdAt: new Date().toISOString()
      };

      const metadataHash = await pinJSONToIPFS(metadata, `bounty-${Date.now()}.json`);

      // Calculate deadline timestamp
      const daysInSeconds = parseInt(formData.daysUntilDeadline) * 24 * 60 * 60;
      const deadlineTimestamp = Math.floor(Date.now() / 1000) + daysInSeconds;

      // Create bounty on blockchain
      const tx = await createBounty(
        signer,
        formData.title,
        formData.description,
        metadataHash,
        formData.category,
        deadlineTimestamp,
        formData.reward
      );

      await tx.wait();

      onCreateSuccess?.();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'Healthcare',
        reward: '',
        daysUntilDeadline: '7',
        requirements: ''
      });
      
      onClose();
    } catch (err: any) {
      console.error('Bounty creation error:', err);
      setError(err.message || 'Failed to create bounty');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create New Bounty" size="lg">
      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-foreground-primary mb-2">
            Bounty Title *
          </label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., High-Resolution Satellite Imagery Dataset"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground-primary mb-2">
            Short Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Brief overview of what you're looking for..."
            className="w-full px-4 py-3 bg-background-base border border-border-DEFAULT rounded-xl text-foreground-primary placeholder-foreground-tertiary focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            rows={3}
          />
        </div>

        {/* Requirements */}
        <div>
          <label className="block text-sm font-medium text-foreground-primary mb-2">
            Detailed Requirements
          </label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleInputChange}
            placeholder="Specify format, quality, size, and any other requirements..."
            className="w-full px-4 py-3 bg-background-base border border-border-DEFAULT rounded-xl text-foreground-primary placeholder-foreground-tertiary focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            rows={4}
          />
        </div>

        {/* Category and Reward */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground-primary mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-background-base border border-border-DEFAULT rounded-xl text-foreground-primary focus:outline-none focus:ring-2 focus:ring-purple-500"
              suppressHydrationWarning
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground-primary mb-2">
              Reward (MONAD) *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-tertiary" />
              <Input
                name="reward"
                type="number"
                step="0.001"
                min="0"
                value={formData.reward}
                onChange={handleInputChange}
                placeholder="0.00"
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-sm font-medium text-foreground-primary mb-2">
            Deadline (Days from now) *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-tertiary" />
            <Input
              name="daysUntilDeadline"
              type="number"
              min="1"
              value={formData.daysUntilDeadline}
              onChange={handleInputChange}
              placeholder="7"
              className="pl-10"
            />
          </div>
          <p className="mt-1 text-xs text-foreground-tertiary">
            Deadline: {new Date(Date.now() + parseInt(formData.daysUntilDeadline || '0') * 24 * 60 * 60 * 1000).toLocaleDateString()}
          </p>
        </div>

        {/* Fee Notice */}
        <div className="p-4 bg-purple-500/10 border border-purple-400/30 rounded-xl">
          <p className="text-sm text-foreground-secondary">
            <span className="font-semibold text-purple-400">Platform Fee:</span> 2.5% will be deducted from the reward when the bounty is fulfilled.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-400/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Create Button */}
        <button
          onClick={handleCreate}
          disabled={isCreating}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-violet-500 hover:shadow-glow-purple disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isCreating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating Bounty...
            </>
          ) : (
            `Create Bounty (${formData.reward || '0'} MONAD)`
          )}
        </button>

        <p className="text-xs text-center text-foreground-tertiary">
          The reward will be held in the smart contract until the bounty is fulfilled or cancelled
        </p>
      </div>
    </Modal>
  );
}
