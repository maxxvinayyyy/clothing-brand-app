'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { CartItem } from '@/components/cart/CartItem';
import { Button } from '@/components/ui/Button';
import { LiquidBackground } from '@/components/ui/LiquidBackground';
import { formatPrice } from '@/lib/utils';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

export default function CartPage() {
  const { items, syncWithBackend, total, itemCount } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) syncWithBackend();
  }, [isAuthenticated]);

  const subtotal = total();
  const shipping = subtotal > 100 ? 0 : 9.99;
  const grandTotal = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="relative min-h-[75vh] flex items-center justify-center px-4 py-20 overflow-hidden">
        <LiquidBackground variant="hero" />
        <div className="max-w-md w-full glass-card p-10 rounded-3xl border border-white/10 text-center relative z-10 shadow-2xl backdrop-blur-2xl">
          <div className="w-16 h-16 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center mx-auto mb-6 text-cyan-300">
            <ShoppingBag size={28} />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Atelier Bag is Empty</h2>
          <p className="text-xs text-neutral-400 mb-8 font-light">Explore our curated architectural edits and select your wardrobe pieces.</p>
          <Link href="/products">
            <Button size="lg" className="w-full bg-white text-black font-bold uppercase tracking-wider text-xs py-3.5 rounded-full shadow-[0_0_25px_rgba(255,255,255,0.25)]">
              Explore Collection
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <LiquidBackground variant="ambient" />

      <div className="pb-6 mb-8 border-b border-white/[0.08]">
        <span className="text-xs uppercase tracking-[0.25em] text-cyan-400 font-bold block mb-1">
          ELEVARE ATELIER
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
          Your Shopping Bag ({itemCount()} pieces)
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-white/[0.08]">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/[0.08] sticky top-28 shadow-2xl">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-6">Order Summary</h3>

            <div className="space-y-3.5 mb-6 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400">Subtotal ({itemCount()} pieces)</span>
                <span className="font-semibold text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Express Delivery</span>
                <span className={shipping === 0 ? 'text-emerald-400 font-bold' : 'font-semibold text-white'}>
                  {shipping === 0 ? 'COMPLIMENTARY' : formatPrice(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-[11px] text-cyan-400 font-light">
                  Add {formatPrice(100 - subtotal)} more for complimentary shipping.
                </p>
              )}
            </div>

            <div className="border-t border-white/[0.08] pt-4 mb-6">
              <div className="flex justify-between font-black text-base text-white uppercase tracking-wide">
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {isAuthenticated ? (
              <Link href="/checkout">
                <Button size="lg" className="w-full bg-white text-black font-bold uppercase tracking-wider text-xs py-4 rounded-full shadow-[0_0_25px_rgba(255,255,255,0.25)] flex items-center justify-center gap-2">
                  Proceed to Checkout <ArrowRight size={16} />
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button size="lg" className="w-full bg-white text-black font-bold uppercase tracking-wider text-xs py-4 rounded-full shadow-[0_0_25px_rgba(255,255,255,0.25)]">
                  Sign In to Checkout
                </Button>
              </Link>
            )}

            <Link href="/products" className="mt-5 block text-center text-xs uppercase tracking-wider text-neutral-400 hover:text-white transition-colors">
              Continue Browsing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
