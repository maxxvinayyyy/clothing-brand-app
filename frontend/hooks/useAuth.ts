import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { AuthResponse } from '@/lib/types';

export function useLogin() {
  const { setAuth } = useAuthStore();
  const { syncWithBackend } = useCartStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
      return data;
    },
    onSuccess: async (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      await syncWithBackend();
      if (data.user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    },
  });
}

export function useSignup() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ name, email, password }: { name: string; email: string; password: string }) => {
      const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password });
      return data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      router.push('/');
    },
  });
}

export function useLogout() {
  const { clearAuth } = useAuthStore();
  const { clearCart } = useCartStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore error
    }
    clearAuth();
    clearCart();
    queryClient.clear();
    router.push('/');
  };

  return { logout };
}
