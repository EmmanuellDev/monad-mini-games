'use client';

import { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Modal({ 
  open, 
  onClose, 
  title, 
  children, 
  size = 'md',
  className 
}: ModalProps) {
  // Trap focus and handle escape key
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl'
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'relative w-full bg-[var(--color-bg-overlay)] border border-white/10 rounded-3xl shadow-xl overflow-hidden my-8',
                sizeClasses[size],
                className
              )}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? 'modal-title' : undefined}
            >
              {/* Header */}
              {title && (
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <h2 id="modal-title" className="text-2xl font-display font-semibold text-white">
                    {title}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5 text-[var(--color-fg-secondary)]" />
                  </button>
                </div>
              )}

              {/* Content */}
              <div className="p-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
