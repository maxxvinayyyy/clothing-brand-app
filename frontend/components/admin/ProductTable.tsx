'use client';

import Link from 'next/link';
import { Product } from '@/lib/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useDeleteProduct } from '@/hooks/useProducts';
import { useState } from 'react';

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
  const deleteMutation = useDeleteProduct();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setDeletingId(id);
    try {
      await deleteMutation.mutateAsync(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-gray-900">Products ({products.length})</h2>
        <Link href="/admin/products/new">
          <Button size="sm">
            <Plus size={16} className="mr-1" /> Add Product
          </Button>
        </Link>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.slug}</p>
                  </div>
                </td>
                <td className="px-5 py-4 text-gray-600">{product.category?.name}</td>
                <td className="px-5 py-4 font-medium text-gray-900">{formatPrice(product.price)}</td>
                <td className="px-5 py-4 text-gray-500">{formatDate(product.createdAt)}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/products/${product.id}`}>
                      <Button variant="ghost" size="sm">
                        <Edit size={14} />
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      isLoading={deletingId === product.id}
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
}
