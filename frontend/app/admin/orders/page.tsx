'use client';

import { useState } from 'react';
import { useAdminOrders } from '@/hooks/useAdmin';
import { OrderTable } from '@/components/admin/OrderTable';
import { Skeleton } from '@/components/ui/Skeleton';
import { OrderStatus } from '@/lib/types';

const statusTabs: { label: string; value?: OrderStatus }[] = [
  { label: 'All Orders', value: undefined },
  { label: 'Placed', value: 'PLACED' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Shipped', value: 'SHIPPED' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export default function AdminOrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const { data, isLoading, error } = useAdminOrders(selectedStatus);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Order Management</h1>
        <p className="text-sm text-gray-500 mt-1">Review orders, update fulfillment statuses, and track deliveries.</p>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {statusTabs.map((tab) => {
          const isActive = selectedStatus === tab.value;
          return (
            <button
              key={tab.label}
              onClick={() => setSelectedStatus(tab.value)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
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
          <p className="text-red-500 font-medium">Failed to load orders.</p>
        </div>
      ) : (
        <OrderTable orders={data?.orders || []} />
      )}
    </div>
  );
}
