'use client';

import { useOrders } from '@/hooks/useOrders';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { OrderCard } from '@/components/orders/OrderCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { Package } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function OrdersPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const { data: orders, isLoading } = useOrders();

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      )}

      {!isLoading && orders?.length === 0 && (
        <div className="text-center py-16">
          <Package size={52} className="text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-6">Start shopping to see your orders here.</p>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      )}

      {orders && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
