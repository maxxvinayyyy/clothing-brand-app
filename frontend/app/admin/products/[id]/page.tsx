'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { useCategories } from '@/hooks/useCategories';
import { useProduct, useUpdateProduct } from '@/hooks/useProducts';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { data: product, isLoading: isProductLoading, error: productError } = useProduct(id);
  const { data: categories = [] } = useCategories();
  const updateProduct = useUpdateProduct();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [featured, setFeatured] = useState(false);
  const [images, setImages] = useState<Array<{ url: string; alt: string }>>([]);
  const [variants, setVariants] = useState<Array<{ size: string; color: string; stock: number }>>([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setSlug(product.slug || '');
      setDescription(product.description || '');
      setPrice(String(product.price || ''));
      setCategoryId(product.categoryId || '');
      setFeatured(!!product.featured);
      setImages(
        product.images?.length
          ? product.images.map((img) => ({ url: img.url, alt: img.alt || '' }))
          : [{ url: '', alt: '' }]
      );
      setVariants(
        product.variants?.length
          ? product.variants.map((v) => ({ size: v.size, color: v.color, stock: v.stock }))
          : [{ size: 'M', color: 'Black', stock: 10 }]
      );
    }
  }, [product]);

  const addImage = () => {
    setImages([...images, { url: '', alt: '' }]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addVariant = () => {
    setVariants([...variants, { size: 'M', color: 'White', stock: 10 }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      await updateProduct.mutateAsync({
        id,
        name,
        slug,
        description,
        price: parseFloat(price) || 0,
        categoryId: categoryId || (categories[0]?.id ?? ''),
        featured,
        images: images.filter((img) => img.url.trim().length > 0),
        variants: variants.map((v) => ({ ...v, stock: Number(v.stock) })),
      });
      router.push('/admin/products');
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || 'Failed to update product.');
    }
  };

  if (isProductLoading) {
    return (
      <div className="max-w-4xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="max-w-4xl p-8 bg-white border border-gray-200 rounded-xl text-center">
        <p className="text-red-500 font-medium">Product not found.</p>
        <Link href="/admin/products" className="text-sm text-gray-900 underline mt-2 inline-block">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-sm text-gray-500">Update item details, variants, or pricing.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
        {/* Basic Details */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-gray-900 pb-2 border-b border-gray-100">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Price ($)"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                required
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 rounded text-gray-900 focus:ring-gray-900 border-gray-300"
            />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700 cursor-pointer">
              Feature on Homepage
            </label>
          </div>
        </div>

        {/* Product Images */}
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Images</h2>
            <Button type="button" variant="outline" size="sm" onClick={addImage}>
              <Plus size={14} className="mr-1" /> Add Image URL
            </Button>
          </div>

          {images.map((img, idx) => (
            <div key={idx} className="flex gap-3 items-center">
              <div className="flex-1">
                <input
                  type="url"
                  placeholder="Image URL"
                  value={img.url}
                  onChange={(e) => {
                    const newImages = [...images];
                    newImages[idx].url = e.target.value;
                    setImages(newImages);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  required
                />
              </div>
              <div className="w-1/3">
                <input
                  type="text"
                  placeholder="Alt text"
                  value={img.alt}
                  onChange={(e) => {
                    const newImages = [...images];
                    newImages[idx].alt = e.target.value;
                    setImages(newImages);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="text-gray-400 hover:text-red-500 p-2"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Product Variants */}
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Variants (Sizes & Colors)</h2>
            <Button type="button" variant="outline" size="sm" onClick={addVariant}>
              <Plus size={14} className="mr-1" /> Add Variant
            </Button>
          </div>

          {variants.map((v, idx) => (
            <div key={idx} className="flex gap-3 items-center">
              <div className="w-1/3">
                <input
                  type="text"
                  placeholder="Size"
                  value={v.size}
                  onChange={(e) => {
                    const newVars = [...variants];
                    newVars[idx].size = e.target.value;
                    setVariants(newVars);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  required
                />
              </div>
              <div className="w-1/3">
                <input
                  type="text"
                  placeholder="Color"
                  value={v.color}
                  onChange={(e) => {
                    const newVars = [...variants];
                    newVars[idx].color = e.target.value;
                    setVariants(newVars);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  required
                />
              </div>
              <div className="w-1/4">
                <input
                  type="number"
                  min="0"
                  placeholder="Stock"
                  value={v.stock}
                  onChange={(e) => {
                    const newVars = [...variants];
                    newVars[idx].stock = parseInt(e.target.value) || 0;
                    setVariants(newVars);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  required
                />
              </div>
              {variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(idx)}
                  className="text-gray-400 hover:text-red-500 p-2"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Link href="/admin/products">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" isLoading={updateProduct.isPending}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
