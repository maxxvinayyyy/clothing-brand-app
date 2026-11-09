'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Category } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { SlidersHorizontal, X } from 'lucide-react';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('category') ? [searchParams.get('category')!] : []
  );
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const { data: categoriesData } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => { const { data } = await api.get('/categories'); return data; },
  });

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (selectedCategories.length === 1) params.set('category', selectedCategories[0]);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    router.push(`/products?${params.toString()}`);
    setMobileOpen(false);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setMinPrice('');
    setMaxPrice('');
    setSelectedSizes([]);
    router.push('/products');
    setMobileOpen(false);
  };

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const hasFilters = selectedCategories.length > 0 || minPrice || maxPrice || selectedSizes.length > 0;

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Category</h4>
        <div className="space-y-2">
          {categoriesData?.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.slug)}
                onChange={() => toggleCategory(cat.slug)}
                className="rounded border-gray-300 text-gray-900 focus:ring-gray-500"
              />
              <span className="text-sm text-gray-700">{cat.name}</span>
              {cat._count && (
                <span className="text-xs text-gray-400 ml-auto">({cat._count.products})</span>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Price Range</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            min={0}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <span className="text-gray-400">–</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            min={0}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Size</h4>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${
                selectedSizes.includes(size)
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'border-gray-300 text-gray-700 hover:border-gray-500'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 pt-2">
        <Button onClick={applyFilters} size="sm">Apply Filters</Button>
        {hasFilters && (
          <Button onClick={clearFilters} variant="ghost" size="sm">
            <X size={14} className="mr-1" /> Clear Filters
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <SlidersHorizontal size={16} className="mr-2" />
          Filters {hasFilters && `(active)`}
        </Button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-white p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <button onClick={() => setMobileOpen(false)}><X size={18} /></button>
            </div>
            <FiltersContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-56 flex-shrink-0">
        <div className="sticky top-20">
          <h3 className="font-semibold text-gray-900 mb-5">Filters</h3>
          <FiltersContent />
        </div>
      </div>
    </>
  );
}
