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
    <div className="relative min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/products" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-neutral-400 hover:text-white mb-8 transition-colors">
        <ChevronLeft size={16} /> Back to Catalog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {/* Images */}
        <div>
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-neutral-900 border border-white/[0.08] mb-4 shadow-2xl">
            <Image
              src={images[selectedImageIdx]?.url || `https://picsum.photos/seed/${product.slug}/800/1000`}
              alt={images[selectedImageIdx]?.alt || product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.slice(0, 4).map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`relative aspect-square rounded-xl overflow-hidden bg-neutral-900 border-2 transition-all ${
                    selectedImageIdx === idx ? 'border-indigo-400 scale-105' : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img.url} alt={img.alt || product.name} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <Badge variant="info">{product.category?.name || 'Exclusive Edit'}</Badge>
            <button
              onClick={handleWishlistToggle}
              className="p-3 rounded-full bg-white/[0.06] border border-white/10 hover:bg-white/[0.12] text-white transition-all shadow-md"
            >
              <Heart
                size={18}
                className={isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-neutral-400'}
              />
            </button>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mb-3">{product.name}</h1>

          <div className="flex items-center gap-3 mb-5">
            {(product.averageRating ?? 0) > 0 && (
              <>
                <StarRating rating={product.averageRating ?? 0} size={15} />
                <span className="text-xs text-neutral-400">
                  {(product.averageRating ?? 0).toFixed(1)} ({product.reviewCount} client reviews)
                </span>
              </>
            )}
          </div>

          <p className="text-3xl font-black text-white tracking-wide mb-8">{formatPrice(product.price)}</p>

          <div className="glass-card p-6 rounded-2xl border border-white/[0.08] mb-8">
            <AddToCartButton product={product} />
          </div>

          {/* Tabs */}
          <div className="mt-4">
            <div className="flex border-b border-white/[0.08]">
              {(['description', 'reviews'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-xs uppercase tracking-widest font-bold capitalize transition-colors border-b-2 -mb-px ${
                    activeTab === tab
                      ? 'border-indigo-400 text-white'
                      : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {tab} {tab === 'reviews' && reviews ? `(${reviews.length})` : ''}
                </button>
              ))}
            </div>

            <div className="pt-6">
              {activeTab === 'description' && (
                <p className="text-neutral-300 text-sm leading-relaxed font-light">{product.description}</p>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-5">
                  {reviews?.length === 0 && (
                    <p className="text-neutral-400 text-xs font-light">No client reviews yet. Be the first to review!</p>
                  )}
                  {reviews?.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}

                  {/* Add review form */}
                  {isAuthenticated && (
                    <form onSubmit={handleSubmit(onReviewSubmit)} className="glass-card rounded-2xl p-6 border border-white/10 space-y-4 mt-6">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">Write an Atelier Review</h4>
                      <div>
                        <label className="text-xs font-medium text-neutral-300 mb-1.5 block">Rating</label>
                        <select
                          {...register('rating', { required: true })}
                          className="bg-white/[0.06] border border-white/15 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
                        >
                          {[5, 4, 3, 2, 1].map((r) => (
                            <option key={r} value={r} className="bg-neutral-900 text-white">{'⭐'.repeat(r)} {r} star{r !== 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-neutral-300 mb-1.5 block">Thoughts on Quality & Fit</label>
                        <textarea
                          {...register('comment')}
                          rows={3}
                          placeholder="Share your thoughts about this product..."
                          className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-white/40 resize-none"
                        />
                      </div>
                      <Button type="submit" isLoading={addReview.isPending} size="sm" className="bg-white text-black text-xs font-bold uppercase tracking-wider">
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
