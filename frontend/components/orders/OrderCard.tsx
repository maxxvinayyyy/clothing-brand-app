import Link from 'next/link';
import { Order } from '@/lib/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { OrderStatus } from '@/lib/types';

const statusVariant: Record<OrderStatus, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  PLACED: 'info',
  PROCESSING: 'warning',
  SHIPPED: 'info',
  DELIVERED: 'success',
  CANCELLED: 'error',
};

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Link href={`/orders/${order.id}`} className="block border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-gray-500">Order #{order.id.slice(-8).toUpperCase()}</p>
          <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
        </div>
        <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
        </p>
        <p className="font-semibold text-gray-900">{formatPrice(order.total)}</p>
      </div>
    </Link>
  );
}
