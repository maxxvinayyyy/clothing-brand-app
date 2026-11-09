'use client';

import Image from 'next/image';
import { CartItem as CartItemType } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useRemoveFromCart, useUpdateQuantity } from '@/hooks/useCart';
import { useAuthStore } from '@/store/authStore';
import { Trash2 } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { removeFromCart } = useRemoveFromCart();
  const { updateQuantity } = useUpdateQuantity();
  const { isAuthenticated } = useAuthStore();

  const imageUrl = item.product.images?.[0]?.url || `https://picsum.photos/seed/${item.product.slug}/400/500`;
  const lineTotal = parseFloat(item.product.price.toString()) * item.quantity;

  return (
    <div className="flex gap-4 py-5 border-b border-gray-100">
      <div className="relative w-24 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
        <Image src={imageUrl} alt={item.product.name} fill className="object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2">
          <div>
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{item.product.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {item.variant.size} / {item.variant.color}
            </p>
          </div>
          <p className="text-sm font-semibold text-gray-900 flex-shrink-0">{formatPrice(lineTotal)}</p>
        </div>

        <div className="flex items-center justify-between mt-3">
          {/* Quantity spinner */}
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={() => {
                if (item.quantity > 1) {
                  updateQuantity(item.id, item.quantity - 1);
                }
              }}
              className="px-2.5 py-1.5 text-gray-500 hover:text-gray-900 transition-colors text-sm"
            >
              −
            </button>
            <span className="px-3 py-1.5 text-sm font-medium text-gray-900 border-x border-gray-300">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="px-2.5 py-1.5 text-gray-500 hover:text-gray-900 transition-colors text-sm"
            >
              +
            </button>
          </div>

          {/* Remove button */}
          <button
            onClick={() => removeFromCart(item.id)}
            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
