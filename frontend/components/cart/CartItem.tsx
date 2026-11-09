'use client';

import Image from 'next/image';
import { CartItem as CartItemType } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useRemoveFromCart, useUpdateQuantity } from '@/hooks/useCart';
import { Trash2 } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { removeFromCart } = useRemoveFromCart();
  const { updateQuantity } = useUpdateQuantity();

  const imageUrl = item.product.images?.[0]?.url || `https://picsum.photos/seed/${item.product.slug}/400/500`;
  const lineTotal = parseFloat(item.product.price.toString()) * item.quantity;

  return (
    <div className="flex gap-4 py-5 border-b border-white/[0.08]">
      <div className="relative w-24 h-32 flex-shrink-0 rounded-2xl overflow-hidden bg-neutral-900 border border-white/10">
        <Image src={imageUrl} alt={item.product.name} fill className="object-cover" />
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
        <div className="flex justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white line-clamp-1">{item.product.name}</h3>
            <p className="text-xs text-neutral-400 mt-1">
              Variant: <span className="text-neutral-200">{item.variant.size} • {item.variant.color}</span>
            </p>
          </div>
          <p className="text-sm font-bold text-white flex-shrink-0">{formatPrice(lineTotal)}</p>
        </div>

        <div className="flex items-center justify-between mt-3">
          {/* Quantity selector */}
          <div className="flex items-center bg-white/[0.05] border border-white/15 rounded-xl">
            <button
              onClick={() => {
                if (item.quantity > 1) {
                  updateQuantity(item.id, item.quantity - 1);
                }
              }}
              className="px-3 py-1.5 text-neutral-400 hover:text-white transition-colors text-xs"
            >
              −
            </button>
            <span className="px-3 py-1.5 text-xs font-bold text-white border-x border-white/10">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="px-3 py-1.5 text-neutral-400 hover:text-white transition-colors text-xs"
            >
              +
            </button>
          </div>

          {/* Remove button */}
          <button
            onClick={() => removeFromCart(item.id)}
            aria-label="Remove item"
            className="p-2 text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-full transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
