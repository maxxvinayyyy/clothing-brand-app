import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Order } from '@/lib/types';

export function useOrders() {
  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await api.get('/orders');
      return data;
    },
  });
}

export function useOrder(id: string) {
  return useQuery<Order>({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data } = await api.get(`/orders/${id}`);
      return data;
    },
    enabled: !!id,
  });
}
