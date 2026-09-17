import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../services/orderService';
import { Order } from '../types';
import { Loading } from '../components/common/Loading';
import { ErrorComponent } from '../components/common/ErrorComponent';
import { CheckCircle2, ShoppingBag, ArrowRight, Clock, MapPin, Receipt } from 'lucide-react';

export const OrderSuccess: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await getOrderById(id);
        if (res.data) setOrder(res.data);
      } catch (err) {
        setError((err as Error).message || 'Failed to retrieve order confirmation details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <Loading message="Fetching your order confirmation..." fullScreen />;
  if (error || !order) {
    return (
      <div className="py-16">
        <ErrorComponent title="Order Confirmation Error" message={error || 'Unable to locate order'} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      
      {/* Success Card */}
      <div className="glass-card rounded-2xl p-8 border border-gold-500/30 text-center space-y-4 shadow-2xl relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h1 className="text-3xl font-serif font-bold text-gray-100">Order Placed Successfully!</h1>
        
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          Thank you for dining with Gotham Restaurant. Your order has been registered and is being processed by our kitchen.
        </p>

        <div className="inline-block px-4 py-2 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 font-serif font-bold text-lg tracking-wider">
          Order Number: {order.orderNumber}
        </div>
      </div>

      {/* Order Breakdown Details */}
      <div className="glass-card rounded-2xl p-6 border border-gray-800 space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-gray-800 gap-2">
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Order Fulfillment</span>
            <p className="text-sm font-bold text-gray-200 uppercase mt-0.5">{order.orderType}</p>
          </div>

          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Payment Status</span>
            <p className="text-sm font-bold text-emerald-400 uppercase mt-0.5">
              {order.paymentMethod} ({order.paymentStatus})
            </p>
          </div>

          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Status</span>
            <span className="inline-block px-3 py-1 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/30 text-xs font-bold uppercase mt-0.5">
              {order.orderStatus}
            </span>
          </div>
        </div>

        {/* Itemized List */}
        <div className="space-y-3">
          <h3 className="font-serif font-bold text-base text-gray-200 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-gold-500" /> Item Snapshot Breakdown
          </h3>

          <div className="divide-y divide-gray-800/60">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-2.5 flex justify-between items-center text-sm">
                <div>
                  <p className="font-semibold text-gray-200">{item.name}</p>
                  <p className="text-xs text-gray-500">₹{item.price} × {item.quantity}</p>
                </div>
                <span className="font-serif font-bold text-gold-400">₹{item.subtotal}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="pt-4 border-t border-gray-800 space-y-2 text-sm text-gray-400">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{order.subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (5%)</span>
            <span>₹{order.tax}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>₹{order.deliveryCharge}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-800 text-base font-bold text-gray-100">
            <span>Total Amount Paid</span>
            <span className="font-serif text-xl text-gold-gradient">₹{order.totalAmount}</span>
          </div>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/my-orders"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gold-500 text-black font-bold text-sm gold-glow transition flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" /> View My Orders
        </Link>
        <Link
          to="/menu"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-dark-800 text-gray-300 hover:text-gold-400 border border-gray-800 text-sm font-semibold transition flex items-center justify-center gap-2"
        >
          Explore Menu <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};
