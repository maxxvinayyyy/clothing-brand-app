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
      <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[3/4]">
        <Image
          src={mainImage}
          alt={product.images?.[0]?.alt || product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Wishlist button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-colors"
        >
          <Heart
            size={16}
            className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500'}
          />
        </button>

        {product.featured && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-gray-900 text-white text-xs">Featured</Badge>
          </div>
        )}
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-xs text-gray-500 uppercase tracking-wider">{product.category?.name}</p>
        <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-1">
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
