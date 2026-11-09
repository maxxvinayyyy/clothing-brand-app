import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

export function useCart() {
  const { items, isLoading, total, itemCount } = useCartStore();
  return { items, isLoading, total: total(), itemCount: itemCount() };
}

export function useAddToCart() {
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  return {
    addToCart: (productId: string, variantId: string, quantity: number) =>
      addItem(productId, variantId, quantity, isAuthenticated),
  };
}

export function useRemoveFromCart() {
  const { removeItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  return {
    removeFromCart: (itemId: string) => removeItem(itemId, isAuthenticated),
  };
}

export function useUpdateQuantity() {
  const { updateQuantity } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  return {
    updateQuantity: (itemId: string, quantity: number) =>
      updateQuantity(itemId, quantity, isAuthenticated),
  };
}
