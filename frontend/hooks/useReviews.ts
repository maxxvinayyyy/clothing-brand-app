import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Review } from '@/lib/types';

export function useReviews(productId: string) {
  return useQuery<Review[]>({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const { data } = await api.get(`/reviews/${productId}`);
      return data;
    },
    enabled: !!productId,
  });
}

export function useAddReview(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ rating, comment }: { rating: number; comment?: string }) => {
      const { data } = await api.post(`/reviews/${productId}`, { rating, comment });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
  });
}
