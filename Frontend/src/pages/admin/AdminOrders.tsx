import React, { useEffect, useState } from 'react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Loading } from '../../components/common/Loading';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';
import { Order, OrderStatus } from '../../types';
import { ShoppingBag, Search, Filter, Check, Clock, AlertCircle } from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllOrders(statusFilter || undefined);
      if (res.success && res.data) {
        setOrders(res.data);
      } else {
        setError(res.message || 'Failed to fetch orders');
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message || 'Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleStatusChange = async (id: string, newStatus: OrderStatus) => {
    try {
      setUpdatingId(id);
      setError(null);
      setSuccessMsg(null);
      const res = await updateOrderStatus(id, newStatus);
      if (res.success && res.data) {
        setOrders((prev) =>
          prev.map((o) => (o._id === id ? { ...o, orderStatus: newStatus } : o))
        );
        setSuccessMsg(`Order #${res.data.orderNumber} updated to ${newStatus}`);
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        setError(res.message || 'Failed to update order status');
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const term = searchTerm.toLowerCase();
    const customerName = typeof o.user === 'object' ? o.user?.name?.toLowerCase() : '';
    const customerEmail = typeof o.user === 'object' ? o.user?.email?.toLowerCase() : '';
    return (
      o.orderNumber.toLowerCase().includes(term) ||
      customerName?.includes(term) ||
      customerEmail?.includes(term)
    );
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'preparing':
      case 'ready':
      case 'out_for_delivery':
      case 'confirmed':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'pending':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
    }
  };

  const allStatuses: OrderStatus[] = [
    'pending',
    'confirmed',
    'preparing',
    'ready',
    'out_for_delivery',
    'delivered',
    'cancelled'
  ];

  return (
    <div className="min-h-screen bg-dark-900 pb-16">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-gray-100 flex items-center space-x-3">
              <ShoppingBag className="w-7 h-7 text-gold-400" />
              <span>Order Management</span>
            </h2>
            <p className="text-sm text-gray-400">Manage order fulfillments and update kitchen status</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 flex items-center space-x-2 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 flex items-center space-x-2 text-sm">
            <Check className="w-5 h-5 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Filter Controls */}
        <div className="bg-dark-800 border border-gold-500/20 rounded-xl p-4 mb-8 shadow-lg flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order # or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gold-400"
            />
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-gold-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-gold-400"
            >
              <option value="">All Statuses</option>
              {allStatuses.map((st) => (
                <option key={st} value={st}>
                  {st.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <Loading message="Loading customer order queue..." />
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-dark-800 border border-gold-500/20 rounded-xl p-6 shadow-xl hover:border-gold-500/40 transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pb-4 mb-4 border-b border-dark-700/60 gap-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <span className="text-lg font-mono font-bold text-gold-400">
                        {order.orderNumber}
                      </span>
                      <span className="text-xs uppercase font-semibold px-2.5 py-0.5 rounded-md bg-dark-700 text-gray-300">
                        {order.orderType}
                      </span>
                      <span className="text-xs uppercase font-semibold px-2.5 py-0.5 rounded-md bg-dark-700 text-gold-400">
                        {order.paymentMethod} ({order.paymentStatus})
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(order.createdAt).toLocaleString()}</span>
                    </p>
                  </div>

                  {/* Status update dropdown */}
                  <div className="flex items-center space-x-3 w-full lg:w-auto">
                    <span className="text-xs text-gray-400">Status:</span>
                    <select
                      disabled={updatingId === order._id}
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value as OrderStatus)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border focus:outline-none cursor-pointer ${getStatusBadge(
                        order.orderStatus
                      )} bg-dark-900`}
                    >
                      {allStatuses.map((st) => (
                        <option key={st} value={st}>
                          {st.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Customer info & Item details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-xs font-semibold text-gold-400 uppercase tracking-wider mb-2">
                      Customer Info
                    </h4>
                    <p className="text-sm font-medium text-gray-200">
                      {typeof order.user === 'object' ? order.user?.name : 'Guest'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {typeof order.user === 'object' ? order.user?.email : ''}
                    </p>
                    {order.deliveryAddress && (
                      <p className="text-xs text-gray-400 mt-2 bg-dark-900/50 p-2 rounded border border-dark-700">
                        {order.deliveryAddress.street}, {order.deliveryAddress.city},{' '}
                        {order.deliveryAddress.state} - {order.deliveryAddress.postalCode}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <h4 className="text-xs font-semibold text-gold-400 uppercase tracking-wider mb-2">
                      Order Items ({order.items.length})
                    </h4>
                    <div className="space-y-2 bg-dark-900/40 p-3 rounded-lg border border-dark-700/50">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-gray-300">
                          <span>
                            <strong className="text-gold-400">{it.quantity}x</strong> {it.name}
                          </span>
                          <span className="font-mono">₹{it.subtotal}</span>
                        </div>
                      ))}
                      <div className="pt-2 mt-2 border-t border-dark-700 flex justify-between font-bold text-sm text-gray-100">
                        <span>Total Paid:</span>
                        <span className="text-gold-400">₹{order.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-dark-800 border border-gold-500/20 rounded-xl text-gray-400">
            No orders match the specified filters.
          </div>
        )}
      </div>
    </div>
  );
};
