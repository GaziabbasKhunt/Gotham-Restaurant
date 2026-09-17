import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { CartItem } from '../components/cart/CartItem';
import { OrderSummary } from '../components/cart/OrderSummary';
import { ShoppingBag, ArrowLeft, Trash2, Utensils } from 'lucide-react';

export const Cart: React.FC = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-gold-500/10 text-gold-400 flex items-center justify-center mx-auto border border-gold-500/20">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-gray-100">Your Cart is Empty</h2>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          Looks like you haven't added any dishes to your order yet. Explore our gourmet menu to get started.
        </p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gold-500 text-black font-bold text-sm gold-glow transition"
        >
          <Utensils className="w-4 h-4" /> Explore Gotham Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-100">Your Shopping Cart</h1>
          <p className="text-gray-400 text-xs mt-1">Review your selected gourmet dishes before checkout</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={clearCart}
            className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" /> Clear Cart
          </button>
          <Link
            to="/menu"
            className="px-4 py-2 rounded-xl bg-dark-800 text-gray-300 hover:text-gold-400 border border-gray-800 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Add More Dishes
          </Link>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((cartItem) => (
            <CartItem key={cartItem.item._id} cartItem={cartItem} />
          ))}
        </div>

        {/* Right: Order Summary */}
        <div>
          <OrderSummary
            subtotal={subtotal}
            onCheckout={() => navigate('/checkout')}
          />
        </div>

      </div>

    </div>
  );
};
