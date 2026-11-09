'use client';

import Link from 'next/link';
import { DollarSign, ShoppingBag, Package, Users, ArrowRight, Plus } from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';
import { OrderTable } from '@/components/admin/OrderTable';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAdminAnalytics } from '@/hooks/useAdmin';
import { formatPrice } from '@/lib/utils';

export default function AdminDashboardPage() {
  const { data, isLoading, error } = useAdminAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-gray-200">
        <p className="text-red-500 font-medium">Failed to load analytics data.</p>
        <p className="text-sm text-gray-500 mt-1">Please ensure the backend is running and you have admin privileges.</p>
      </div>
    );
  }

  const { stats, recentOrders, ordersByStatus } = data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor your store's sales, inventory, and order activity.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/products/new">
            <Button size="sm">
              <Plus size={16} className="mr-1.5" /> Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          label="Total Revenue"
          value={formatPrice(stats.totalRevenue)}
          icon={DollarSign}
          description="Net revenue from non-cancelled orders"
        />
        <StatsCard
          label="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          description="All lifetime customer orders"
        />
        <StatsCard
          label="Active Products"
          value={stats.totalProducts}
          icon={Package}
          description="Items available in catalog"
        />
        <StatsCard
          label="Customers"
          value={stats.totalUsers}
          icon={Users}
          description="Registered buyer accounts"
        />
      </div>

      {/* Status Breakdown Chips */}
      {ordersByStatus && ordersByStatus.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Order Status Pipeline</h2>
          <div className="flex flex-wrap gap-3">
            {ordersByStatus.map((item) => (
              <div
                key={item.status}
                className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 flex items-center gap-2"
              >
                <span className="text-xs font-medium text-gray-500">{item.status}:</span>
                <span className="text-sm font-bold text-gray-900">{item._count._all}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 font-medium"
          >
            View all orders <ArrowRight size={14} />
          </Link>
        </div>
        <OrderTable orders={recentOrders} />
      </div>
    </div>
  );
}
