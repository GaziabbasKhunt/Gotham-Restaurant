import React from 'react';
import { Category } from '../../types';

interface CategoryCardProps {
  category: Partial<Category> & { _id: string; name: string };
  isSelected: boolean;
  onSelect: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, isSelected, onSelect }) => {
  return (
    <button
      onClick={onSelect}
      className={`px-5 py-2.5 rounded-xl font-medium text-sm transition duration-200 shrink-0 flex items-center gap-2 ${
        isSelected
          ? 'bg-gold-500 text-black font-semibold shadow-lg shadow-gold-500/20 gold-glow'
          : 'bg-dark-800 text-gray-300 hover:text-gold-400 border border-gray-800 hover:border-gold-500/30'
      }`}
    >
      <span>{category.name}</span>
    </button>
  );
};
