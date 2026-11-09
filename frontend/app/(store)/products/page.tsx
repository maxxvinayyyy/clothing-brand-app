'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductFilters } from '@/components/products/ProductFilters';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All Products'}
          {search && <span className="text-gray-500 text-2xl ml-2">— "{search}"</span>}
        </h1>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..."
              className="w-full border border-gray-300 rounded-md pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
          <Button type="submit" variant="secondary" size="md">Search</Button>
        </form>
      </div>

      <div className="flex gap-8">
        <ProductFilters />
        <div className="flex-1 min-w-0">
          {/* Sort */}
          <div className="flex justify-between items-center mb-5">
            <p className="text-sm text-gray-500">
              {!isLoading && data && `${data.pagination.total} products found`}
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
              className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
            >
              <option value="">Sort: Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>

          <ProductGrid
            products={data?.products || []}
            isLoading={isLoading}
            columns={3}
          />

          {/* Pagination */}
          {data && data.pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-10">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
              >
                <ChevronLeft size={16} />
              </Button>
              <span className="text-sm text-gray-600">
                Page {page} of {data.pagination.pages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => goToPage(page + 1)}
                disabled={page >= data.pagination.pages}
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
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-10 text-center text-gray-400">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
