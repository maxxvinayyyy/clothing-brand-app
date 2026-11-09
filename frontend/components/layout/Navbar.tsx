'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, User, Search, Menu, X, Heart, ChevronDown, LogOut, Package, Settings } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useLogout } from '@/hooks/useAuth';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { user, isAuthenticated, isAdmin } = useAuthStore();
  const itemCount = useCartStore((s) => s.itemCount());
  const { logout } = useLogout();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'All Products' },
    { href: '/products?category=men', label: 'Men' },
    { href: '/products?category=women', label: 'Women' },
    { href: '/products?category=accessories', label: 'Accessories' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#090a0f]/80 backdrop-blur-2xl border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-black tracking-[0.25em] text-white uppercase group-hover:opacity-90 transition-opacity">
              ELEVARE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs uppercase tracking-widest text-neutral-300 hover:text-white transition-colors font-medium relative group py-1"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-indigo-500 to-cyan-400 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search */}
            <div className="hidden md:flex items-center">
              {searchOpen ? (
                <div className="flex items-center gap-2 bg-white/[0.07] border border-white/20 rounded-full px-4 py-1.5 backdrop-blur-md">
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                      }
                      if (e.key === 'Escape') setSearchOpen(false);
                    }}
                    placeholder="Search collection..."
                    className="text-xs bg-transparent text-white placeholder-neutral-400 outline-none w-44"
                  />
                  <X size={14} className="text-neutral-400 hover:text-white cursor-pointer" onClick={() => setSearchOpen(false)} />
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search"
                  className="p-2 text-neutral-300 hover:text-white transition-colors"
                >
                  <Search size={19} />
                </button>
              )}
            </div>

            {/* Cart Icon with Glowing Counter */}
            <Link href="/cart" className="relative p-2 text-neutral-300 hover:text-white transition-colors">
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-white text-[10px] font-bold flex items-center justify-center shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* User Auth Action or Profile Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-full border border-white/10 hover:border-white/30 transition-all text-neutral-200"
                >
                  <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center text-xs font-bold">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown size={13} className="mr-1" />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-3 w-52 bg-[#10121a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-20 py-2 divide-y divide-white/5">
                      <div className="px-4 py-2.5">
                        <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
                        <p className="text-[11px] text-neutral-400 truncate">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-neutral-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Settings size={14} className="text-indigo-400" /> Admin Atelier
                          </Link>
                        )}
                        <Link
                          href="/profile"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-neutral-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User size={14} className="text-neutral-400" /> My Profile
                        </Link>
                        <Link
                          href="/orders"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-neutral-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Package size={14} className="text-neutral-400" /> Orders & Tracking
                        </Link>
                        <Link
                          href="/wishlist"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-neutral-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Heart size={14} className="text-neutral-400" /> Saved Pieces
                        </Link>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => { setUserMenuOpen(false); logout(); }}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 w-full text-left transition-colors"
                        >
                          <LogOut size={14} /> Disconnect
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-xs uppercase tracking-wider font-medium text-neutral-300 hover:text-white transition-colors px-2 py-1"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="text-xs uppercase tracking-wider font-semibold bg-white text-black px-4 py-2 rounded-full hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95"
                >
                  Create Account
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle Menu"
              className="md:hidden p-2 text-neutral-300 hover:text-white transition-colors"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#090a0f]/95 backdrop-blur-2xl">
          <div className="px-5 py-4 space-y-3">
            {/* Mobile Search */}
            <div className="flex items-center gap-2.5 bg-white/[0.06] border border-white/10 rounded-full px-4 py-2.5 mb-4">
              <Search size={15} className="text-neutral-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                    setMobileOpen(false);
                  }
                }}
                placeholder="Search collection..."
                className="text-xs bg-transparent text-white placeholder-neutral-400 outline-none flex-1"
              />
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-xs uppercase tracking-widest text-neutral-300 hover:text-white font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {!isAuthenticated && (
              <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
                <Link
                  href="/login"
                  className="block w-full text-center py-2.5 text-xs uppercase tracking-wider font-medium text-neutral-200 border border-white/20 rounded-full hover:bg-white/10 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="block w-full text-center py-2.5 text-xs uppercase tracking-wider font-semibold bg-white text-black rounded-full hover:bg-neutral-200 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
