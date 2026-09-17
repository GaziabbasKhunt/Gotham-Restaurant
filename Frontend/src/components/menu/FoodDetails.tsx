import React from 'react';
import { MenuItem } from '../../types';
import { X, Leaf, Clock, Star, CheckCircle, ShoppingBag } from 'lucide-react';

interface FoodDetailsProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart?: (item: MenuItem, quantity: number) => void;
}

export const FoodDetails: React.FC<FoodDetailsProps> = ({ item, onClose, onAddToCart }) => {
  if (!item) return null;

  const categoryName = typeof item.category === 'object' ? item.category?.name : 'Gotham Gourmet';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-md animate-fade-in">
      <div className="glass-card max-w-2xl w-full rounded-2xl overflow-hidden border border-gold-500/20 shadow-2xl relative max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-dark-900/80 hover:bg-gold-500 text-gray-300 hover:text-black transition"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Dish Banner Image */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-dark-800 shrink-0">
          <img
            src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/30 to-transparent" />
          
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <span className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/30 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
              {categoryName}
            </span>
            <span className="text-3xl font-serif font-bold text-gold-gradient">
              ₹{item.price}
            </span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-100">{item.name}</h2>
              {item.isVegetarian && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                  <Leaf className="w-3.5 h-3.5" /> Veg
                </span>
              )}
            </div>

            <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
          </div>

          {/* Details Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-800">
            <div className="bg-dark-900/60 p-3 rounded-xl border border-gray-800 text-center">
              <p className="text-xs text-gray-500 font-medium">Preparation</p>
              <p className="text-sm font-bold text-gray-200 flex items-center justify-center gap-1 mt-1">
                <Clock className="w-4 h-4 text-gold-500" /> {item.preparationTime || 20} mins
              </p>
            </div>

            <div className="bg-dark-900/60 p-3 rounded-xl border border-gray-800 text-center">
              <p className="text-xs text-gray-500 font-medium">Availability</p>
              <p className={`text-sm font-bold mt-1 ${item.isAvailable ? 'text-emerald-400' : 'text-red-400'}`}>
                {item.isAvailable ? 'In Stock' : 'Unavailable'}
              </p>
            </div>

            <div className="bg-dark-900/60 p-3 rounded-xl border border-gray-800 text-center col-span-2 sm:col-span-1">
              <p className="text-xs text-gray-500 font-medium">Special Badge</p>
              <p className="text-sm font-bold text-gold-400 flex items-center justify-center gap-1 mt-1">
                <Star className="w-4 h-4 fill-current" /> {item.isFeatured ? 'Chef Choice' : 'Standard'}
              </p>
            </div>
          </div>

          {/* Ingredients List */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Key Ingredients</h4>
              <div className="flex flex-wrap gap-2">
                {item.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-dark-800 text-gray-300 text-xs border border-gray-800"
                  >
                    <CheckCircle className="w-3 h-3 text-gold-500" /> {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart CTA */}
          <div className="pt-4 border-t border-gray-800 flex items-center justify-between gap-4">
            <button
              onClick={() => {
                if (onAddToCart) onAddToCart(item, 1);
                onClose();
              }}
              disabled={!item.isAvailable}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold hover:brightness-110 transition duration-200 gold-glow shadow-xl flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              <ShoppingBag className="w-5 h-5" /> Add to Order — ₹{item.price}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
