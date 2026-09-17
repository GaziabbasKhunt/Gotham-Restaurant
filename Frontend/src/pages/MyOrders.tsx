import React, { useEffect, useState } from 'react';
import { getMyOrders, cancelOrder } from '../services/orderService';
import { Order, OrderStatus } from '../types';
import { Loading } from '../components/common/Loading';
import { ErrorComponent } from '../components/common/ErrorComponent';
import { ShoppingBag, Clock, XCircle, AlertCircle, ChevronRight, Receipt } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getMyOrders();
      if (res.data) setOrders(res.data);
    } catch (err) {
      setError((err as Error).message || 'Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      setCancellingId(orderId);
      await cancelOrder(orderId);
      await fetchOrders(); // Refresh orders list
    } catch (err) {
      alert((err as Error).message || 'Failed to cancel order');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    const styles: Record<OrderStatus, string> = {
      pending: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      preparing: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      ready: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      out_for_delivery: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      delivered: 'bg-green-500/10 text-green-400 border-green-500/30',
      cancelled: 'bg-red-500/10 text-red-400 border-red-500/30'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${styles[status] || 'bg-gray-800 text-gray-300'}`}>
        {status.replace(/_/g, ' ')}
      </span>
    );
  };

  if (loading) return <Loading message="Loading your order history..." />;
  if (error) return <ErrorComponent title="Order History Error" message={error} onRetry={fetchOrders} />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="border-b border-gray-800 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-100">My Orders</h1>
          <p className="text-gray-400 text-xs mt-1">Track your past & live restaurant orders</p>
        </div>
        <Link to="/menu" className="text-xs text-gold-400 font-semibold hover:underline">
          + Place New Order
        </Link>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center max-w-lg mx-auto border border-gray-800 space-y-4">
          <div className="w-14 h-14 rounded-full bg-gold-500/10 text-gold-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-xl font-bold text-gray-200">No Orders Found</h3>
          <p className="text-gray-400 text-sm">
            You haven't placed any food orders yet. Browse our menu to try our signature dishes!
          </p>
          <Link
            to="/menu"
            className="inline-block px-5 py-2.5 rounded-xl bg-gold-500 text-black font-bold text-xs uppercase tracking-wider gold-glow"
          >
            Explore Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="glass-card rounded-2xl p-6 border border-gray-800 space-y-4 hover:border-gold-500/30 transition">
              
              {/* Top Summary Bar */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-gray-800 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-serif font-bold text-lg text-gold-400">{order.orderNumber}</span>
                    {getStatusBadge(order.orderStatus)}
                  </div>
                  <p className="text-xs text-gray-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-500" />
                    Placed on {new Date(order.createdAt).toLocaleString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Total Amount</p>
                  <p className="font-serif font-bold text-xl text-gold-gradient">₹{order.totalAmount}</p>
                </div>
              </div>

              {/* Live Order Tracker Timeline for Active Orders */}
              {order.orderStatus !== 'cancelled' && (
                <div className="bg-dark-950/80 rounded-xl p-4 border border-gold-500/20 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-gold-400">
                    <span className="flex items-center gap-1.5 uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5 animate-spin text-gold-500" /> Live Kitchen & Delivery Tracker
                    </span>
                    <span className="text-[10px] text-gray-400">
                      Est. Time: {order.orderStatus === 'delivered' ? 'Completed' : '15-25 Mins'}
                    </span>
                  </div>

                  {/* 4 Step Progress Bar */}
                  <div className="grid grid-cols-4 gap-2 pt-1 text-center relative">
                    {/* Step 1: Received */}
                    <div className="space-y-1">
                      <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition ${
                        ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'].includes(order.orderStatus)
                          ? 'bg-gold-500 text-black shadow-md shadow-gold-500/30'
                          : 'bg-dark-800 text-gray-600'
                      }`}>1</div>
                      <p className="text-[10px] font-semibold text-gray-300">Received</p>
                    </div>

                    {/* Step 2: Preparing */}
                    <div className="space-y-1">
                      <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition ${
                        ['confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'].includes(order.orderStatus)
                          ? 'bg-gold-500 text-black shadow-md shadow-gold-500/30 animate-pulse'
                          : 'bg-dark-800 text-gray-600'
                      }`}>2</div>
                      <p className="text-[10px] font-semibold text-gray-300">Kitchen Prep</p>
                    </div>

                    {/* Step 3: Out For Delivery / Ready */}
                    <div className="space-y-1">
                      <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition ${
                        ['ready', 'out_for_delivery', 'delivered'].includes(order.orderStatus)
                          ? 'bg-gold-500 text-black shadow-md shadow-gold-500/30'
                          : 'bg-dark-800 text-gray-600'
                      }`}>3</div>
                      <p className="text-[10px] font-semibold text-gray-300">{order.orderType === 'delivery' ? 'Dispatched' : 'Ready'}</p>
                    </div>

                    {/* Step 4: Delivered */}
                    <div className="space-y-1">
                      <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition ${
                        order.orderStatus === 'delivered'
                          ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30'
                          : 'bg-dark-800 text-gray-600'
                      }`}>4</div>
                      <p className="text-[10px] font-semibold text-gray-300">Served</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Items Ordered</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-300">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="bg-dark-900/60 p-2.5 rounded-lg border border-gray-800/80 flex justify-between items-center">
                      <span className="font-medium">{item.name} × {item.quantity}</span>
                      <span className="text-xs text-gray-400">₹{item.subtotal}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-gray-800 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  Type: <strong className="text-gray-200 uppercase">{order.orderType}</strong> | Payment: <strong className="text-gray-200 uppercase">{order.paymentMethod}</strong>
                </span>

                <div className="flex items-center gap-3">
                  {['pending', 'confirmed'].includes(order.orderStatus) && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={cancellingId === order._id}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      {cancellingId === order._id ? 'Cancelling...' : 'Cancel Order'}
                    </button>
                  )}

                  <Link
                    to={`/order-success/${order._id}`}
                    className="px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-gray-300 hover:text-gold-400 border border-gray-800 text-xs font-semibold transition flex items-center gap-1"
                  >
                    View Details <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
