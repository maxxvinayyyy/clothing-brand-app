'use client';

import Link from 'next/link';
import { Instagram, Twitter, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h2 className="text-xl font-extrabold tracking-[0.25em] uppercase mb-4">ELEVARE</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Elevate your everyday aesthetic. Timeless, minimalist clothing crafted for the modern individual.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest mb-4 text-gray-300">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/products', label: 'All Products' },
                { href: '/products?category=men', label: 'Men' },
                { href: '/products?category=women', label: 'Women' },
                { href: '/products?category=accessories', label: 'Accessories' },
                { href: '/orders', label: 'Track Order' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest mb-4 text-gray-300">Newsletter</h3>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe to get the latest drops, exclusive offers, and style inspiration.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 rounded-md bg-gray-800 border border-gray-700 px-3.5 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-500"
              />
              <button
                type="submit"
                className="rounded-md bg-white text-gray-900 px-4 py-2.5 text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} ELEVARE. All rights reserved.</p>
          <div className="flex gap-5 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
