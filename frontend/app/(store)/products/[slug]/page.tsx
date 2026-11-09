'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useProduct } from '@/hooks/useProducts';
import { useReviews, useAddReview } from '@/hooks/useReviews';
import { useAuthStore } from '@/store/authStore';
import { useWishlist, useToggleWishlist } from '@/hooks/useWishlist';
import { AddToCartButton } from '@/components/products/AddToCartButton';
import { ReviewCard } from '@/components/products/ReviewCard';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatPrice } from '@/lib/utils';
import { Heart, ChevronLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface PageProps {
  params: { slug: string };
}

export default function ProductDetailPage({ params }: PageProps) {
  const { data: product, isLoading } = useProduct(params.slug);
  const { data: reviews } = useReviews(product?.id || '');
  const addReview = useAddReview(product?.id || '');
  const { isAuthenticated } = useAuthStore();
  const { data: wishlist } = useWishlist();
  const { addMutation, removeMutation } = useToggleWishlist();

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<{ rating: number; comment: string }>();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-3">
            <Skeleton className="aspect-[3/4] w-full rounded-xl" />
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="aspect-square w-full rounded-lg" />)}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return notFound();

  const isWishlisted = wishlist?.some((w) => w.productId === product.id) ?? false;
  const images = product.images?.length > 0
    ? product.images
    : [{ id: '1', url: `https://picsum.photos/seed/${product.slug}/800/1000`, alt: product.name, productId: product.id }];

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) { window.location.href = '/login'; return; }
    if (isWishlisted) {
      await removeMutation.mutateAsync(product.id);
    } else {
      await addMutation.mutateAsync(product.id);
    }
  };

  const onReviewSubmit = async (data: { rating: number; comment: string }) => {
    await addReview.mutateAsync({ rating: parseInt(String(data.rating)), comment: data.comment });
    reset();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/products" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors">
        <ChevronLeft size={16} /> Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-3">
            <Image
              src={images[selectedImageIdx]?.url || `https://picsum.photos/seed/${product.slug}/800/1000`}
              alt={images[selectedImageIdx]?.alt || product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.slice(0, 4).map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`relative aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 transition-colors ${
                    selectedImageIdx === idx ? 'border-gray-900' : 'border-transparent'
                  }`}
                >
                  <Image src={img.url} alt={img.alt || product.name} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-start justify-between mb-3">
            <Badge>{product.category?.name}</Badge>
            <button
              onClick={handleWishlistToggle}
              className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Heart
                size={20}
                className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}
              />
            </button>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            {(product.averageRating ?? 0) > 0 && (
              <>
                <StarRating rating={product.averageRating ?? 0} size={16} />
                <span className="text-sm text-gray-500">
                  {(product.averageRating ?? 0).toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </>
            )}
          </div>

          <p className="text-2xl font-bold text-gray-900 mb-6">{formatPrice(product.price)}</p>

          <AddToCartButton product={product} />

          {/* Tabs */}
          <div className="mt-10">
            <div className="flex border-b border-gray-200">
              {(['description', 'reviews'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                    activeTab === tab
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab} {tab === 'reviews' && reviews ? `(${reviews.length})` : ''}
                </button>
              ))}
            </div>

            <div className="pt-5">
              {activeTab === 'description' && (
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-5">
                  {reviews?.length === 0 && (
                    <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
                  )}
                  {reviews?.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}

                  {/* Add review form */}
                  {isAuthenticated && (
                    <form onSubmit={handleSubmit(onReviewSubmit)} className="border border-gray-200 rounded-xl p-5 space-y-4 mt-6">
                      <h4 className="font-semibold text-gray-900">Write a Review</h4>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Rating</label>
                        <select
                          {...register('rating', { required: true })}
                          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                        >
                          {[5, 4, 3, 2, 1].map((r) => (
                            <option key={r} value={r}>{'⭐'.repeat(r)} {r} star{r !== 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Comment (optional)</label>
                        <textarea
                          {...register('comment')}
                          rows={3}
                          placeholder="Share your thoughts about this product..."
                          className="w-full border border-gray-300 rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none"
                        />
                      </div>
                      <Button type="submit" isLoading={addReview.isPending} size="sm">
                        Submit Review
                      </Button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
