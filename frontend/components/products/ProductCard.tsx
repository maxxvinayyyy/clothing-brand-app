'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/store/authStore';
import { useWishlist, useToggleWishlist } from '@/hooks/useWishlist';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { isAuthenticated } = useAuthStore();
  const { data: wishlist } = useWishlist();
  const { addMutation, removeMutation } = useToggleWishlist();

  const isWishlisted = wishlist?.some((w) => w.productId === product.id) ?? false;
  const mainImage = product.images?.[0]?.url || `https://picsum.photos/seed/${product.slug}/800/1000`;

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    if (isWishlisted) {
      await removeMutation.mutateAsync(product.id);
    } else {
      await addMutation.mutateAsync(product.id);
    }
  };

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-[3/4] shadow-sm hover:shadow-lg transition-all duration-500">
        <Image
          src={mainImage}
          alt={product.images?.[0]?.alt || product.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Gradient shadow on bottom on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Wishlist button */}
        <button
          onClick={handleWishlistToggle}
          aria-label="Save to wishlist"
          className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm hover:bg-white hover:scale-110 active:scale-90 transition-all duration-200 z-10"
        >
          <Heart
            size={16}
            className={`transition-colors duration-200 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-700'}`}
          />
        </button>

        {product.featured && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-block px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase bg-gray-950/80 backdrop-blur-sm text-white rounded-full">
              Featured
            </span>
          </div>
        )}

        {/* Quick View Button Slide Up */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out z-10">
          <div className="w-full py-2.5 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-semibold uppercase tracking-wider text-center rounded-lg shadow-md hover:bg-white transition-colors">
            View Details
          </div>
        </div>
      </div>

      <div className="mt-3.5 space-y-1">
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">{product.category?.name}</p>
        <h3 className="text-sm font-medium text-gray-900 group-hover:text-black transition-colors line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          {(product.averageRating ?? 0) > 0 && (
            <StarRating rating={product.averageRating ?? 0} size={12} />
          )}
          {product.reviewCount !== undefined && product.reviewCount > 0 && (
            <span className="text-xs text-gray-400">({product.reviewCount})</span>
          )}
        </div>
        <p className="text-sm font-semibold text-gray-900">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
