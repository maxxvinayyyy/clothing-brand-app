'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LiquidBackground } from '@/components/ui/LiquidBackground';
import { ElevareLogo } from '@/components/ui/ElevareLogo';
import { useLogin } from '@/hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();
  const [apiError, setApiError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginValues) => {
    setApiError('');
    login(data, {
      onError: (err: unknown) => {
        const e = err as { response?: { data?: { message?: string } } };
        setApiError(e.response?.data?.message || 'Login failed');
      },
    });
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12 overflow-hidden">
      <LiquidBackground variant="hero" />

      <div className="w-full max-w-md glass-card p-8 sm:p-10 rounded-3xl border border-white/[0.12] shadow-2xl relative z-10 backdrop-blur-2xl">
        <div className="text-center mb-8 flex flex-col items-center">
          <ElevareLogo size="lg" className="mb-4" />
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">Welcome Back</h1>
          <p className="text-xs text-neutral-400 mt-2 font-light">Sign in to access your saved orders & private salon</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            placeholder="name@example.com"
          />
          <Input
            label="Password"
            type="password"
            {...register('password')}
            error={errors.password?.message}
            placeholder="••••••••"
          />

          {apiError && (
            <div className="p-3.5 bg-rose-950/60 border border-rose-500/40 rounded-xl text-xs text-rose-300">
              {apiError}
            </div>
          )}

          <Button type="submit" isLoading={isPending} size="lg" className="w-full mt-2 font-bold tracking-wider uppercase text-xs">
            Sign In to Atelier
          </Button>
        </form>

        <p className="text-center text-xs text-neutral-400 mt-8">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-semibold text-white hover:text-cyan-300 underline underline-offset-4 transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
