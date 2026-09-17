import React from 'react';
import { CartItem as CartItemType } from '../../types';
import { useCart } from '../../hooks/useCart';
import { Plus, Minus, Trash2, Leaf } from 'lucide-react';

interface CartItemProps {
  cartItem: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ cartItem }) => {
  const { updateQuantity, removeItem } = useCart();
  const { item, quantity } = cartItem;

  return (
    <div className="glass-card rounded-xl p-4 border border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
      
      {/* Thumbnail & Title */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <img
          src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'}
          alt={item.name}
          className="w-16 h-16 rounded-lg object-cover shrink-0 bg-dark-800"
        />
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-serif font-bold text-gray-100 text-base">{item.name}</h4>
            {item.isVegetarian && (
              <span className="text-emerald-400 text-xs flex items-center gap-0.5 font-semibold">
                <Leaf className="w-3 h-3" /> Veg
              </span>
            )}
          </div>
          <p className="text-gray-400 text-xs mt-0.5">₹{item.price} each</p>
        </div>
      </div>

      {/* Quantity & Price Row */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-800">
        
        {/* Quantity Controls */}
        <div className="flex items-center bg-dark-900 border border-gray-800 rounded-lg overflow-hidden">
          <button
            onClick={() => updateQuantity(item._id, quantity - 1)}
            className="p-2 text-gray-400 hover:text-gold-400 transition"
            aria-label="Decrease Quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-3 font-bold text-gray-200 text-xs">{quantity}</span>
          <button
            onClick={() => updateQuantity(item._id, quantity + 1)}
            className="p-2 text-gray-400 hover:text-gold-400 transition"
            aria-label="Increase Quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Subtotal & Delete */}
        <div className="flex items-center gap-4">
          <span className="font-serif font-bold text-gold-400 text-base min-w-[70px] text-right">
            ₹{item.price * quantity}
          </span>

          <button
            onClick={() => removeItem(item._id)}
            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
            title="Remove Item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
