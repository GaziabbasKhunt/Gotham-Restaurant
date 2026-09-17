import React, { useEffect, useState } from 'react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Loading } from '../../components/common/Loading';
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  MenuItemPayload
} from '../../services/menuService';
import { getCategories } from '../../services/categoryService';
import { MenuItem, Category } from '../../types';
import { UtensilsCrossed, Plus, Search, Edit2, Trash2, CheckCircle2, XCircle, AlertCircle, Check } from 'lucide-react';

export const AdminMenu: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<MenuItemPayload>({
    category: '',
    name: '',
    description: '',
    price: 0,
    image: '',
    ingredients: [],
    isVegetarian: false,
    isAvailable: true,
    isFeatured: false,
    isActive: true,
    preparationTime: 20
  });
  const [ingredientsText, setIngredientsText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [menuRes, catRes] = await Promise.all([
        getMenuItems({ limit: 100 }),
        getCategories(true)
      ]);

      if (menuRes.success && menuRes.data) setItems(menuRes.data);
      if (catRes.success && catRes.data) setCategories(catRes.data);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message || 'Failed to fetch menu items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      const catId = typeof item.category === 'object' ? item.category._id : item.category;
      setFormData({
        category: catId,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image || '',
        ingredients: item.ingredients || [],
        isVegetarian: item.isVegetarian,
        isAvailable: item.isAvailable,
        isFeatured: item.isFeatured,
        isActive: item.isActive,
        preparationTime: item.preparationTime || 20
      });
      setIngredientsText(item.ingredients ? item.ingredients.join(', ') : '');
    } else {
      setEditingItem(null);
      setFormData({
        category: categories.length > 0 ? categories[0]._id : '',
        name: '',
        description: '',
        price: 0,
        image: '',
        ingredients: [],
        isVegetarian: false,
        isAvailable: true,
        isFeatured: false,
        isActive: true,
        preparationTime: 20
      });
      setIngredientsText('');
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);

      const ingredientsList = ingredientsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload: MenuItemPayload = {
        ...formData,
        price: Number(formData.price),
        preparationTime: Number(formData.preparationTime),
        ingredients: ingredientsList
      };

      if (editingItem) {
        const res = await updateMenuItem(editingItem._id, payload);
        if (res.success) {
          setSuccessMsg(`Updated dish "${payload.name}"`);
        }
      } else {
        const res = await createMenuItem(payload);
        if (res.success) {
          setSuccessMsg(`Created dish "${payload.name}"`);
        }
      }

      setIsModalOpen(false);
      fetchData();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message || 'Failed to save menu item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete dish "${name}"?`)) return;
    try {
      setError(null);
      const res = await deleteMenuItem(id);
      if (res.success) {
        setSuccessMsg(`Deleted dish "${name}"`);
        fetchData();
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message || 'Failed to delete dish');
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      const updated = !item.isAvailable;
      const res = await updateMenuItem(item._id, { isAvailable: updated });
      if (res.success) {
        setItems((prev) =>
          prev.map((i) => (i._id === item._id ? { ...i, isAvailable: updated } : i))
        );
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message || 'Failed to toggle availability');
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const catId = typeof item.category === 'object' ? item.category._id : item.category;
    const matchesCat = !categoryFilter || catId === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-dark-900 pb-16">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-gray-100 flex items-center space-x-3">
              <UtensilsCrossed className="w-7 h-7 text-gold-400" />
              <span>Menu Item Catalog</span>
            </h2>
            <p className="text-sm text-gray-400">Add, edit, or toggle availability of Gotham dishes</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 bg-gold-500 hover:bg-gold-600 text-dark-900 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-lg self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Dish</span>
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

        {/* Filter Bar */}
        <div className="bg-dark-800 border border-gold-500/20 rounded-xl p-4 mb-8 shadow-lg flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gold-400"
            />
          </div>

          <div className="w-full md:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-gold-400 w-full"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <Loading message="Fetching Gotham menu items..." />
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="bg-dark-800 border border-gold-500/20 rounded-xl overflow-hidden shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 bg-dark-900">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 flex space-x-2">
                      <button
                        onClick={() => handleToggleAvailability(item)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full border shadow-md flex items-center space-x-1 ${
                          item.isAvailable
                            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50'
                            : 'bg-red-950/80 text-red-400 border-red-500/50'
                        }`}
                      >
                        {item.isAvailable ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>{item.isAvailable ? 'Available' : 'Sold Out'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif font-bold text-gray-100 text-lg">{item.name}</h3>
                      <span className="font-mono text-gold-400 font-bold text-lg">₹{item.price}</span>
                    </div>

                    <p className="text-xs text-gray-400 line-clamp-2 mb-4">{item.description}</p>

                    <div className="flex flex-wrap gap-2 text-xs text-gray-400 mb-4">
                      {item.isVegetarian && (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                          Vegetarian
                        </span>
                      )}
                      {item.isFeatured && (
                        <span className="bg-gold-500/10 text-gold-400 border border-gold-500/20 px-2 py-0.5 rounded">
                          Featured
                        </span>
                      )}
                      <span className="bg-dark-700 text-gray-300 px-2 py-0.5 rounded">
                        {typeof item.category === 'object' ? item.category.name : 'Category'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-dark-700/50 flex justify-end space-x-2">
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="p-2 text-gray-300 hover:text-gold-400 hover:bg-dark-700 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id, item.name)}
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
            No menu items found.
          </div>
        )}
      </div>

      {/* Dish Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-dark-800 border border-gold-500/30 rounded-2xl max-w-xl w-full p-6 shadow-2xl my-8">
            <h3 className="text-xl font-serif font-bold text-gray-100 mb-4">
              {editingItem ? 'Edit Dish Details' : 'Add New Gotham Dish'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Category</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-gold-400"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Image URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Ingredients (comma separated)</label>
                <input
                  type="text"
                  placeholder="Truffle oil, Wagyu beef, Aged parmesan"
                  value={ingredientsText}
                  onChange={(e) => setIngredientsText(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div className="flex space-x-6 pt-2">
                <label className="flex items-center space-x-2 text-sm text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isVegetarian}
                    onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.checked })}
                    className="rounded text-gold-500 focus:ring-gold-400 bg-dark-900 border-dark-700"
                  />
                  <span>Vegetarian</span>
                </label>

                <label className="flex items-center space-x-2 text-sm text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-gold-500 focus:ring-gold-400 bg-dark-900 border-dark-700"
                  />
                  <span>Featured Dish</span>
                </label>

                <label className="flex items-center space-x-2 text-sm text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="rounded text-gold-500 focus:ring-gold-400 bg-dark-900 border-dark-700"
                  />
                  <span>In Stock</span>
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
                  {submitting ? 'Saving...' : editingItem ? 'Update Dish' : 'Create Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
