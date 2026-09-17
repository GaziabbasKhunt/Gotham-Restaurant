import React, { useEffect, useState } from 'react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Loading } from '../../components/common/Loading';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  CategoryPayload
} from '../../services/categoryService';
import { Category } from '../../types';
import { Layers, Plus, Edit2, Trash2, CheckCircle2, XCircle, AlertCircle, Check } from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryPayload>({
    name: '',
    description: '',
    image: '',
    isActive: true
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getCategories(true);
      if (res.success && res.data) {
        setCategories(res.data);
      } else {
        setError(res.message || 'Failed to fetch categories');
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message || 'Error loading categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        image: category.image || '',
        isActive: category.isActive
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        image: '',
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);

      if (editingCategory) {
        const res = await updateCategory(editingCategory._id, formData);
        if (res.success) setSuccessMsg(`Updated category "${formData.name}"`);
      } else {
        const res = await createCategory(formData);
        if (res.success) setSuccessMsg(`Created category "${formData.name}"`);
      }

      setIsModalOpen(false);
      fetchCategories();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      setError(null);
      const res = await deleteCategory(id);
      if (res.success) {
        setSuccessMsg(`Deleted category "${name}"`);
        fetchCategories();
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleToggleActive = async (category: Category) => {
    try {
      const updated = !category.isActive;
      const res = await updateCategory(category._id, { isActive: updated });
      if (res.success) {
        setCategories((prev) =>
          prev.map((c) => (c._id === category._id ? { ...c, isActive: updated } : c))
        );
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message || 'Failed to update category status');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 pb-16">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-gray-100 flex items-center space-x-3">
              <Layers className="w-7 h-7 text-gold-400" />
              <span>Category Management</span>
            </h2>
            <p className="text-sm text-gray-400">Organize dishes into culinary classifications</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 bg-gold-500 hover:bg-gold-600 text-dark-900 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-lg self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Category</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 flex items-center space-x-2 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 flex items-center space-x-2 text-sm">
            <Check className="w-5 h-5 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {loading ? (
          <Loading message="Loading category architecture..." />
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="bg-dark-800 border border-gold-500/20 rounded-xl overflow-hidden shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-36 bg-dark-900">
                    <img
                      src={cat.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => handleToggleActive(cat)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full border shadow-md flex items-center space-x-1 ${
                          cat.isActive
                            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50'
                            : 'bg-red-950/80 text-red-400 border-red-500/50'
                        }`}
                      >
                        {cat.isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>{cat.isActive ? 'Active' : 'Inactive'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-serif font-bold text-gray-100 text-lg mb-2">{cat.name}</h3>
                    <p className="text-xs text-gray-400 line-clamp-3">{cat.description || 'No description set.'}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-dark-700/50 flex justify-end space-x-2">
                  <button
                    onClick={() => handleOpenModal(cat)}
                    className="p-2 text-gray-300 hover:text-gold-400 hover:bg-dark-700 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id, cat.name)}
                    className="p-2 text-gray-300 hover:text-red-400 hover:bg-dark-700 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-dark-800 border border-gold-500/20 rounded-xl text-gray-400">
            No categories defined yet.
          </div>
        )}
      </div>

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-dark-800 border border-gold-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-xl font-serif font-bold text-gray-100 mb-4">
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Banner Image URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-2 text-sm text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded text-gold-500 focus:ring-gold-400 bg-dark-900 border-dark-700"
                  />
                  <span>Active Category</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-dark-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-sm font-bold bg-gold-500 hover:bg-gold-600 text-dark-900 rounded-xl transition-colors shadow-lg disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
