'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface StatCardProps {
  value: string;
  label: string;
  icon: LucideIcon;
  accent?: 'pink' | 'magenta' | 'green' | 'orange' | 'teal';
  className?: string;
}

export function StatCard({ 
  value, 
  label, 
  icon: Icon, 
  accent = 'pink',
  className 
}: StatCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const accentColors = {
    pink: 'text-purple-400',
    magenta: 'text-violet-400',
    green: 'text-accent-green',
    orange: 'text-accent-orange',
    teal: 'text-accent-cyan'
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
      className={cn(
        'bg-glass-bg/50 border border-purple-500/30 rounded-2xl p-8 md:p-10 hover:border-purple-400/60 hover:-translate-y-1 transition-all duration-300 hover:shadow-glow-purple',
        className
      )}
    >
      <div className="flex items-start justify-between mb-6">
        <Icon className={cn('w-7 h-7', accentColors[accent])} />
      </div>
      <div className="text-4xl md:text-5xl font-display font-bold text-white mb-3 leading-tight">
        {value}
      </div>
      <div className="text-sm text-[var(--color-fg-tertiary)] tracking-wide">
        {label}
      </div>
    </motion.div>
  );
}
