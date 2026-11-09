import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { WishlistItem } from '@/lib/types';
import { useAuthStore } from '@/store/authStore';

export function useWishlist() {
  const { isAuthenticated } = useAuthStore();
  return useQuery<WishlistItem[]>({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const { data } = await api.get('/wishlist');
      return data;
    },
    enabled: isAuthenticated,
  });
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.post('/wishlist', { productId });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  });

  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      await api.delete(`/wishlist/${productId}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  });

  return { addMutation, removeMutation };
}
