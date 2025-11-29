"use client";

import Link from "next/link";
import { Twitter, Github, MessageCircle, Linkedin, Mail } from "lucide-react";
import { Logo } from "./Logo";

const footerLinks = {
  product: [
    { label: "Marketplace", href: "/marketplace" },
    { label: "Upload Dataset", href: "/upload" },
    { label: "Bounties", href: "/bounties" },
    { label: "Pricing", href: "/pricing" },
    { label: "API", href: "/api" },
  ],
  resources: [
    { label: "Documentation", href: "/docs" },
    { label: "Tutorials", href: "/tutorials" },
    { label: "Blog", href: "/blog" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Community", href: "/community" },
    { label: "Support", href: "/support" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: MessageCircle, href: "#", label: "Discord" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Mail, href: "#", label: "Email" },
];

export function Footer() {
  return (
    <footer className="bg-[var(--color-bg-elevated)] border-t border-white/6">
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="mb-5">
              <Logo size="md" showText={true} />
            </div>
            <p className="text-sm text-[var(--color-fg-tertiary)] mb-6 leading-relaxed">
              Certify Your Data on Sui
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 text-[var(--color-fg-tertiary)] hover:text-white hover:bg-white/10 transition-all hover:scale-105"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
              Product
            </h3>
            <ul className="space-y-3.5">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-fg-secondary)] hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
              Resources
            </h3>
            <ul className="space-y-3.5">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-fg-secondary)] hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
              Company
            </h3>
            <ul className="space-y-3.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-fg-secondary)] hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 lg:mt-16 pt-8 border-t border-white/6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <p className="text-sm text-[var(--color-fg-tertiary)] order-2 md:order-1">
              © 2025 Montify. All rights reserved.
            </p>

            {/* Links */}
            <div className="flex items-center gap-6 text-sm order-1 md:order-2">
              <Link
                href="/privacy"
                className="text-[var(--color-fg-secondary)] hover:text-white transition-colors duration-200"
              >
                Privacy
              </Link>
              <span className="text-[var(--color-fg-tertiary)]">•</span>
              <Link
                href="/terms"
                className="text-[var(--color-fg-secondary)] hover:text-white transition-colors duration-200"
              >
                Terms
              </Link>
              <span className="text-[var(--color-fg-tertiary)]">•</span>
              <Link
                href="/cookies"
                className="text-[var(--color-fg-secondary)] hover:text-white transition-colors duration-200"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
