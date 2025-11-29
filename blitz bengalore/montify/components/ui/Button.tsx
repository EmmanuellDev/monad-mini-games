'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { buttonTap } from '@/lib/motionVariants';

export interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  className,
  disabled,
  ariaLabel,
  type = 'button',
  onClick,
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center gap-3 font-semibold rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background-base';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:scale-105 hover:from-purple-500 hover:to-violet-500 shadow-glow-purple hover:shadow-glow-violet',
    secondary: 'bg-transparent border-2 border-purple-500/50 text-white hover:bg-purple-500/10 hover:border-purple-400/80 hover:shadow-sm-glow-purple',
    ghost: 'bg-transparent text-purple-400 hover:text-violet-400'
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-12 py-5 text-lg'
  };

  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  return (
    <motion.button
      className={classes}
      disabled={disabled}
      type={type}
      onClick={onClick}
      whileTap={disabled ? undefined : buttonTap}
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      {icon && iconPosition === 'left' && <span className="inline-flex">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="inline-flex">{icon}</span>}
    </motion.button>
  );
}
