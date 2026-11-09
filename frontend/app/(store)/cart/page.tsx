'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { CartItem } from '@/components/cart/CartItem';
import { Button } from '@/components/ui/Button';
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
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingBag size={56} className="text-gray-200 mx-auto mb-5" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Start adding some beautiful pieces to your cart.</p>
        <Link href="/products">
          <Button size="lg">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart ({itemCount()} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-xl p-6 sticky top-20">
            <h3 className="font-semibold text-gray-900 mb-5">Order Summary</h3>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({itemCount()} items)</span>
                <span className="text-gray-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : 'text-gray-900'}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-400">
                  Add {formatPrice(100 - subtotal)} more for free shipping
                </p>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4 mb-5">
              <div className="flex justify-between font-semibold text-gray-900">
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {isAuthenticated ? (
              <Link href="/checkout">
                <Button size="lg" className="w-full">
                  Checkout <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button size="lg" className="w-full">
                  Login to Checkout
                </Button>
              </Link>
            )}

            <Link href="/products" className="mt-4 block text-center text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
