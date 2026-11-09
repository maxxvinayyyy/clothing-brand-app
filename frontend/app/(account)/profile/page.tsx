'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';

export default function ProfilePage() {
  const { user, setAuth, accessToken, refreshToken } = useAuthStore();
  const router = useRouter();
  const [name, setName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.push('/login');
    }
  }, [mounted, user, router]);

  if (!mounted || !user) {
    return null;
  }

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    try {
      const { data } = await api.put('/auth/profile', { name });
      if (user && accessToken && refreshToken) {
        setAuth({ ...user, name: data.name }, accessToken, refreshToken);
      }
      setMessage('Profile updated successfully!');
    } catch {
      setMessage('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
          <div className="h-16 w-16 rounded-full bg-gray-900 text-white flex items-center justify-center text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 mt-1">
              {user.role}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Email</label>
            <input
              value={user.email}
              disabled
              className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-sm text-gray-500 bg-gray-50"
            />
          </div>
        </div>

        {message && (
          <p className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-500'}`}>
            {message}
          </p>
        )}

        <Button onClick={handleSave} isLoading={isSaving}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
