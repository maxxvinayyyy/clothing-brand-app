'use client';

import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { ProductTable } from '@/components/admin/ProductTable';
import { Skeleton } from '@/components/ui/Skeleton';
import { Search } from 'lucide-react';

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading, error } = useProducts({ search, limit: 100 });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Products Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage catalog inventory, variants, prices, and visibility.</p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search products by name or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full rounded-xl" />
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-white rounded-xl border border-gray-200">
          <p className="text-red-500 font-medium">Failed to load products.</p>
        </div>
      ) : (
        <ProductTable products={data?.products || []} />
      )}
    </div>
  );
}
