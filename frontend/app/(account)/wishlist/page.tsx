'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useWishlist, useToggleWishlist } from '@/hooks/useWishlist';
import { ProductCard } from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function WishlistPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const { data: wishlist, isLoading } = useWishlist();

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>

      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[3/4] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && wishlist?.length === 0 && (
        <div className="text-center py-16">
          <Heart size={52} className="text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-6">Save your favorite items here.</p>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      )}

      {wishlist && wishlist.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {wishlist.map((item) => (
            <ProductCard key={item.id} product={item.product} />
          ))}
        </div>
      )}
    </div>
  );
}
