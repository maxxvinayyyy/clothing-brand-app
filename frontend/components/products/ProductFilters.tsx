'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
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
        <h4 className="text-xs font-bold text-neutral-200 mb-3 uppercase tracking-widest">Category</h4>
        <div className="space-y-2">
          {categoriesData?.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.slug)}
                onChange={() => toggleCategory(cat.slug)}
                className="rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-indigo-400"
              />
              <span className="text-xs text-neutral-300 group-hover:text-white transition-colors">{cat.name}</span>
              {cat._count && (
                <span className="text-[10px] text-neutral-500 ml-auto">({cat._count.products})</span>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-xs font-bold text-neutral-200 mb-3 uppercase tracking-widest">Price Range</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            min={0}
            className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-white/30"
          />
          <span className="text-neutral-500">–</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            min={0}
            className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-white/30"
          />
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h4 className="text-xs font-bold text-neutral-200 mb-3 uppercase tracking-widest">Size</h4>
        <div className="flex flex-wrap gap-1.5">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                selectedSizes.includes(size)
                  ? 'bg-white text-black border-white shadow-md'
                  : 'bg-white/[0.04] border-white/10 text-neutral-300 hover:border-white/30 hover:text-white'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 pt-2">
        <Button onClick={applyFilters} size="sm" className="bg-white text-black hover:bg-neutral-200 uppercase tracking-wider text-[11px] font-bold rounded-xl py-2.5">
          Apply Filters
        </Button>
        {hasFilters && (
          <Button onClick={clearFilters} variant="ghost" size="sm" className="text-neutral-400 hover:text-white text-xs">
            <X size={13} className="mr-1" /> Reset All
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filters Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 glass-card p-6 rounded-2xl h-fit sticky top-28">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
          <h3 className="text-xs font-black tracking-widest uppercase text-white flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-cyan-400" /> Refine
          </h3>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-[10px] uppercase tracking-wider text-rose-400 hover:text-rose-300"
            >
              Reset
            </button>
          )}
        </div>
        <FiltersContent />
      </aside>

      {/* Mobile Filters Floating Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 bg-white text-black px-5 py-3 rounded-full font-bold shadow-2xl text-xs uppercase tracking-wider hover:scale-105 active:scale-95 transition-all"
        >
          <SlidersHorizontal size={16} /> Filters {hasFilters && '•'}
        </button>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md" onClick={() => setMobileOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-80 max-w-full bg-[#0c0e17] border-l border-white/10 p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-cyan-400" /> Filters
              </h3>
              <button onClick={() => setMobileOpen(false)} className="text-neutral-400 hover:text-white p-1">
                <X size={20} />
              </button>
            </div>
            <FiltersContent />
          </div>
        </div>
      )}
    </>
  );
}
