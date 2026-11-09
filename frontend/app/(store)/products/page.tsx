'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductFilters } from '@/components/products/ProductFilters';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LiquidBackground } from '@/components/ui/LiquidBackground';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = searchParams.get('category') || undefined;
  const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
  const search = searchParams.get('search') || undefined;
  const featured = searchParams.get('featured') === 'true' ? true : undefined;
  const sort = searchParams.get('sort') || undefined;
  const page = parseInt(searchParams.get('page') || '1');
  const [searchInput, setSearchInput] = useState(search || '');

  const { data, isLoading } = useProducts({
    category, minPrice, maxPrice, search, featured, sort, page, limit: 12
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput.trim()) {
      params.set('search', searchInput);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(p));
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="relative min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <LiquidBackground variant="ambient" />

      {/* Header Banner */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/[0.08]">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-cyan-400 font-bold block mb-2">
            ELEVARE Atelier
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Curated Catalog'}
            {search && <span className="text-neutral-400 text-2xl ml-3 font-light">&ldquo;{search}&rdquo;</span>}
          </h1>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-80">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search pieces..."
              className="w-full bg-white/[0.06] border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-white/40 backdrop-blur-md"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm" className="rounded-full bg-white/[0.08] text-white border-white/20 hover:bg-white/15 px-4 text-xs uppercase tracking-wider">
            Filter
          </Button>
        </form>
      </div>

      <div className="flex gap-10">
        <ProductFilters />

        <div className="flex-1 min-w-0">
          {/* Top Sort Bar */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-xs uppercase tracking-widest text-neutral-400">
              {!isLoading && data && `${data.pagination.total} styles available`}
            </p>
            <select
              value={sort || ''}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams.toString());
                if (e.target.value) {
                  params.set('sort', e.target.value);
                } else {
                  params.delete('sort');
                }
                params.set('page', '1');
                router.push(`/products?${params.toString()}`);
              }}
              className="text-xs uppercase tracking-wider font-semibold bg-[#11131c] text-neutral-200 border border-white/10 rounded-xl px-3.5 py-2 focus:outline-none focus:border-white/30"
            >
              <option value="">Sort: Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Alphabetical: A to Z</option>
            </select>
          </div>

          <ProductGrid
            products={data?.products || []}
            isLoading={isLoading}
            columns={3}
          />

          {/* Pagination */}
          {data && data.pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-14">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="rounded-full p-2.5 bg-white/[0.05] border-white/10 text-white hover:bg-white/10"
              >
                <ChevronLeft size={16} />
              </Button>
              <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold px-3">
                Page {page} of {data.pagination.pages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => goToPage(page + 1)}
                disabled={page >= data.pagination.pages}
                className="rounded-full p-2.5 bg-white/[0.05] border-white/10 text-white hover:bg-white/10"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 text-center text-neutral-400">Loading catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
