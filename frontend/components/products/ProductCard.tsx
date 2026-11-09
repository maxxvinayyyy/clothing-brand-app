'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { StarRating } from '@/components/ui/StarRating';
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
      <div className="relative overflow-hidden rounded-2xl aspect-[3/4] bg-neutral-900 border border-white/[0.08] shadow-lg group-hover:border-white/25 transition-all duration-500">
        <Image
          src={mainImage}
          alt={product.images?.[0]?.alt || product.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-108 opacity-95 group-hover:opacity-100"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Ambient Bottom Gradient Veil */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

        {/* Wishlist Button with Frosted Glass */}
        <button
          onClick={handleWishlistToggle}
          aria-label="Save to wishlist"
          className="absolute top-3.5 right-3.5 p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white shadow-md hover:bg-white hover:text-black hover:scale-110 active:scale-90 transition-all duration-200 z-10"
        >
          <Heart
            size={15}
            className={`transition-colors duration-200 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-neutral-200'}`}
          />
        </button>

        {product.featured && (
          <div className="absolute top-3.5 left-3.5 z-10">
            <span className="inline-block px-3 py-1 text-[10px] font-bold tracking-widest uppercase bg-indigo-500/20 backdrop-blur-md border border-indigo-400/40 text-indigo-200 rounded-full">
              Atelier Pick
            </span>
          </div>
        )}

        {/* Apple-style Quick View Slide Up Button */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out z-10">
          <div className="w-full py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider text-center rounded-xl shadow-2xl hover:bg-neutral-100 transition-colors">
            View Details
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-1.5 px-1">
        <p className="text-[10px] font-semibold text-indigo-400 uppercase tracking-[0.2em]">
          {product.category?.name || 'Exclusive Edit'}
        </p>
        <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center justify-between pt-0.5">
          <p className="text-sm font-bold text-slate-100 tracking-wide">{formatPrice(product.price)}</p>
          <div className="flex items-center gap-1.5">
            {(product.averageRating ?? 0) > 0 && (
              <StarRating rating={product.averageRating ?? 0} size={11} />
            )}
            {product.reviewCount !== undefined && product.reviewCount > 0 && (
              <span className="text-[11px] text-neutral-400">({product.reviewCount})</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
