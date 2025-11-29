'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { Dataset } from '@/lib/mockData/datasets';
import { useToast } from '@/lib/context/ToastContext';

interface DatasetCardProps {
  dataset: Dataset;
  index: number;
}

export function DatasetCard({ dataset, index }: DatasetCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const { showToast } = useToast();

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    showToast(
      isFavorited ? 'Removed from favorites' : 'Added to favorites',
      'success'
    );
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    showToast(`${dataset.name} added to cart`, 'success');
  };

  const renderThumbnail = () => {
    const colors = ['#E6007A', '#FF006B', '#FF0080', '#14B8A6', '#FF6B35'];
    const color1 = colors[index % colors.length];
    const color2 = colors[(index + 1) % colors.length];

    if (dataset.category === 'images') {
      return (
        <div className="grid grid-cols-2 gap-1 p-4">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className="aspect-square rounded-lg"
              style={{ background: colors[(index + i) % colors.length] + '40' }}
            />
          ))}
        </div>
      );
    }

    if (dataset.category === 'tabular') {
      return (
        <div className="p-4 space-y-2">
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className="flex gap-2">
              {[0, 1, 2].map(j => (
                <div
                  key={j}
                  className="flex-1 h-3 rounded"
                  style={{
                    background: `linear-gradient(90deg, ${color1}60, ${color2}60)`,
                    opacity: 1 - (i * 0.15)
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="w-20 h-20 rounded-full" style={{
          background: `linear-gradient(135deg, ${color1}80, ${color2}80)`
        }} />
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/dataset/${dataset.id}`}>
        <GlassCard
          hover={true}
          className="group h-full flex flex-col overflow-hidden hover:shadow-md transition-all duration-300"
        >
          {/* Certification Badges */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            {dataset.verified && (
              <div className="bg-accent-green/20 border border-accent-green/40 rounded-full px-2 py-1 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-green">
                  <path d="M12 3l-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                </svg>
                <span className="text-xs font-semibold text-accent-green">AI</span>
              </div>
            )}
            {dataset.blockchainCertified && (
              <div className="bg-accent-pink/20 border border-accent-pink/40 rounded-full px-2 py-1 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-pink">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span className="text-xs font-semibold text-accent-pink">BC</span>
              </div>
            )}
          </div>

          {/* Thumbnail */}
          <div className="relative w-full h-48 bg-gradient-to-br from-background-elevated to-background-surface rounded-t-xl overflow-hidden">
            {renderThumbnail()}
            <div className="absolute inset-0 bg-background-base/0 group-hover:bg-background-base/80 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2 text-accent-pink">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <span className="text-sm font-semibold text-foreground-primary">Quick View</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col p-5">
            {/* Title */}
            <h3 className="font-display text-xl font-semibold text-foreground-primary mb-3 line-clamp-2 group-hover:text-accent-pink transition-colors">
              {dataset.name}
            </h3>

            {/* Seller Info */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-pink to-accent-magenta flex items-center justify-center text-white text-xs font-bold">
                {dataset.seller.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground-secondary truncate">{dataset.seller.name}</p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill={i < Math.floor(dataset.seller.reputation) ? '#FF6B35' : 'none'} stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                  <span className="text-xs text-foreground-tertiary ml-1">{dataset.seller.reputation.toFixed(1)}</span>
                </div>
              </div>
            </div>

            {/* Category Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent-pink/10 border border-accent-pink/30 rounded-full text-xs text-accent-pink">
                <span dangerouslySetInnerHTML={{ __html: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${dataset.category === 'images' ? '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>' : '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 3v18"/>'}</svg>` }} />
                {dataset.category.charAt(0).toUpperCase() + dataset.category.slice(1)}
              </span>
              <span className="inline-flex items-center px-2 py-1 bg-background-surface/60 border border-border-DEFAULT rounded-full text-xs text-foreground-tertiary">
                {dataset.format}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-foreground-tertiary line-clamp-2 mb-4 flex-1">
              {dataset.description}
            </p>

            {/* Quality Score & Metrics */}
            <div className="border-t border-border-subtle pt-4">
              <div className="flex items-center justify-between mb-3">
                {/* Quality Score Circle */}
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      className="text-border-DEFAULT"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="url(#gradient)"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${(dataset.qualityScore / 100) * 175.93} 175.93`}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#E6007A" />
                        <stop offset="100%" stopColor="#FF0080" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-foreground-primary">{dataset.qualityScore}</span>
                    <span className="text-xs text-foreground-secondary">/100</span>
                  </div>
                </div>

                {/* Mini Metrics */}
                <div className="flex-1 ml-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-pink">
                      <line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/>
                    </svg>
                    <span className="text-foreground-secondary">Diversity:</span>
                    <span className="font-semibold text-foreground-primary">{dataset.metrics.diversity}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-pink">
                      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
                    </svg>
                    <span className="text-foreground-secondary">Accuracy:</span>
                    <span className="font-semibold text-foreground-primary">{dataset.metrics.accuracy}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-green">
                      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                    </svg>
                    <span className="text-foreground-secondary">Bias:</span>
                    <span className={`font-semibold ${dataset.metrics.bias === 'low' ? 'text-accent-green' : dataset.metrics.bias === 'medium' ? 'text-accent-orange' : 'text-accent-red'}`}>
                      {dataset.metrics.bias.charAt(0).toUpperCase() + dataset.metrics.bias.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <span className="text-3xl font-bold text-accent-orange">${dataset.price}</span>
                    <span className="text-sm text-foreground-tertiary ml-1">/dataset</span>
                  </div>
                  
                  {/* Favorite Button */}
                  <button
                    onClick={handleFavorite}
                    className="p-2 rounded-full hover:bg-accent-pink/10 transition-all duration-200"
                    aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill={isFavorited ? '#E6007A' : 'none'}
                      stroke="#E6007A"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                    </svg>
                  </button>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    className="px-4 py-2 bg-accent-pink/10 border border-accent-pink/40 text-accent-pink rounded-full text-sm font-semibold hover:bg-accent-pink hover:text-white transition-all duration-200 flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="8" cy="21" r="1"/>
                      <circle cx="19" cy="21" r="1"/>
                      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                    </svg>
                    Add
                  </button>
                </div>
                <Link href={`/dataset/${dataset.id}`}>
                  <button className="px-4 py-2 bg-gradient-to-r from-accent-pink to-accent-magenta text-white rounded-full text-sm font-semibold hover:shadow-glow-pink transition-all duration-200">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
}
