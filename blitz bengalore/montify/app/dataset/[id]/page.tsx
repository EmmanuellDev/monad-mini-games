'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { mockDatasets } from '@/lib/mockData/datasets';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { PurchaseModal } from '@/components/features/dataset/PurchaseModal';
import { useToast } from '@/lib/context/ToastContext';

export default function DatasetDetailPage() {
  const params = useParams();
  const dataset = mockDatasets.find(d => d.id === params.id);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const { showToast } = useToast();

  if (!dataset) {
    return (
      <>
        <main className="min-h-screen bg-background-base pt-24 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground-primary mb-4">Dataset Not Found</h1>
            <Link href="/marketplace">
              <button className="px-6 py-3 bg-accent-pink text-white rounded-full font-semibold">
                Back to Marketplace
              </button>
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-background-base pt-24">
        <div className="container-center py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-foreground-tertiary mb-8">
              <Link href="/" className="hover:text-accent-pink transition-colors">Home</Link>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
              <Link href="/marketplace" className="hover:text-accent-pink transition-colors">Marketplace</Link>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
              <span className="text-foreground-primary">{dataset.name}</span>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2">
                {/* Title */}
                <h1 className="font-display text-5xl font-bold text-foreground-primary mb-6">
                  {dataset.name}
                </h1>

                {/* Description */}
                <p className="text-xl text-foreground-secondary mb-8">
                  {dataset.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {dataset.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-accent-pink/10 border border-accent-pink/30 rounded-full text-sm text-accent-pink">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Engagement Metrics */}
                <div className="flex flex-wrap gap-6 mb-12 pb-8 border-b border-border-subtle">
                  <div className="flex items-center gap-2 text-foreground-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    <span>{dataset.views.toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" x2="12" y1="15" y2="3"/>
                    </svg>
                    <span>{dataset.downloads.toLocaleString()} downloads</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                    </svg>
                    <span>{dataset.favorites.toLocaleString()} favorites</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground-tertiary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                      <line x1="16" x2="16" y1="2" y2="6"/>
                      <line x1="8" x2="8" y1="2" y2="6"/>
                      <line x1="3" x2="21" y1="10" y2="10"/>
                    </svg>
                    <span>Updated {new Date(dataset.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Coming Soon Notice */}
                <div className="bg-accent-pink/10 border border-accent-pink/30 rounded-2xl p-8 text-center">
                  <h3 className="text-2xl font-bold text-foreground-primary mb-2">Full Dataset Detail Page</h3>
                  <p className="text-foreground-secondary mb-6">
                    Quality Dashboard • Sample Preview • Training Results • License Terms • Related Datasets
                  </p>
                  <div className="inline-block px-6 py-3 bg-accent-pink/10 border border-accent-pink/30 rounded-full">
                    <span className="text-accent-pink font-semibold">🚀 Coming Soon</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Purchase Card */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 bg-background-elevated/60 backdrop-blur-2xl border border-accent-pink/20 rounded-2xl p-6 shadow-glow-pink">
                  {/* Price */}
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold text-accent-orange">${dataset.price}</div>
                    <div className="text-sm text-foreground-secondary">/dataset</div>
                  </div>

                  {/* Quality Badge */}
                  <div className="flex justify-center mb-6">
                    <div className="relative w-20 h-20">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="5" fill="none" className="text-border-DEFAULT" />
                        <circle cx="40" cy="40" r="35" stroke="url(#gradient)" strokeWidth="5" fill="none" strokeDasharray={`${(dataset.qualityScore / 100) * 220} 220`} />
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
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 mb-6">
                    <button
                      onClick={() => setIsPurchaseModalOpen(true)}
                      className="w-full px-6 py-4 bg-accent-pink text-white rounded-full font-semibold hover:bg-accent-magenta hover:shadow-glow-pink transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      Purchase Dataset
                    </button>
                    <button
                      onClick={() => showToast(`${dataset.name} added to cart`, 'success')}
                      className="w-full px-6 py-4 bg-transparent border-2 border-accent-pink/40 text-white rounded-full font-semibold hover:bg-accent-pink/10 hover:border-accent-pink transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="8" cy="21" r="1"/>
                        <circle cx="19" cy="21" r="1"/>
                        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                      </svg>
                      Add to Cart
                    </button>
                  </div>

                  {/* What's Included */}
                  <div className="mb-6 pb-6 border-b border-border-subtle">
                    <h4 className="text-sm font-semibold text-foreground-primary mb-3">What's Included</h4>
                    <div className="space-y-2 text-sm text-foreground-secondary">
                      {['Full dataset download', 'Quality certificate', 'Seal key for decryption', 'License document', '30-day support'].map(item => (
                        <div key={item} className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-green flex-shrink-0">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dataset Specs */}
                  <div className="space-y-2 text-sm mb-6">
                    {[
                      { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/></svg>', label: 'Format', value: dataset.format },
                      { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.1 2.18a9.93 9.93 0 0 1 3.8 0"/><path d="M17.6 3.71a9.95 9.95 0 0 1 2.69 2.7"/><path d="M21.82 10.1a9.93 9.93 0 0 1 0 3.8"/><path d="M20.29 17.6a9.95 9.95 0 0 1-2.7 2.69"/><path d="M13.9 21.82a9.94 9.94 0 0 1-3.8 0"/><path d="M6.4 20.29a9.95 9.95 0 0 1-2.69-2.7"/><path d="M2.18 13.9a9.93 9.93 0 0 1 0-3.8"/><path d="M3.71 6.4a9.95 9.95 0 0 1 2.7-2.69"/><circle cx="12" cy="12" r="1"/></svg>', label: 'Size', value: dataset.size },
                      { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>', label: 'Samples', value: dataset.samples },
                      { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 3v18"/></svg>', label: 'Features', value: dataset.features },
                      { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>', label: 'License', value: dataset.license },
                    ].map(spec => (
                      <div key={spec.label} className="flex items-center gap-2 text-foreground-secondary">
                        <span dangerouslySetInnerHTML={{ __html: spec.icon }} />
                        <span className="flex-1">{spec.label}:</span>
                        <span className="font-semibold text-foreground-primary">{spec.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Seller Info */}
                  <div className="bg-background-surface/40 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-pink to-accent-magenta flex items-center justify-center text-white font-bold">
                        {dataset.seller.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground-primary">{dataset.seller.name}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill={i < Math.floor(dataset.seller.reputation) ? '#FF6B35' : 'none'} stroke="#FF6B35" strokeWidth="2">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                          ))}
                          <span className="text-xs text-foreground-tertiary ml-1">{dataset.seller.reputation}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => showToast('Contact seller feature coming soon!', 'info')}
                      className="w-full px-4 py-2 bg-transparent border border-accent-orange/40 text-accent-orange rounded-lg text-sm font-semibold hover:bg-accent-orange/10 transition-all"
                    >
                      Contact Seller
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase Modal */}
            <PurchaseModal
              isOpen={isPurchaseModalOpen}
              onClose={() => setIsPurchaseModalOpen(false)}
              datasetName={dataset.name}
              price={dataset.price}
              datasetId={dataset.id}
            />
          </motion.div>
        </div>
      </main>
    </>
  );
}
