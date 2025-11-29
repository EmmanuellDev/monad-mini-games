'use client';

import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';
import { Bounty, submitToBounty } from '@/lib/contract/bountyContract';
import { ethers } from 'ethers';
import { Upload, Loader2, ExternalLink } from 'lucide-react';
import { pinFileToIPFS } from '@/lib/ipfs/pinataService';

interface SubmitBountyModalProps {
  open: boolean;
  onClose: () => void;
  bounty: Bounty;
  onSubmitSuccess?: () => void;
}

export function SubmitBountyModal({ open, onClose, bounty, onSubmitSuccess }: SubmitBountyModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ipfsHash, setIpfsHash] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleUploadToIPFS = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    try {
      setIsUploading(true);
      setError('');
      const hash = await pinFileToIPFS(file);
      setIpfsHash(hash);
    } catch (err) {
      console.error('IPFS upload error:', err);
      setError('Failed to upload to IPFS');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!ipfsHash) {
      setError('Please upload file to IPFS first');
      return;
    }

    if (!description.trim()) {
      setError('Please provide a description');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      if (!window.ethereum) {
        throw new Error('Please install MetaMask');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await submitToBounty(signer, bounty.id, ipfsHash, description);
      await tx.wait();

      onSubmitSuccess?.();
      
      // Reset form
      setFile(null);
      setDescription('');
      setIpfsHash('');
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.message || 'Failed to submit to bounty');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Submit to Bounty" size="lg">
      <div className="space-y-6">
        {/* Bounty Info */}
        <div className="p-4 bg-purple-500/10 border border-purple-400/30 rounded-xl">
          <h3 className="font-semibold text-foreground-primary mb-1">{bounty.title}</h3>
          <p className="text-sm text-foreground-secondary mb-2">{bounty.description}</p>
          <div className="text-purple-400 font-bold">
            Reward: {ethers.formatEther(bounty.reward)} MONAD
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-foreground-primary mb-2">
            Upload Your Solution
          </label>
          <div className="flex gap-2">
            <input
              type="file"
              onChange={handleFileChange}
              className="flex-1 px-4 py-2 bg-background-base border border-border-DEFAULT rounded-xl text-foreground-primary focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleUploadToIPFS}
              disabled={!file || isUploading}
              className="px-4 py-2 bg-purple-500/20 border border-purple-400/30 text-purple-400 rounded-xl font-semibold hover:bg-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload to IPFS
                </>
              )}
            </button>
          </div>
          {file && (
            <p className="mt-2 text-xs text-foreground-secondary">
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {/* IPFS Hash Display */}
        {ipfsHash && (
          <div className="p-4 bg-green-500/10 border border-green-400/30 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-400 mb-1">Uploaded to IPFS</p>
                <p className="text-sm font-mono text-foreground-primary">{ipfsHash}</p>
              </div>
              <a
                href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-green-400" />
              </a>
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground-primary mb-2">
            Submission Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain how your solution meets the bounty requirements..."
            className="w-full px-4 py-3 bg-background-base border border-border-DEFAULT rounded-xl text-foreground-primary placeholder-foreground-tertiary focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            rows={4}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-400/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!ipfsHash || !description.trim() || isSubmitting}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-violet-500 hover:shadow-glow-purple disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting to Blockchain...
            </>
          ) : (
            'Submit to Bounty'
          )}
        </button>

        <p className="text-xs text-center text-foreground-tertiary">
          Your submission will be stored on IPFS and recorded on the blockchain
        </p>
      </div>
    </Modal>
  );
}
