import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { createOrder } from '../services/orderService';
import { OrderType, PaymentMethod } from '../types';
import { OrderSummary } from '../components/cart/OrderSummary';
import { Truck, Store, UtensilsCrossed, CreditCard, Banknote, MapPin, AlertCircle, CheckCircle } from 'lucide-react';

export const Checkout: React.FC = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  
  // Address state
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [state, setState] = useState(user?.address?.state || '');
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || '');

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-gray-100">No Items to Checkout</h2>
        <p className="text-gray-400 text-sm">Please add items to your cart before proceeding.</p>
        <Link to="/menu" className="inline-block px-5 py-2.5 rounded-xl bg-gold-500 text-black font-bold text-xs">
          Return to Menu
        </Link>
      </div>
    );
  }

  // Promo & Loyalty state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);

  const [usePoints, setUsePoints] = useState(false);
  const pointsAvailable = user?.loyaltyPoints || 0;
  // Redeem in blocks of 100 points = $1 discount
  const pointsDiscount = usePoints ? Math.floor(pointsAvailable / 100) : 0;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = couponInput.trim().toUpperCase();
    if (clean === 'GOTHAM10') {
      const disc = Math.round(subtotal * 0.10);
      setCouponDiscount(disc);
      setAppliedCoupon('GOTHAM10 (10% Off)');
      setError(null);
    } else if (clean === 'DARKNIGHT20') {
      const disc = Math.round(subtotal * 0.20);
      setCouponDiscount(disc);
      setAppliedCoupon('DARKNIGHT20 (20% Off)');
      setError(null);
    } else {
      setError('Invalid coupon code. Try "GOTHAM10" or "DARKNIGHT20"');
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (orderType === 'delivery' && (!street || !city)) {
      setError('Please provide a complete street address and city for delivery.');
      return;
    }

    try {
      setSubmitting(true);

      const orderPayload = {
        items: items.map((i) => ({
          menuItem: i.item._id,
          quantity: i.quantity
        })),
        orderType,
        paymentMethod,
        couponCode: appliedCoupon ? couponInput : undefined,
        pointsRedeemed: usePoints ? Math.min(pointsAvailable, pointsDiscount * 100) : 0,
        deliveryAddress: orderType === 'delivery' ? { street, city, state, postalCode, country: 'USA' } : undefined
      };

      const res = await createOrder(orderPayload);
      if (res.data?._id) {
        clearCart();
        navigate(`/order-success/${res.data._id}`);
      }
    } catch (err) {
      setError((err as Error).message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const totalDiscount = couponDiscount + pointsDiscount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="border-b border-gray-800 pb-4">
        <h1 className="text-3xl font-serif font-bold text-gray-100">Order Checkout</h1>
        <p className="text-gray-400 text-xs mt-1">Select fulfillment option, address, discounts & payment method</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3 text-red-400 text-sm max-w-3xl">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid */}
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Fulfillment & Address & Payment & Promo */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Order Type Selector */}
          <div className="glass-card rounded-2xl p-6 border border-gray-800 space-y-4">
            <h3 className="font-serif font-bold text-lg text-gray-100">1. Fulfillment Method</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 text-center transition ${
                  orderType === 'delivery'
                    ? 'bg-gold-500/10 text-gold-400 border-gold-500/50 font-bold'
                    : 'bg-dark-900/60 text-gray-400 border-gray-800 hover:text-gray-200'
                }`}
              >
                <Truck className="w-6 h-6" />
                <span className="text-sm">Home Delivery</span>
                <span className="text-[10px] text-gray-500">Flat ₹50 Fee</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 text-center transition ${
                  orderType === 'pickup'
                    ? 'bg-gold-500/10 text-gold-400 border-gold-500/50 font-bold'
                    : 'bg-dark-900/60 text-gray-400 border-gray-800 hover:text-gray-200'
                }`}
              >
                <Store className="w-6 h-6" />
                <span className="text-sm">Takeaway Pickup</span>
                <span className="text-[10px] text-gray-500">Free</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('dine_in')}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 text-center transition ${
                  orderType === 'dine_in'
                    ? 'bg-gold-500/10 text-gold-400 border-gold-500/50 font-bold'
                    : 'bg-dark-900/60 text-gray-400 border-gray-800 hover:text-gray-200'
                }`}
              >
                <UtensilsCrossed className="w-6 h-6" />
                <span className="text-sm">Dine-in Order</span>
                <span className="text-[10px] text-gray-500">Serve at Table</span>
              </button>

            </div>
          </div>

          {/* Delivery Address (If delivery) */}
          {orderType === 'delivery' && (
            <div className="glass-card rounded-2xl p-6 border border-gray-800 space-y-4">
              <h3 className="font-serif font-bold text-lg text-gray-100 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gold-500" /> 2. Delivery Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="100 Wayne Manor Blvd"
                    className="w-full px-4 py-3 bg-dark-900/80 border border-gray-800 rounded-xl text-gray-100 focus:outline-none focus:border-gold-500 text-sm transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Gotham City"
                    className="w-full px-4 py-3 bg-dark-900/80 border border-gray-800 rounded-xl text-gray-100 focus:outline-none focus:border-gold-500 text-sm transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    State / Zip Code
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="NY 10001"
                    className="w-full px-4 py-3 bg-dark-900/80 border border-gray-800 rounded-xl text-gray-100 focus:outline-none focus:border-gold-500 text-sm transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Promo Coupons & Gotham VIP Loyalty Points Redemption */}
          <div className="glass-card rounded-2xl p-6 border border-gold-500/20 bg-dark-900/50 space-y-4">
            <h3 className="font-serif font-bold text-lg text-gold-400 flex items-center gap-2">
              🎁 Gotham VIP Rewards & Coupons
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Promo Coupon Form */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-300">Promo Coupon Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="e.g. GOTHAM10"
                    className="w-full px-3 py-2 bg-dark-950 border border-gray-800 rounded-xl text-xs text-gray-100 uppercase focus:border-gold-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-gold-500/20 text-gold-400 border border-gold-500/40 rounded-xl text-xs font-bold hover:bg-gold-500 hover:text-black transition"
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    ✓ Applied {appliedCoupon}
                  </p>
                )}
                <p className="text-[10px] text-gray-500">Available: GOTHAM10 (10% Off), DARKNIGHT20 (20% Off)</p>
              </div>

              {/* Points Redemption */}
              <div className="bg-dark-950 p-4 rounded-xl border border-gold-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-200">Gotham Bat-Coins</span>
                  <span className="text-xs text-gold-400 font-bold">{pointsAvailable} Pts</span>
                </div>
                <p className="text-[10px] text-gray-400">100 Pts = ₹1 Instant Checkout Discount</p>

                {pointsAvailable >= 100 ? (
                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={usePoints}
                      onChange={(e) => setUsePoints(e.target.checked)}
                      className="w-4 h-4 accent-gold-500 rounded"
                    />
                    <span className="text-xs text-gold-300 font-semibold">
                      Redeem {Math.floor(pointsAvailable / 100) * 100} pts (-₹{pointsDiscount})
                    </span>
                  </label>
                ) : (
                  <p className="text-[10px] text-gray-500">Need at least 100 pts to redeem.</p>
                )}
              </div>

            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="glass-card rounded-2xl p-6 border border-gray-800 space-y-4">
            <h3 className="font-serif font-bold text-lg text-gray-100">
              {orderType === 'delivery' ? '3.' : '2.'} Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-4 rounded-xl border flex items-center gap-3 transition ${
                  paymentMethod === 'cash'
                    ? 'bg-gold-500/10 text-gold-400 border-gold-500/50 font-bold'
                    : 'bg-dark-900/60 text-gray-400 border-gray-800 hover:text-gray-200'
                }`}
              >
                <Banknote className="w-6 h-6 text-emerald-400" />
                <div className="text-left">
                  <p className="text-sm font-semibold">Cash on Delivery / Pickup</p>
                  <p className="text-[10px] text-gray-500">Pay when receiving order</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('online')}
                className={`p-4 rounded-xl border flex items-center gap-3 transition ${
                  paymentMethod === 'online'
                    ? 'bg-gold-500/10 text-gold-400 border-gold-500/50 font-bold'
                    : 'bg-dark-900/60 text-gray-400 border-gray-800 hover:text-gray-200'
                }`}
              >
                <CreditCard className="w-6 h-6 text-gold-400" />
                <div className="text-left">
                  <p className="text-sm font-semibold">Online Card / UPI (Instant)</p>
                  <p className="text-[10px] text-gray-500">Instant verification & mark paid</p>
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary */}
        <div>
          <OrderSummary
            subtotal={subtotal - totalDiscount}
            orderType={orderType}
            showCheckoutButton={false}
          />

          {totalDiscount > 0 && (
            <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs text-emerald-400 font-bold">
              <span>Total Rewards Discount Applied:</span>
              <span>-₹{totalDiscount}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-4 py-4 px-6 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold hover:brightness-110 transition duration-200 gold-glow shadow-xl text-base disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <span>Verifying & Placing Order...</span>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" /> Confirm & Place Order
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
