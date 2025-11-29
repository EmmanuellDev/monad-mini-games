'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';

interface FilterSidebarProps {
  filters: {
    search: string;
    qualityRange: [number, number];
    priceRange: [number, number];
    categories: string[];
    dataSize: string;
    verification: string[];
  };
  setFilters: React.Dispatch<React.SetStateAction<FilterSidebarProps['filters']>>;
}

const categories = [
  { id: 'images', label: 'Images', count: 247, icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>' },
  { id: 'text', label: 'Text', count: 189, icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>' },
  { id: 'audio', label: 'Audio', count: 156, icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>' },
  { id: 'video', label: 'Video', count: 98, icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>' },
  { id: 'tabular', label: 'Tabular', count: 312, icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>' },
  { id: 'timeseries', label: 'Time Series', count: 203, icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>' },
];

const dataSizes = [
  { id: 'small', label: 'Small (<100MB)' },
  { id: 'medium', label: 'Medium (100MB - 1GB)' },
  { id: 'large', label: 'Large (1GB - 10GB)' },
  { id: 'xlarge', label: 'Extra Large (>10GB)' },
];

const verificationTypes = [
  { id: 'ai', label: 'AI Verified', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>' },
  { id: 'blockchain', label: 'Blockchain Certified', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>' },
  { id: 'training', label: 'Training Verified', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' },
];

export function FilterSidebar({ filters, setFilters }: FilterSidebarProps) {
  const [searchInput, setSearchInput] = useState(filters.search);

  const toggleCategory = (categoryId: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const toggleVerification = (verificationType: string) => {
    setFilters(prev => ({
      ...prev,
      verification: prev.verification.includes(verificationType)
        ? prev.verification.filter(id => id !== verificationType)
        : [...prev.verification, verificationType]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      qualityRange: [0, 100],
      priceRange: [0, 10000],
      categories: [],
      dataSize: '',
      verification: [],
    });
    setSearchInput('');
  };

  const activeFiltersCount =
    filters.categories.length +
    filters.verification.length +
    (filters.dataSize ? 1 : 0) +
    (filters.search ? 1 : 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-24 bg-background-elevated/40 backdrop-blur-xl border border-border-subtle rounded-2xl p-5 max-h-[calc(100vh-8rem)] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-white/20"
      style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}
    >
      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-foreground-primary mb-2">
          Search
        </label>
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-tertiary">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <Input
            type="text"
            placeholder="Search datasets..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              const timeout = setTimeout(() => {
                setFilters(prev => ({ ...prev, search: e.target.value }));
              }, 300);
              return () => clearTimeout(timeout);
            }}
            className="pl-10 bg-background-surface/60 border-border-DEFAULT focus:border-foreground-tertiary focus:ring-0"
          />
        </div>
      </div>

      {/* Quality Score Range */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-foreground-primary mb-2">
          Quality Score
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="100"
            value={filters.qualityRange[1]}
            onChange={(e) => setFilters(prev => ({ ...prev, qualityRange: [0, parseInt(e.target.value)] }))}
            className="w-full h-2 bg-background-surface rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-accent-pink [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-accent-pink [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
          />
          <div className="flex justify-between text-xs text-foreground-secondary">
            <span>{filters.qualityRange[0]}</span>
            <span>{filters.qualityRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-foreground-primary mb-2">
          Price Range
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={filters.priceRange[1]}
            onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [0, parseInt(e.target.value)] }))}
            className="w-full h-2 bg-background-surface rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-accent-orange [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-accent-orange [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
          />
          <div className="flex justify-between text-xs text-foreground-secondary">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}{filters.priceRange[1] >= 10000 ? '+' : ''}</span>
          </div>
        </div>
      </div>

      {/* Category Checkboxes */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-foreground-primary mb-2">
          Category
        </label>
        <div className="space-y-1.5 max-h-60 overflow-y-auto">
          {categories.map(category => (
            <label
              key={category.id}
              className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-background-surface/40 cursor-pointer transition-colors"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category.id)}
                  onChange={() => toggleCategory(category.id)}
                  className="w-4 h-4 rounded border-2 border-border-DEFAULT appearance-none checked:bg-accent-pink checked:border-accent-pink cursor-pointer transition-all"
                />
                {filters.categories.includes(category.id) && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </div>
              <span dangerouslySetInnerHTML={{ __html: category.icon }} className="text-foreground-secondary flex-shrink-0" />
              <span className="text-sm text-foreground-primary flex-1">{category.label}</span>
              <span className="text-xs text-foreground-tertiary bg-background-surface px-2 py-0.5 rounded-full">
                {category.count}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Data Size Radio */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-foreground-primary mb-2">
          Data Size
        </label>
        <div className="space-y-1.5">
          {dataSizes.map(size => (
            <label
              key={size.id}
              className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-background-surface/40 cursor-pointer transition-colors"
            >
              <div className="relative">
                <input
                  type="radio"
                  name="dataSize"
                  checked={filters.dataSize === size.id}
                  onChange={() => setFilters(prev => ({ ...prev, dataSize: size.id }))}
                  className="w-4 h-4 rounded-full border-2 border-border-DEFAULT appearance-none checked:border-accent-pink cursor-pointer transition-all"
                />
                {filters.dataSize === size.id && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-accent-pink rounded-full pointer-events-none" />
                )}
              </div>
              <span className="text-sm text-foreground-primary">{size.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Verification Status */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-foreground-primary mb-2">
          Verification
        </label>
        <div className="space-y-1.5">
          {verificationTypes.map(type => (
            <label
              key={type.id}
              className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-background-surface/40 cursor-pointer transition-colors"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={filters.verification.includes(type.id)}
                  onChange={() => toggleVerification(type.id)}
                  className="w-4 h-4 rounded border-2 border-border-DEFAULT appearance-none checked:bg-accent-pink checked:border-accent-pink cursor-pointer transition-all"
                />
                {filters.verification.includes(type.id) && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </div>
              <span dangerouslySetInnerHTML={{ __html: type.icon }} className="text-foreground-secondary flex-shrink-0" />
              <span className="text-sm text-foreground-primary">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <div className="pt-4 border-t border-border-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-foreground-primary">
              Active Filters ({activeFiltersCount})
            </span>
            <button
              onClick={clearAllFilters}
              className="text-xs text-accent-pink hover:text-accent-magenta underline transition-colors"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent-pink/10 border border-accent-pink/30 rounded-full text-xs text-accent-pink">
                Search: {filters.search}
                <button onClick={() => { setSearchInput(''); setFilters(prev => ({ ...prev, search: '' })); }} className="hover:text-accent-magenta">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                  </svg>
                </button>
              </span>
            )}
            {filters.categories.map(catId => (
              <span key={catId} className="inline-flex items-center gap-1 px-3 py-1 bg-accent-pink/10 border border-accent-pink/30 rounded-full text-xs text-accent-pink">
                {categories.find(c => c.id === catId)?.label}
                <button onClick={() => toggleCategory(catId)} className="hover:text-accent-magenta">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                  </svg>
                </button>
              </span>
            ))}
            {filters.dataSize && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent-pink/10 border border-accent-pink/30 rounded-full text-xs text-accent-pink">
                Size: {dataSizes.find(s => s.id === filters.dataSize)?.label}
                <button onClick={() => setFilters(prev => ({ ...prev, dataSize: '' }))} className="hover:text-accent-magenta">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                  </svg>
                </button>
              </span>
            )}
            {filters.verification.map(verif => (
              <span key={verif} className="inline-flex items-center gap-1 px-3 py-1 bg-accent-pink/10 border border-accent-pink/30 rounded-full text-xs text-accent-pink">
                {verificationTypes.find(v => v.id === verif)?.label}
                <button onClick={() => toggleVerification(verif)} className="hover:text-accent-magenta">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
