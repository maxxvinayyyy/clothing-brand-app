'use client';

import Link from 'next/link';
import { Instagram, Twitter, Facebook, ArrowUpRight } from 'lucide-react';
import { ElevareLogo } from '@/components/ui/ElevareLogo';

export function Footer() {
  return (
    <footer className="bg-[#090a0f] text-slate-200 border-t border-white/[0.08] relative overflow-hidden mt-auto">
      {/* Subtle ambient glow behind footer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-40 bg-gradient-to-b from-indigo-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Manifesto */}
          <div className="md:col-span-2">
            <ElevareLogo size="lg" className="mb-4" />
            <p className="text-neutral-400 text-sm leading-relaxed mb-6 max-w-sm">
              Elevate your everyday aesthetic. Sculpted architectural silhouettes crafted for the modern individual with purest organic textures and timeless restraint.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Twitter, href: '#', label: 'X (Twitter)' },
                { icon: Facebook, href: '#', label: 'Facebook' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="p-2.5 rounded-full bg-white/[0.05] border border-white/10 text-neutral-400 hover:text-white hover:bg-white/[0.1] hover:border-white/20 transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Curated Edits */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] mb-4 text-white">
              Collections
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/products', label: 'All Catalog' },
                { href: '/products?category=men', label: 'Men’s Atelier' },
                { href: '/products?category=women', label: 'Women’s Edition' },
                { href: '/products?category=accessories', label: 'Luxury Accessories' },
                { href: '/products?featured=true', label: 'Seasonal Highlights' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-neutral-400 hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Atelier Services */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] mb-4 text-white">
              Client Care
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/orders', label: 'Track Consignment' },
                { href: '/wishlist', label: 'Saved Wishlist' },
                { href: '/profile', label: 'Atelier Account' },
                { href: '/cart', label: 'Shopping Bag' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom copyright & legal */}
        <div className="mt-16 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>&copy; {new Date().getFullYear()} ELEVARE Atelier Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-neutral-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-neutral-400 cursor-pointer transition-colors">Terms of Atelier</span>
            <span className="hover:text-neutral-400 cursor-pointer transition-colors">Sustainably Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
