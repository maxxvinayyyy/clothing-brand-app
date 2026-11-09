import { CartItem } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

interface OrderSummaryProps {
  items: CartItem[];
  shipping?: number;
}

export function OrderSummary({ items, shipping = 0 }: OrderSummaryProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + parseFloat(item.product.price.toString()) * item.quantity,
    0
  );
  const total = subtotal + shipping;

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>

      <div className="space-y-3 mb-5">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 items-center">
            <div className="relative w-14 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-200">
              <Image
                src={item.product.images?.[0]?.url || `https://picsum.photos/seed/${item.product.slug}/200/250`}
                alt={item.product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.product.name}</p>
              <p className="text-xs text-gray-500">{item.variant.size} / {item.variant.color}</p>
              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm font-medium text-gray-900 flex-shrink-0">
              {formatPrice(parseFloat(item.product.price.toString()) * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-900">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
        </div>
        <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-gray-900">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
