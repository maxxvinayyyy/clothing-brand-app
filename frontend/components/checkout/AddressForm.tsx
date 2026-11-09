'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const addressSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  line1: z.string().min(5, 'Address line 1 is required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zip: z.string().min(4, 'ZIP code is required'),
  country: z.string().min(2, 'Country is required'),
});

export type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressFormProps {
  onSubmit: (data: AddressFormValues) => void;
  isLoading?: boolean;
}

export function AddressForm({ onSubmit, isLoading }: AddressFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: 'US' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Full Name"
        {...register('name')}
        error={errors.name?.message}
        placeholder="John Doe"
      />
      <Input
        label="Address Line 1"
        {...register('line1')}
        error={errors.line1?.message}
        placeholder="123 Main Street"
      />
      <Input
        label="Address Line 2 (optional)"
        {...register('line2')}
        placeholder="Apt 4B"
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="City"
          {...register('city')}
          error={errors.city?.message}
          placeholder="New York"
        />
        <Input
          label="State"
          {...register('state')}
          error={errors.state?.message}
          placeholder="NY"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="ZIP Code"
          {...register('zip')}
          error={errors.zip?.message}
          placeholder="10001"
        />
        <Input
          label="Country"
          {...register('country')}
          error={errors.country?.message}
          placeholder="US"
        />
      </div>
      <Button type="submit" isLoading={isLoading} size="lg" className="w-full mt-2">
        Continue to Shipping
      </Button>
    </form>
  );
}
