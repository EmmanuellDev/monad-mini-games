'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { hoverLift } from '@/lib/motionVariants';

export interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({ 
  children, 
  className, 
  hover = true,
  onClick,
}: GlassCardProps) {
  const baseClasses = 'bg-glass-bg/60 backdrop-blur-2xl border border-purple-500/25 rounded-2xl p-10 transition-all duration-300';
  const hoverClasses = hover ? 'hover:border-purple-400/50 hover:-translate-y-1 hover:shadow-glow-purple' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  const classes = cn(baseClasses, hoverClasses, clickableClasses, className);

  const Component = onClick ? motion.div : 'div';

  if (onClick) {
    return (
      <motion.div
        className={classes}
        onClick={onClick}
        whileHover={hoverLift}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={classes}>
      {children}
    </div>
  );
}
