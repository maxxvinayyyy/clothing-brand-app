'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/useCategories';
import { Category } from '@/lib/types';

export default function AdminCategoriesPage() {
  const { data: categories = [], isLoading, error } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [formError, setFormError] = useState('');

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({ id: editingCategory.id, name, slug });
      } else {
        await createCategory.mutateAsync({ name, slug });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err?.response?.data?.message || 'Action failed. Ensure slug is unique.');
    }
  };

  const handleDelete = async (id: string, productCount: number = 0) => {
    if (productCount > 0) {
      alert('Cannot delete a category with existing products.');
      return;
    }
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await deleteCategory.mutateAsync(id);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete category.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Organize your clothing catalog into collections.</p>
        </div>
        <Button onClick={openCreateModal} size="sm">
          <Plus size={16} className="mr-1.5" /> Add Category
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-white rounded-xl border border-gray-200">
          <p className="text-red-500 font-medium">Failed to load categories.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Products</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 font-medium text-gray-900 flex items-center gap-2.5">
                    <div className="p-1.5 bg-gray-100 rounded-md text-gray-600">
                      <Tag size={16} />
                    </div>
                    {category.name}
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-gray-500">/{category.slug}</td>
                  <td className="px-5 py-4 text-gray-600">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {category._count?.products || 0} items
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(category)}>
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(category.id, category._count?.products)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {categories.length === 0 && (
            <div className="text-center py-12 text-gray-500">No categories found. Create your first category above.</div>
          )}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs">
              {formError}
            </div>
          )}

          <Input
            label="Category Name"
            placeholder="e.g. Outerwear"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
          />

          <Input
            label="Slug"
            placeholder="e.g. outerwear"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={createCategory.isPending || updateCategory.isPending}
            >
              {editingCategory ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
