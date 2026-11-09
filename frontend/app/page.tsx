'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProductGrid } from '@/components/products/ProductGrid';
import { useFeaturedProducts, useProducts } from '@/hooks/useProducts';

const categories = [
  {
    name: 'Men',
    slug: 'men',
    image: 'https://picsum.photos/seed/men-category/600/700',
    description: 'Refined essentials for every occasion',
  },
  {
    name: 'Women',
    slug: 'women',
    image: 'https://picsum.photos/seed/women-category/600/700',
    description: 'Elegant pieces for the modern woman',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    image: 'https://picsum.photos/seed/accessories-category/600/700',
    description: 'Complete your look with our curated accessories',
  },
];

export default function HomePage() {
  const { data: featuredData, isLoading: featuredLoading } = useFeaturedProducts();
  const { data: newArrivalsData, isLoading: newLoading } = useProducts({ sort: 'newest', limit: 4 });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-gray-100">
        <Image
          src="https://picsum.photos/seed/hero-banner/1600/900"
          alt="Hero banner"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/50" />
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          <p className="text-sm font-medium tracking-[0.25em] uppercase mb-4 opacity-90">ELEVARE COLLECTION</p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-none">
            Elevate Your<br />Everyday Aesthetic
          </h1>
          <p className="text-lg sm:text-xl opacity-90 mb-10 max-w-xl mx-auto leading-relaxed">
            Timeless silhouettes crafted for the modern individual. Quality you can feel, elegance you can wear.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                Shop Now <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link href="/products?featured=true">
              <Button
                size="lg"
                variant="secondary"
                className="border-white text-white bg-transparent hover:bg-white/10"
              >
                View Collections
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Handpicked for You</p>
            <h2 className="text-3xl font-bold text-gray-900">Featured Collection</h2>
          </div>
          <Link
            href="/products?featured=true"
            className="hidden sm:flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            View all <ChevronRight size={16} />
          </Link>
        </div>
        <ProductGrid
          products={featuredData?.products || []}
          isLoading={featuredLoading}
        />
      </section>

      {/* Categories */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Browse By</p>
            <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/products?category=${cat.slug}`} className="group relative overflow-hidden rounded-2xl aspect-[3/4] block">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-1">{cat.name}</h3>
                  <p className="text-sm opacity-80">{cat.description}</p>
                  <div className="mt-3 flex items-center gap-1 text-sm font-medium">
                    Shop Now <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Just In</p>
            <h2 className="text-3xl font-bold text-gray-900">New Arrivals</h2>
          </div>
          <Link
            href="/products"
            className="hidden sm:flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            View all <ChevronRight size={16} />
          </Link>
        </div>
        <ProductGrid
          products={newArrivalsData?.products || []}
          isLoading={newLoading}
        />
      </section>

      {/* CTA Banner */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Free Shipping on Orders Over $100</h2>
          <p className="text-gray-400 mb-8">Join thousands of satisfied customers who trust BRAND for their wardrobe essentials.</p>
          <Link href="/products">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
              Start Shopping
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
