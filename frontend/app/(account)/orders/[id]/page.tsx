'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useOrder } from '@/hooks/useOrders';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { OrderTracking } from '@/components/orders/OrderTracking';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatPrice, formatDate } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { OrderStatus } from '@/lib/types';

const statusVariant: Record<OrderStatus, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  PLACED: 'info',
  PROCESSING: 'warning',
  SHIPPED: 'info',
  DELIVERED: 'success',
  CANCELLED: 'error',
};

interface PageProps {
  params: { id: string };
}

export default function OrderDetailPage({ params }: PageProps) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const { data: order, isLoading } = useOrder(params.id);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted || !isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center">
        <p className="text-gray-500">Order not found.</p>
        <Link href="/orders" className="text-sm text-gray-900 hover:underline mt-3 block">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link href="/orders" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <ChevronLeft size={16} /> Back to Orders
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Order #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Order tracking + items */}
        <div className="md:col-span-2 space-y-6">
          {/* Tracking */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-5">Order Status</h3>
            <OrderTracking order={order} />
          </div>

          {/* Items */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Items ({order.items.length})</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-16 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={item.product.images?.[0]?.url || `https://picsum.photos/seed/${item.product.slug}/200/250`}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="font-medium text-gray-900 hover:text-gray-600 text-sm"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.variant.size} / {item.variant.color}
                    </p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatPrice(parseFloat(item.price.toString()) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary sidebar */}
        <div className="space-y-4">
          {/* Shipping address */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Shipping Address</h3>
            <div className="text-sm text-gray-600 space-y-0.5">
              <p className="font-medium text-gray-900">{order.address.name}</p>
              <p>{order.address.line1}</p>
              {order.address.line2 && <p>{order.address.line2}</p>}
              <p>{order.address.city}, {order.address.state} {order.address.zip}</p>
              <p>{order.address.country}</p>
            </div>
          </div>

          {/* Order total */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Order Total</h3>
            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
