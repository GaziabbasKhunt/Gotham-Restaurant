import React, { useEffect, useState } from 'react';
import { getCategories } from '../services/categoryService';
import { getMenuItems } from '../services/menuService';
import { Category, MenuItem } from '../types';
import { MenuCard } from '../components/menu/MenuCard';
import { CategoryCard } from '../components/menu/CategoryCard';
import { FoodDetails } from '../components/menu/FoodDetails';
import { Loading } from '../components/common/Loading';
import { ErrorComponent } from '../components/common/ErrorComponent';
import { Search, Leaf, Sparkles, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

export const Menu: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [search, setSearch] = useState<string>('');
  const [vegetarianOnly, setVegetarianOnly] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Quick view item modal
  const [quickViewItem, setQuickViewItem] = useState<MenuItem | null>(null);

  // Load categories on mount
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        if (res.data) setCategories(res.data);
      } catch (err) {
        console.warn('Failed to load categories:', err);
      }
    };
    fetchCats();
  }, []);

  // Fetch menu items when filters or page changes
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getMenuItems({
          category: selectedCategory === 'all' ? undefined : selectedCategory,
          search: search.trim() || undefined,
          vegetarian: vegetarianOnly ? true : undefined,
          page,
          limit: 9
        });

        if (res.data) {
          setItems(res.data);
          if (res.meta?.totalPages) {
            setTotalPages(res.meta.totalPages as number);
          }
        }
      } catch (err) {
        setError((err as Error).message || 'Failed to fetch menu items');
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [selectedCategory, search, vegetarianOnly, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" /> Culinary Perfection
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-100">
          Our Gourmet <span className="text-gold-gradient">Menu</span>
        </h1>
        <p className="text-gray-400 text-base font-light leading-relaxed">
          Explore artisanal dishes crafted with seasonal ingredients and culinary expertise.
        </p>
      </div>

      {/* Filter Toolbar & Search Bar */}
      <div className="glass-card rounded-2xl p-6 border border-gold-500/20 space-y-6">
        
        {/* Search Bar & Veg Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search dishes or ingredients..."
              className="w-full pl-11 pr-4 py-3 bg-dark-900/80 border border-gray-800 rounded-xl text-gray-100 focus:outline-none focus:border-gold-500 text-sm transition"
            />
          </div>

          {/* Vegetarian Filter Toggle */}
          <button
            onClick={() => {
              setVegetarianOnly(!vegetarianOnly);
              setPage(1);
            }}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-semibold transition ${
              vegetarianOnly
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                : 'bg-dark-900/80 text-gray-400 border-gray-800 hover:text-emerald-400 hover:border-emerald-500/30'
            }`}
          >
            <Leaf className="w-4 h-4" />
            <span>Pure Vegetarian Only</span>
          </button>

        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          <CategoryCard
            category={{ _id: 'all', name: 'All Categories' }}
            isSelected={selectedCategory === 'all'}
            onSelect={() => {
              setSelectedCategory('all');
              setPage(1);
            }}
          />
          {categories.map((cat) => (
            <CategoryCard
              key={cat._id}
              category={cat}
              isSelected={selectedCategory === cat._id}
              onSelect={() => {
                setSelectedCategory(cat._id);
                setPage(1);
              }}
            />
          ))}
        </div>

      </div>

      {/* Main Grid Content */}
      {loading ? (
        <Loading message="Fetching gourmet dishes from kitchen..." />
      ) : error ? (
        <ErrorComponent
          title="Failed to Load Menu"
          message={error}
          onRetry={() => setPage(1)}
        />
      ) : items.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center max-w-lg mx-auto border border-gray-800 space-y-4">
          <div className="w-14 h-14 rounded-full bg-gold-500/10 text-gold-400 flex items-center justify-center mx-auto">
            <SlidersHorizontal className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-xl font-bold text-gray-200">No Dishes Found</h3>
          <p className="text-gray-400 text-sm">
            No items matched your filter criteria. Try clearing search keywords or selecting another category.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('all');
              setVegetarianOnly(false);
              setPage(1);
            }}
            className="px-5 py-2.5 rounded-xl bg-gold-500 text-black font-bold text-xs uppercase tracking-wider gold-glow"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((dish) => (
            <MenuCard
              key={dish._id}
              item={dish}
              onQuickView={(item) => setQuickViewItem(item)}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-3 rounded-xl bg-dark-800 text-gray-300 hover:text-gold-400 border border-gray-800 disabled:opacity-40 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium text-gray-400">
            Page <strong className="text-gold-400">{page}</strong> of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-3 rounded-xl bg-dark-800 text-gray-300 hover:text-gold-400 border border-gray-800 disabled:opacity-40 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Quick View Modal */}
      <FoodDetails
        item={quickViewItem}
        onClose={() => setQuickViewItem(null)}
      />

    </div>
  );
};
