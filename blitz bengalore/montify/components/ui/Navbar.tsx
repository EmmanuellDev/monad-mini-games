'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from './Button';
import { Logo } from './Logo';
import { cn } from '@/lib/cn';
import { ConnectWalletButton } from './ConnectWalletButton';

const navLinks = [
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/upload', label: 'Upload' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/bounties', label: 'Bounties' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/profile', label: 'Profile' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled ? 'bg-[rgba(28,28,30,0.72)] backdrop-blur-2xl border-b border-white/10 shadow-md' : 'bg-transparent'
        )}
      >
        <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/" className="group">
            <Logo size="md" showText={true} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[15px] font-body text-[var(--color-fg-secondary)] hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Connect Wallet Button */}
          <div className="hidden md:block">
            <ConnectWalletButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 z-40 w-full max-w-sm bg-[var(--color-bg-elevated)] backdrop-blur-xl border-l border-white/10 md:hidden"
          >
            <div className="flex flex-col h-full pt-24 px-6">
              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-2xl font-display font-semibold text-white hover:text-accent-pink transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto pb-8">
                <ConnectWalletButton />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
