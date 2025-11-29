'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DatasetCard } from './DatasetCard';
import { getTotalDatasets, getDatasetDetails, type DatasetOnChain } from '@/lib/contract/datasetContract';
import { ethers } from 'ethers';
import { Database } from 'lucide-react';
import { useToast } from '@/lib/context/ToastContext';

interface DatasetGridProps {
  filters: {
    search: string;
    qualityRange: [number, number];
    priceRange: [number, number];
    categories: string[];
    dataSize: string;
    verification: string[];
  };
  sortBy: string;
  setSortBy: (sort: string) => void;
  isConnected: boolean;
  userAddress: string | null;
  chainId: number | null;
}

export function DatasetGrid({ filters, sortBy, setSortBy, isConnected, userAddress, chainId }: DatasetGridProps) {
  const { showToast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const datasetsPerPage = 9;
  const [allDatasets, setAllDatasets] = useState<DatasetOnChain[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load all datasets from blockchain
  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const totalCount = await getTotalDatasets(provider);
      
      if (totalCount === 0) {
        setAllDatasets([]);
        setIsLoading(false);
        return;
      }

      // Fetch all datasets
      const datasets: DatasetOnChain[] = [];
      for (let i = 0; i < totalCount; i++) {
        try {
          const dataset = await getDatasetDetails(provider, i);
          if (dataset.active) {
            datasets.push(dataset);
          }
        } catch (error) {
          console.error(`Error loading dataset ${i}:`, error);
        }
      }
      
      setAllDatasets(datasets);
    } catch (error) {
      console.error('Error loading datasets:', error);
      showToast('Failed to load datasets from blockchain', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDatasets = useMemo(() => {
    let filtered = [...allDatasets];

    // Search filter (search in dataHash, metadataHash, category)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(d =>
        d.dataHash.toLowerCase().includes(searchLower) ||
        d.metadataHash.toLowerCase().includes(searchLower) ||
        d.category.toLowerCase().includes(searchLower) ||
        d.id.toString().includes(searchLower)
      );
    }

    // Price range filter (convert MONAD to number for comparison)
    const minPrice = filters.priceRange[0] / 1000; // Convert from range to MONAD
    const maxPrice = filters.priceRange[1] / 1000;
    filtered = filtered.filter(d => {
      const price = parseFloat(d.price);
      return price >= minPrice && price <= maxPrice;
    });

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(d =>
        filters.categories.includes(d.category)
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price-high':
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'recent':
        filtered.sort((a, b) => b.timestamp - a.timestamp);
        break;
      case 'oldest':
        filtered.sort((a, b) => a.timestamp - b.timestamp);
        break;
      default:
        // newest first by default
        filtered.sort((a, b) => b.timestamp - a.timestamp);
        break;
    }

    return filtered;
  }, [allDatasets, filters, sortBy]);

  const totalPages = Math.ceil(filteredDatasets.length / datasetsPerPage);
  const startIndex = (currentPage - 1) * datasetsPerPage;
  const paginatedDatasets = filteredDatasets.slice(startIndex, startIndex + datasetsPerPage);

  return (
    <div>
      {/* Sort Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between mb-8 pb-4 border-b border-border-subtle"
      >
        <div>
          <p className="text-foreground-secondary">
            Showing <span className="font-semibold text-foreground-primary">{filteredDatasets.length}</span> datasets
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-foreground-secondary">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-background-elevated border border-purple-500/30 rounded-lg px-4 py-2 text-sm text-foreground-primary focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all cursor-pointer"
            suppressHydrationWarning
          >
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low">Price (Low to High)</option>
            <option value="price-high">Price (High to Low)</option>
          </select>
        </div>
      </motion.div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="animate-spin w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full mb-6" />
          <h3 className="text-xl font-semibold text-foreground-primary mb-2">
            Loading datasets from blockchain...
          </h3>
          <p className="text-foreground-secondary">
            Please wait while we fetch the latest data
          </p>
        </div>
      ) : paginatedDatasets.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginatedDatasets.map((dataset, index) => (
              <DatasetCard 
                key={dataset.id} 
                dataset={dataset} 
                index={index}
                isConnected={isConnected}
                userAddress={userAddress}
                chainId={chainId}
                onPurchaseComplete={loadDatasets}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex items-center justify-center gap-2 mt-16"
            >
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-background-elevated border border-border-DEFAULT rounded-lg text-foreground-primary disabled:opacity-50 disabled:cursor-not-allowed hover:border-accent-pink transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>

              {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                let pageNum: number;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (currentPage <= 4) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = currentPage - 3 + i;
                }

                if (i === 0 && pageNum > 1) {
                  return (
                    <div key="start-ellipsis" className="px-2 text-foreground-tertiary">...</div>
                  );
                }
                if (i === 6 && pageNum < totalPages) {
                  return (
                    <div key="end-ellipsis" className="px-2 text-foreground-tertiary">...</div>
                  );
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all ${
                      currentPage === pageNum
                        ? 'bg-accent-pink text-white shadow-glow-pink'
                        : 'bg-background-elevated border border-border-DEFAULT text-foreground-secondary hover:border-accent-pink hover:text-accent-pink'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-background-elevated border border-border-DEFAULT rounded-lg text-foreground-primary disabled:opacity-50 disabled:cursor-not-allowed hover:border-accent-pink transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </motion.div>
          )}
        </>
      ) : (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center py-24 bg-background-elevated/60 backdrop-blur-2xl border border-purple-500/20 rounded-2xl"
        >
          <Database className="w-24 h-24 text-purple-400 mb-6 opacity-50" />
          <h3 className="font-display text-3xl font-semibold text-foreground-primary mb-2">
            {allDatasets.length === 0 ? 'No datasets on blockchain yet' : 'No datasets found'}
          </h3>
          <p className="text-lg text-foreground-secondary mb-8 max-w-md text-center">
            {allDatasets.length === 0 
              ? 'Be the first to upload a dataset to the marketplace!' 
              : 'Try adjusting your filters or search terms to find what you\'re looking for'}
          </p>
          {allDatasets.length === 0 ? (
            <a href="/upload">
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-full font-semibold hover:from-purple-500 hover:to-violet-500 hover:shadow-glow-purple transition-all duration-200">
                Upload First Dataset
              </button>
            </a>
          ) : (
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-500 hover:shadow-glow-purple transition-all duration-200"
            >
              Reload Marketplace
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
