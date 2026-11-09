import { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  columns?: 2 | 3 | 4;
}

export function ProductGrid({ products, isLoading, columns = 4 }: ProductGridProps) {
  const colClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }[columns];

  if (isLoading) {
    return (
      <div className={`grid ${colClass} gap-5`}>
        {Array.from({ length: 8 }, (_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-5xl mb-4">🛍️</p>
        <h3 className="text-lg font-semibold text-gray-900">No products found</h3>
        <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or search term.</p>
      </div>
    );
  }

  return (
    <div className={`grid ${colClass} gap-5`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
