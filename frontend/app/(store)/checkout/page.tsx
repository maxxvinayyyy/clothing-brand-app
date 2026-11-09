'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { StepIndicator } from '@/components/checkout/StepIndicator';
import { AddressForm, AddressFormValues } from '@/components/checkout/AddressForm';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';

const STEPS = ['Address', 'Shipping', 'Review'];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [address, setAddress] = useState<AddressFormValues | null>(null);
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [isPlacing, setIsPlacing] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (items.length === 0) {
        router.push('/cart');
      }
    }
  }, [mounted, isAuthenticated, items.length, router]);

  if (!mounted || !isAuthenticated || items.length === 0) {
    return null;
  }

  const shippingCost = shippingMethod === 'express' ? 19.99 : (
    items.reduce((s, i) => s + parseFloat(i.product.price.toString()) * i.quantity, 0) > 100 ? 0 : 9.99
  );

  const handleAddressSubmit = (data: AddressFormValues) => {
    setAddress(data);
    setCurrentStep(2);
  };

  const handlePlaceOrder = async () => {
    if (!address) return;
    setIsPlacing(true);
    setError('');
    try {
      const { data } = await api.post('/orders', { newAddress: address });
      clearCart();
      router.push(`/orders/${data.id}`);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Failed to place order');
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Checkout</h1>
      <StepIndicator steps={STEPS} currentStep={currentStep} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {/* Step 1: Address */}
          {currentStep === 1 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-5">Shipping Address</h2>
              <AddressForm onSubmit={handleAddressSubmit} />
            </div>
          )}

          {/* Step 2: Shipping method */}
          {currentStep === 2 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-5">Shipping Method</h2>
              <div className="space-y-3">
                {[
                  { id: 'standard', label: 'Standard Shipping', duration: '5-7 business days', price: 'Free (orders $100+) / $9.99' },
                  { id: 'express', label: 'Express Shipping', duration: '2-3 business days', price: '$19.99' },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      shippingMethod === opt.id ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value={opt.id}
                      checked={shippingMethod === opt.id as 'standard' | 'express'}
                      onChange={() => setShippingMethod(opt.id as 'standard' | 'express')}
                      className="mt-0.5"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{opt.label}</p>
                      <p className="text-sm text-gray-500">{opt.duration}</p>
                      <p className="text-sm font-medium text-gray-700">{opt.price}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="secondary" onClick={() => setCurrentStep(1)} className="flex-1">
                  Back
                </Button>
                <Button onClick={() => setCurrentStep(3)} className="flex-1">
                  Continue to Review
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && address && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-5">Review Your Order</h2>

              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Shipping Address</h3>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                    <p className="font-medium text-gray-900">{address.name}</p>
                    <p>{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
                    <p>{address.city}, {address.state} {address.zip}</p>
                    <p>{address.country}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Shipping Method</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
                    {shippingMethod === 'express' ? 'Express Shipping (2-3 days)' : 'Standard Shipping (5-7 days)'} — {formatPrice(shippingCost)}
                  </p>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <Button variant="secondary" onClick={() => setCurrentStep(2)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handlePlaceOrder} isLoading={isPlacing} className="flex-1">
                  Place Order
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-1">
          <OrderSummary items={items} shipping={shippingCost} />
        </div>
      </div>
    </div>
  );
}
