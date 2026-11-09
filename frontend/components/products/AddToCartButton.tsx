'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { useAddToCart } from '@/hooks/useCart';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Check } from 'lucide-react';

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { isAuthenticated } = useAuthStore();
  const { addToCart } = useAddToCart();
  const router = useRouter();

  const sizes = [...new Set(product.variants.map((v) => v.size))];
  const colors = [...new Set(product.variants.map((v) => v.color))];

  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState<string>(colors[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  const isOutOfStock = !selectedVariant || selectedVariant.stock === 0;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!selectedVariant) return;

    try {
      setIsLoading(true);
      await addToCart(product.id, selectedVariant.id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Size selector */}
      {sizes.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2.5">
            Size: <span className="font-semibold text-white ml-1">{selectedSize}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                  selectedSize === size
                    ? 'bg-white text-black border-white shadow-md scale-105'
                    : 'bg-white/[0.04] border-white/10 text-neutral-300 hover:border-white/30 hover:text-white'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color selector */}
      {colors.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2.5">
            Color: <span className="font-semibold text-white ml-1">{selectedColor}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                  selectedColor === color
                    ? 'bg-white text-black border-white shadow-md scale-105'
                    : 'bg-white/[0.04] border-white/10 text-neutral-300 hover:border-white/30 hover:text-white'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2.5">Quantity</p>
        <div className="flex items-center bg-white/[0.04] border border-white/10 rounded-xl w-fit">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3.5 py-2 text-neutral-400 hover:text-white transition-colors text-base"
          >
            −
          </button>
          <span className="px-4 py-2 text-xs font-bold text-white border-x border-white/10">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(selectedVariant?.stock ?? 10, q + 1))}
            className="px-3.5 py-2 text-neutral-400 hover:text-white transition-colors text-base"
          >
            +
          </button>
        </div>
        {selectedVariant && (
          <p className="text-[11px] text-cyan-400 mt-2">
            {selectedVariant.stock} units currently in stock
          </p>
        )}
      </div>

      {/* Add to cart */}
      <Button
        onClick={handleAddToCart}
        isLoading={isLoading}
        disabled={isOutOfStock}
        size="lg"
        className="w-full bg-white text-black hover:bg-neutral-100 font-bold uppercase tracking-wider text-xs py-4 rounded-full shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        {added ? (
          <span className="flex items-center justify-center gap-2 text-emerald-600">
            <Check size={18} /> Added to Atelier Bag!
          </span>
        ) : isOutOfStock ? (
          'Currently Unavailable'
        ) : (
          <span className="flex items-center justify-center gap-2">
            <ShoppingBag size={16} /> Add to Atelier Bag
          </span>
        )}
      </Button>
    </div>
  );
}
