import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/lib/types';
import api from '@/lib/api';

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  addItem: (productId: string, variantId: string, quantity: number, isAuthenticated: boolean) => Promise<void>;
  removeItem: (itemId: string, isAuthenticated: boolean) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number, isAuthenticated: boolean) => Promise<void>;
  clearCart: () => void;
  syncWithBackend: () => Promise<void>;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: async (productId, variantId, quantity, isAuthenticated) => {
        if (isAuthenticated) {
          try {
            set({ isLoading: true });
            const { data } = await api.post('/cart/items', { productId, variantId, quantity });
            set({ items: data.items, isLoading: false });
          } catch {
            set({ isLoading: false });
            throw new Error('Failed to add item to cart');
          }
        }
      },

      removeItem: async (itemId, isAuthenticated) => {
        if (isAuthenticated) {
          try {
            const { data } = await api.delete(`/cart/items/${itemId}`);
            set({ items: data.items });
          } catch {
            throw new Error('Failed to remove item from cart');
          }
        }
      },

      updateQuantity: async (itemId, quantity, isAuthenticated) => {
        if (isAuthenticated) {
          try {
            const { data } = await api.put(`/cart/items/${itemId}`, { quantity });
            set({ items: data.items });
          } catch {
            throw new Error('Failed to update cart item');
          }
        }
      },

      clearCart: () => set({ items: [] }),

      syncWithBackend: async () => {
        try {
          const { data } = await api.get('/cart');
          set({ items: data.items });
        } catch {
          // Ignore sync errors
        }
      },

      total: () => {
        return get().items.reduce((sum, item) => {
          return sum + parseFloat(item.product.price.toString()) * item.quantity;
        }, 0);
      },

      itemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
