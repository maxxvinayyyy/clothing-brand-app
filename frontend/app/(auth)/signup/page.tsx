'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LiquidBackground } from '@/components/ui/LiquidBackground';
import { useSignup } from '@/hooks/useAuth';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type SignupValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { mutate: signup, isPending } = useSignup();
  const [apiError, setApiError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = ({ name, email, password }: SignupValues) => {
    setApiError('');
    signup({ name, email, password }, {
      onError: (err: unknown) => {
        const e = err as { response?: { data?: { message?: string } } };
        setApiError(e.response?.data?.message || 'Registration failed');
      },
    });
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12 overflow-hidden">
      <LiquidBackground variant="hero" />

      <div className="w-full max-w-md glass-card p-8 sm:p-10 rounded-3xl border border-white/[0.12] shadow-2xl relative z-10 backdrop-blur-2xl">
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase tracking-[0.25em] text-cyan-400 font-bold block mb-2">
            JOIN ELEVARE ATELIER
          </span>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Create Account</h1>
          <p className="text-xs text-neutral-400 mt-2 font-light">Experience tailored luxury, saved bags & early access</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            {...register('name')}
            error={errors.name?.message}
            placeholder="John Doe"
          />
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
            placeholder="Minimum 8 characters"
          />
          <Input
            label="Confirm Password"
            type="password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
            placeholder="Repeat password"
          />

          {apiError && (
            <div className="p-3.5 bg-rose-950/60 border border-rose-500/40 rounded-xl text-xs text-rose-300">
              {apiError}
            </div>
          )}

          <Button type="submit" isLoading={isPending} size="lg" className="w-full mt-2 font-bold tracking-wider uppercase text-xs">
            Create Atelier Account
          </Button>
        </form>

        <p className="text-center text-xs text-neutral-400 mt-8">
          Already registered?{' '}
          <Link href="/login" className="font-semibold text-white hover:text-cyan-300 underline underline-offset-4 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
