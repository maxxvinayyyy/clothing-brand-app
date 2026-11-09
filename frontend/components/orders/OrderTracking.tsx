import { Order, OrderStatus } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Check, Package, Truck, MapPin, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusSteps: { status: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { status: 'PLACED', label: 'Order Placed', icon: <Check size={16} /> },
  { status: 'PROCESSING', label: 'Processing', icon: <Package size={16} /> },
  { status: 'SHIPPED', label: 'Shipped', icon: <Truck size={16} /> },
  { status: 'DELIVERED', label: 'Delivered', icon: <MapPin size={16} /> },
];

const statusOrder: OrderStatus[] = ['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

interface OrderTrackingProps {
  order: Order;
}

export function OrderTracking({ order }: OrderTrackingProps) {
  const isCancelled = order.status === 'CANCELLED';
  const currentIndex = statusOrder.indexOf(order.status);

  if (isCancelled) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
        <XCircle className="text-red-500" size={20} />
        <div>
          <p className="font-medium text-red-700">Order Cancelled</p>
          <p className="text-sm text-red-500">This order has been cancelled.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200" />

      <div className="space-y-6">
        {statusSteps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.status} className="flex items-center gap-4 relative">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center z-10 flex-shrink-0 transition-all',
                  isCompleted
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-400'
                )}
              >
                {step.icon}
              </div>
              <div>
                <p className={cn('font-medium text-sm', isCompleted ? 'text-gray-900' : 'text-gray-400')}>
                  {step.label}
                </p>
                {isCurrent && (
                  <p className="text-xs text-gray-500">{formatDate(order.updatedAt)}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
