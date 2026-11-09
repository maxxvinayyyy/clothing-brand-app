import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Product, ProductFilters, ProductsResponse } from '@/lib/types';

export function useProducts(filters: ProductFilters = {}) {
  return useQuery<ProductsResponse>({
    queryKey: ['products', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice !== undefined) params.append('minPrice', String(filters.minPrice));
      if (filters.maxPrice !== undefined) params.append('maxPrice', String(filters.maxPrice));
      if (filters.search) params.append('search', filters.search);
      if (filters.featured !== undefined) params.append('featured', String(filters.featured));
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
      const { data } = await api.get(`/products?${params.toString()}`);
      return data;
    },
  });
}

export function useProduct(slug: string) {
  return useQuery<Product>({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data } = await api.get(`/products/${slug}`);
      return data;
    },
    enabled: !!slug,
  });
}

export function useFeaturedProducts() {
  return useQuery<ProductsResponse>({
    queryKey: ['products', { featured: true }],
    queryFn: async () => {
      const { data } = await api.get('/products?featured=true&limit=4');
      return data;
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: any) => {
      const { data } = await api.post('/products', product);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...product }: any) => {
      const { data } = await api.put(`/products/${id}`, product);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/products/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
