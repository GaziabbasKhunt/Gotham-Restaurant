import React from 'react';
import { OrderType } from '../../types';
import { ShieldCheck, Receipt } from 'lucide-react';

interface OrderSummaryProps {
  subtotal: number;
  orderType?: OrderType;
  showCheckoutButton?: boolean;
  onCheckout?: () => void;
  submitting?: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  orderType = 'delivery',
  showCheckoutButton = true,
  onCheckout,
  submitting = false
}) => {
  const tax = Math.round(subtotal * 0.05);
  const deliveryCharge = orderType === 'delivery' && subtotal > 0 ? 50 : 0;
  const totalAmount = subtotal + tax + deliveryCharge;

  return (
    <div className="glass-card rounded-2xl p-6 border border-gold-500/20 space-y-5">
      <h3 className="font-serif font-bold text-xl text-gray-100 flex items-center gap-2 pb-3 border-b border-gray-800">
        <Receipt className="w-5 h-5 text-gold-500" /> Order Summary
      </h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-400">
          <span>Items Subtotal</span>
          <span className="font-semibold text-gray-200">₹{subtotal}</span>
        </div>

        <div className="flex justify-between text-gray-400">
          <span>GST Tax (5%)</span>
          <span className="font-semibold text-gray-200">₹{tax}</span>
        </div>

        <div className="flex justify-between text-gray-400">
          <span>Delivery Fee</span>
          <span className="font-semibold text-gray-200">
            {orderType === 'delivery' ? `₹${deliveryCharge}` : 'Free (Pickup / Dine-in)'}
          </span>
        </div>

        <div className="pt-3 border-t border-gray-800 flex justify-between items-center">
          <span className="font-serif font-bold text-lg text-gray-100">Total Amount</span>
          <span className="font-serif font-bold text-2xl text-gold-gradient">
            ₹{totalAmount}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-400 bg-dark-900/60 p-3 rounded-xl border border-gray-800">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>Price verified directly by Gotham Restaurant Server</span>
      </div>

      {showCheckoutButton && onCheckout && (
        <button
          onClick={onCheckout}
          disabled={subtotal === 0 || submitting}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold hover:brightness-110 transition duration-200 gold-glow shadow-xl text-sm disabled:opacity-50"
        >
          {submitting ? 'Processing Order...' : 'Proceed to Checkout'}
        </button>
      )}
    </div>
  );
};
