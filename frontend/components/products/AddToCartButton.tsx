'use client';

import { useState } from 'react';
import { Product, ProductVariant } from '@/lib/types';
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
    <div className="space-y-4">
      {/* Size selector */}
      {sizes.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-900 mb-2">
            Size: <span className="font-normal text-gray-600">{selectedSize}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-3.5 py-2 text-sm border rounded-md transition-colors ${
                  selectedSize === size
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'border-gray-300 text-gray-700 hover:border-gray-500'
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
          <p className="text-sm font-medium text-gray-900 mb-2">
            Color: <span className="font-normal text-gray-600">{selectedColor}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${
                  selectedColor === color
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'border-gray-300 text-gray-700 hover:border-gray-500'
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
        <p className="text-sm font-medium text-gray-900 mb-2">Quantity</p>
        <div className="flex items-center border border-gray-300 rounded-md w-fit">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-2 text-gray-500 hover:text-gray-900 transition-colors"
          >
            −
          </button>
          <span className="px-4 py-2 text-sm font-medium text-gray-900 border-x border-gray-300">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(selectedVariant?.stock ?? 10, q + 1))}
            className="px-3 py-2 text-gray-500 hover:text-gray-900 transition-colors"
          >
            +
          </button>
        </div>
        {selectedVariant && (
          <p className="text-xs text-gray-400 mt-1">
            {selectedVariant.stock} in stock
          </p>
        )}
      </div>

      {/* Add to cart */}
      <Button
        onClick={handleAddToCart}
        isLoading={isLoading}
        disabled={isOutOfStock}
        size="lg"
        className="w-full"
      >
        {added ? (
          <span className="flex items-center gap-2">
            <Check size={18} /> Added to Cart!
          </span>
        ) : isOutOfStock ? (
          'Out of Stock'
        ) : (
          <span className="flex items-center gap-2">
            <ShoppingBag size={18} /> Add to Cart
          </span>
        )}
      </Button>
    </div>
  );
}
