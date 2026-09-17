import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MenuItem } from '../../types';
import { Leaf, Clock, Star, Eye, Plus, Heart } from 'lucide-react';

interface MenuCardProps {
  item: MenuItem;
  onQuickView?: (item: MenuItem) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item, onQuickView }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('gotham_favorites') || '[]');
    setIsFavorite(saved.includes(item._id));
  }, [item._id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const saved: string[] = JSON.parse(localStorage.getItem('gotham_favorites') || '[]');
    let updated: string[];
    if (saved.includes(item._id)) {
      updated = saved.filter(id => id !== item._id);
      setIsFavorite(false);
    } else {
      updated = [...saved, item._id];
      setIsFavorite(true);
    }
    localStorage.setItem('gotham_favorites', JSON.stringify(updated));
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-gray-800 hover:border-gold-500/40 transition duration-300 group flex flex-col h-full shadow-lg">
      
      {/* Image Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-dark-800">
        <img
          src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-80" />

        {/* Heart Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur-md text-gray-300 hover:text-red-500 transition z-10"
          title={isFavorite ? 'Remove from Favorites' : 'Save to Favorites'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {item.isVegetarian && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold tracking-wider uppercase backdrop-blur-md">
              <Leaf className="w-3 h-3" /> Veg
            </span>
          )}
          {item.isFeatured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold-500 text-black text-[10px] font-bold tracking-wider uppercase shadow-md">
              <Star className="w-3 h-3 fill-current" /> Chef's Choice
            </span>
          )}
        </div>

        {/* Unavailable Overlay */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-dark-900/80 backdrop-blur-sm flex items-center justify-center">
            <span className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif font-bold text-lg text-gray-100 group-hover:text-gold-400 transition line-clamp-1">
              {item.name}
            </h3>
            <span className="font-serif font-bold text-gold-400 text-lg shrink-0">
              ₹{item.price}
            </span>
          </div>

          <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Footer Meta & Action */}
        <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gold-500" />
            <span>{item.preparationTime || 20} mins</span>
          </div>

          <div className="flex items-center gap-2">
            {onQuickView && (
              <button
                onClick={() => onQuickView(item)}
                className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-gray-300 hover:text-gold-400 border border-gray-800 transition"
                title="Quick View"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}

            <Link
              to={`/menu/${item._id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-500/10 hover:bg-gold-500 text-gold-400 hover:text-black border border-gold-500/30 font-semibold transition duration-200 text-xs"
            >
              <Plus className="w-3.5 h-3.5" /> View Dish
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};
