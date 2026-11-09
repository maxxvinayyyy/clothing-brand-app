'use client';

import { Order, OrderStatus } from '@/lib/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

const statusVariant: Record<OrderStatus, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  PLACED: 'info',
  PROCESSING: 'warning',
  SHIPPED: 'info',
  DELIVERED: 'success',
  CANCELLED: 'error',
};

interface OrderTableProps {
  orders: Order[];
}

export function OrderTable({ orders }: OrderTableProps) {
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const { data } = await api.put(`/orders/${id}/status`, { status });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-orders'] }),
  });

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Update</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-5 py-4 font-mono text-xs text-gray-500">
                #{order.id.slice(-8).toUpperCase()}
              </td>
              <td className="px-5 py-4">
                {order.user ? (
                  <div>
                    <p className="font-medium text-gray-900">{order.user.name}</p>
                    <p className="text-xs text-gray-500">{order.user.email}</p>
                  </div>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
              <td className="px-5 py-4 text-gray-600">{formatDate(order.createdAt)}</td>
              <td className="px-5 py-4 font-medium text-gray-900">{formatPrice(order.total)}</td>
              <td className="px-5 py-4">
                <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
              </td>
              <td className="px-5 py-4">
                <select
                  value={order.status}
                  onChange={(e) =>
                    updateStatusMutation.mutate({ id: order.id, status: e.target.value as OrderStatus })
                  }
                  className="text-sm border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-gray-400"
                >
                  {(['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as OrderStatus[]).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {orders.length === 0 && (
        <div className="text-center py-12 text-gray-500">No orders found.</div>
      )}
    </div>
  );
}
