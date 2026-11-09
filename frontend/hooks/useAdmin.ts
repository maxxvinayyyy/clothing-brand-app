import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Order } from '@/lib/types';

export interface AdminAnalytics {
  stats: {
    totalRevenue: number | string;
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
  };
  recentOrders: Order[];
  ordersByStatus: Array<{
    status: string;
    _count: { _all: number };
  }>;
}

export function useAdminAnalytics() {
  return useQuery<AdminAnalytics>({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const { data } = await api.get('/admin/analytics');
      return data;
    },
  });
}

export function useAdminOrders(status?: string) {
  return useQuery<{ orders: Order[]; pagination: { total: number; page: number; limit: number; pages: number } }>({
    queryKey: ['admin-orders', status],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      const { data } = await api.get(`/orders/all?${params.toString()}`);
      return data;
    },
  });
}
