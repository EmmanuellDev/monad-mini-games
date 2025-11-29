'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useMonadWallet } from '@/lib/wallet/MonadWalletProvider';
import { ethers } from 'ethers';
import { getDatasetsByOwner, getDatasetDetails, getTotalDatasets, type DatasetOnChain } from '@/lib/contract/datasetContract';
import { getStoredPurchases } from '@/lib/storage/purchaseStorage';

interface TrendPoint { date: string; value: number; }
interface CategoryStat { category: string; count: number; revenue: number; }

export default function AnalyticsPage() {
  const { isConnected, address, chainId, connect } = useMonadWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [ownedDatasets, setOwnedDatasets] = useState<DatasetOnChain[]>([]);
  const [marketTotal, setMarketTotal] = useState(0);
  const [rangeDays, setRangeDays] = useState(30);

  useEffect(() => {
    if (isConnected && address && chainId === 10143) {
      loadData();
    }
  }, [isConnected, address, chainId, rangeDays]);

  const loadData = async () => {
    if (!address) return;
    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const total = await getTotalDatasets(provider);
      setMarketTotal(total);

      const ids = await getDatasetsByOwner(provider, address);
      const details = await Promise.all(ids.map(id => getDatasetDetails(provider, id)));
      setOwnedDatasets(details);
    } finally {
      setIsLoading(false);
    }
  };

  // Purchases from local storage (persistent)
  const purchases = useMemo(() => (address ? getStoredPurchases(address) : []), [address]);

  // Total revenue matches dashboard: sum of owned dataset prices
  const totalRevenue = useMemo(() => {
    return ownedDatasets.reduce((sum, dataset) => sum + parseFloat(dataset.price), 0).toFixed(4);
  }, [ownedDatasets]);

  // Revenue trend (based on owned datasets creation dates within range)
  const revenueTrend: TrendPoint[] = useMemo(() => {
    const cutoff = Date.now() - rangeDays * 24 * 60 * 60 * 1000;
    const days: Record<string, number> = {};
    ownedDatasets
      .filter(d => d.timestamp * 1000 >= cutoff)
      .forEach(d => {
        const date = new Date(d.timestamp * 1000);
        const key = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
        days[key] = (days[key] || 0) + parseFloat(d.price);
      });
    return Object.entries(days)
      .sort((a,b)=> a[0] < b[0] ? -1 : 1)
      .map(([date, value]) => ({ date, value }));
  }, [ownedDatasets, rangeDays]);

  // Revenue analytics: growth rate and period comparison
  const revenueAnalytics = useMemo(() => {
    const trendTotal = revenueTrend.reduce((s, p) => s + p.value, 0);
    
    // Calculate growth based on entire selected period vs previous period
    const now = Date.now();
    const periodMs = rangeDays * 24 * 60 * 60 * 1000;
    const currentPeriodStart = now - periodMs;
    const previousPeriodStart = now - (2 * periodMs);
    
    // Current period revenue (already in trendTotal)
    const currentRevenue = trendTotal;
    
    // Previous period revenue
    const previousRevenue = ownedDatasets
      .filter(d => {
        const ts = d.timestamp * 1000;
        return ts >= previousPeriodStart && ts < currentPeriodStart;
      })
      .reduce((s, d) => s + parseFloat(d.price), 0);
    
    const growthRate = previousRevenue > 0 
      ? (((currentRevenue - previousRevenue) / previousRevenue) * 100).toFixed(1) 
      : currentRevenue > 0 ? '100.0' : '0.0';
    
    const trend = currentRevenue > previousRevenue ? 'up' : currentRevenue < previousRevenue ? 'down' : 'stable';
    
    return {
      periodRevenue: trendTotal.toFixed(4),
      growthRate,
      trend,
      avgDailyRevenue: revenueTrend.length > 0 ? (trendTotal / revenueTrend.length).toFixed(4) : '0.0000',
      previousPeriodRevenue: previousRevenue.toFixed(4),
    };
  }, [revenueTrend, ownedDatasets, rangeDays]);

  // Category breakdown (owned datasets by category and revenue)
  const categoryStats: CategoryStat[] = useMemo(() => {
    const byCat: Record<string, CategoryStat> = {};
    ownedDatasets.forEach(d => {
      if (!byCat[d.category]) byCat[d.category] = { category: d.category, count: 0, revenue: 0 };
      byCat[d.category].count += 1;
      byCat[d.category].revenue += parseFloat(d.price);
    });
    return Object.values(byCat).sort((a,b)=> b.revenue - a.revenue);
  }, [ownedDatasets]);

  const avgPrice = useMemo(() => ownedDatasets.length ? (ownedDatasets.reduce((s,d)=> s + parseFloat(d.price),0)/ownedDatasets.length).toFixed(4) : '0.0000', [ownedDatasets]);

  return (
    <>
      <main className="min-h-screen bg-background-base pt-24">
        <div className="container-center py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground-primary mb-2">
                  Analytics
                </h1>
                <p className="text-foreground-secondary">Insights from your listings and purchases</p>
              </div>
              {!isConnected ? (
                <button onClick={connect} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-violet-500 hover:shadow-glow-purple transition-all">Connect Wallet</button>
              ) : (
                <div className="hidden md:flex items-center gap-3 bg-background-elevated border border-purple-500/30 rounded-xl px-6 py-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-foreground-secondary">{address?.slice(0,6)}...{address?.slice(-4)}</span>
                </div>
              )}
            </div>
            {isConnected && chainId !== 10143 && (
              <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm">
                Please switch to Monad Testnet (Chain ID: 10143).
              </div>
            )}
          </motion.div>

          {isConnected && chainId === 10143 && (
            <>
              {/* Filters */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-foreground-secondary">Range:</span>
                  <select
                    value={rangeDays}
                    onChange={(e)=> setRangeDays(parseInt(e.target.value))}
                    className="px-3 py-2 bg-background-elevated border border-border-DEFAULT rounded-xl text-foreground-primary"
                    suppressHydrationWarning
                  >
                    <option value={7}>7 days</option>
                    <option value={30}>30 days</option>
                    <option value={90}>90 days</option>
                  </select>
                </div>

                <div className="text-sm text-foreground-secondary">Marketplace total: <span className="text-foreground-primary font-semibold">{marketTotal}</span></div>
              </div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
              >
                <div className="bg-background-elevated/60 border border-purple-500/30 rounded-xl p-6">
                  <div className="text-sm text-foreground-secondary mb-2">Total Revenue</div>
                  <div className="text-3xl font-bold text-purple-400">{totalRevenue} MONAD</div>
                </div>
                <div className="bg-background-elevated/60 border border-purple-500/30 rounded-xl p-6">
                  <div className="text-sm text-foreground-secondary mb-2">Period Revenue</div>
                  <div className="text-3xl font-bold text-foreground-primary">{revenueAnalytics.periodRevenue} MONAD</div>
                  <div className="text-xs text-foreground-tertiary mt-1">Last {rangeDays} days</div>
                </div>
                <div className="bg-background-elevated/60 border border-purple-500/30 rounded-xl p-6">
                  <div className="text-sm text-foreground-secondary mb-2">Growth Rate</div>
                  <div className={`text-3xl font-bold ${revenueAnalytics.trend === 'up' ? 'text-green-400' : revenueAnalytics.trend === 'down' ? 'text-red-400' : 'text-foreground-primary'}`}>
                    {revenueAnalytics.trend === 'up' ? '↑' : revenueAnalytics.trend === 'down' ? '↓' : '→'} {revenueAnalytics.growthRate}%
                  </div>
                  <div className="text-xs text-foreground-tertiary mt-1">Period-over-period</div>
                </div>
                <div className="bg-background-elevated/60 border border-purple-500/30 rounded-xl p-6">
                  <div className="text-sm text-foreground-secondary mb-2">Avg Daily Revenue</div>
                  <div className="text-3xl font-bold text-foreground-primary">{revenueAnalytics.avgDailyRevenue} MONAD</div>
                  <div className="text-xs text-foreground-tertiary mt-1">Last {rangeDays} days</div>
                </div>
              </motion.div>

              {/* Revenue Trend (simple SVG line chart) */}
              <div className="bg-background-elevated/60 border border-purple-500/20 rounded-2xl p-6 mb-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground-primary">Revenue Trend</h3>
                    <p className="text-sm text-foreground-secondary mt-1">
                      Current: {revenueAnalytics.periodRevenue} MONAD • Previous: {revenueAnalytics.previousPeriodRevenue} MONAD
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-lg ${revenueAnalytics.trend === 'up' ? 'bg-green-500/10 text-green-400' : revenueAnalytics.trend === 'down' ? 'bg-red-500/10 text-red-400' : 'bg-gray-500/10 text-gray-400'}`}>
                    <span className="font-bold">
                      {revenueAnalytics.trend === 'up' ? '↑' : revenueAnalytics.trend === 'down' ? '↓' : '→'} {revenueAnalytics.growthRate}%
                    </span>
                  </div>
                </div>
                {revenueTrend.length === 0 ? (
                  <p className="text-foreground-secondary text-sm">No dataset listings in selected range.</p>
                ) : (
                  <div>
                    <svg viewBox="0 0 600 200" className="w-full h-40 mb-4">
                      {(() => {
                        const maxVal = Math.max(...revenueTrend.map(p=>p.value), 0.001);
                        const points = revenueTrend.map((p, i) => {
                          const x = (i/(Math.max(revenueTrend.length-1, 1))) * 580 + 10;
                          const y = 190 - (p.value/maxVal) * 180;
                          return `${x},${y}`;
                        }).join(' ');
                        return (
                          <>
                            {/* Grid lines */}
                            <line x1="10" y1="190" x2="590" y2="190" stroke="#444" strokeWidth="1" opacity="0.3" />
                            <line x1="10" y1="100" x2="590" y2="100" stroke="#444" strokeWidth="1" opacity="0.2" />
                            <line x1="10" y1="10" x2="590" y2="10" stroke="#444" strokeWidth="1" opacity="0.2" />
                            
                            {/* Area under curve */}
                            <polygon 
                              points={`10,190 ${points} 590,190`} 
                              fill="url(#areaGrad)" 
                              opacity="0.2"
                            />
                            
                            {/* Line */}
                            <polyline points={points} fill="none" stroke="url(#lineGrad)" strokeWidth="3" />
                            
                            {/* Data points */}
                            {revenueTrend.map((p, i) => {
                              const x = (i/(Math.max(revenueTrend.length-1, 1))) * 580 + 10;
                              const y = 190 - (p.value/maxVal) * 180;
                              return (
                                <g key={i}>
                                  <circle cx={x} cy={y} r="4" fill="#9D4EDD" stroke="#fff" strokeWidth="2" />
                                  <title>{p.date}: {p.value.toFixed(4)} MONAD</title>
                                </g>
                              );
                            })}
                            
                            <defs>
                              <linearGradient id="lineGrad" x1="0" x2="1">
                                <stop offset="0%" stopColor="#9D4EDD" />
                                <stop offset="100%" stopColor="#7B2CBF" />
                              </linearGradient>
                              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#9D4EDD" />
                                <stop offset="100%" stopColor="#7B2CBF" />
                              </linearGradient>
                            </defs>
                          </>
                        );
                      })()}
                    </svg>
                    
                    {/* Date labels */}
                    <div className="flex justify-between text-xs text-foreground-tertiary px-2">
                      {revenueTrend.length > 0 && (
                        <>
                          <span>{revenueTrend[0].date}</span>
                          {revenueTrend.length > 1 && <span>{revenueTrend[revenueTrend.length - 1].date}</span>}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Category Breakdown */}
              <div className="bg-background-elevated/60 border border-purple-500/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground-primary">Category Breakdown</h3>
                  <span className="text-sm text-foreground-secondary">Owned datasets</span>
                </div>
                {categoryStats.length === 0 ? (
                  <p className="text-foreground-secondary text-sm">No datasets owned yet.</p>
                ) : (
                  <div className="space-y-3">
                    {categoryStats.map((c)=> (
                      <div key={c.category} className="flex items-center gap-4">
                        <div className="w-32 text-sm text-foreground-secondary text-right capitalize">{c.category}</div>
                        <div className="flex-1 h-6 bg-background-surface rounded-lg overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (c.revenue / Math.max(0.0001, categoryStats[0]?.revenue)) * 100)}%` }}
                            transition={{ duration: 0.6 }}
                            className="h-full rounded-lg flex items-center justify-end pr-3"
                            style={{ background: 'linear-gradient(90deg, #5A189A80, #5A189A)' }}
                          >
                            <span className="text-white font-bold text-xs">{c.count} • {c.revenue.toFixed(2)} MONAD</span>
                          </motion.div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Model Benchmarks (requested) */}
              <div className="bg-background-elevated/60 border border-purple-500/20 rounded-2xl p-6 mt-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground-primary">Model Benchmarks</h3>
                  <span className="text-sm text-foreground-secondary">Sample training accuracies</span>
                </div>
                <div className="space-y-4">
                  {[
                    { model: 'ResNet-50', accuracy: 96, color: '#9D4EDD' },
                    { model: 'VGG-16', accuracy: 94, color: '#7B2CBF' },
                    { model: 'MobileNet', accuracy: 92, color: '#5A189A' },
                    { model: 'EfficientNet', accuracy: 95, color: '#3C096C' },
                    { model: 'DenseNet', accuracy: 93, color: '#240046' },
                  ].map((item) => (
                    <div key={item.model} className="flex items-center gap-4">
                      <div className="w-32 text-sm text-foreground-secondary text-right">{item.model}</div>
                      <div className="flex-1 h-8 bg-background-surface rounded-lg overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.accuracy}%` }}
                          transition={{ duration: 0.8 }}
                          className="h-full rounded-lg flex items-center justify-end pr-3"
                          style={{ 
                            background: `linear-gradient(90deg, ${item.color}80, ${item.color})`,
                          }}
                        >
                          <span className="text-white font-bold text-xs">{item.accuracy}%</span>
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* CTA */}
          <div className="flex gap-4 justify-center mt-12">
            <Link href="/marketplace">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-full font-semibold hover:from-purple-500 hover:to-violet-500 hover:shadow-glow-purple transition-all duration-200">
                Browse Datasets
              </button>
            </Link>
            <Link href="/upload">
              <button className="px-8 py-4 bg-transparent border-2 border-purple-500/50 text-white rounded-full font-semibold hover:bg-purple-500/10 hover:border-purple-400/80 transition-all duration-200">
                Upload Dataset
              </button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
