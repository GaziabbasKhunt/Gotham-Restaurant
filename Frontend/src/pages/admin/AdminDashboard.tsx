import React, { useEffect, useState } from 'react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Loading } from '../../components/common/Loading';
import { getDashboardStats, DashboardStats } from '../../services/settingsService';
import { DollarSign, ShoppingBag, CalendarCheck, Utensils, Users, ArrowUpRight, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const res = await getDashboardStats();
        if (res.success && res.data) {
          setStats(res.data);
        } else {
          setError(res.message || 'Failed to load dashboard metrics');
        }
      } catch (err: unknown) {
        const errorObj = err as { response?: { data?: { message?: string } } };
        setError(errorObj.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'preparing':
      case 'confirmed':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'pending':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 pb-16">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-serif font-bold text-gray-100">Overview & Key Performance</h2>
            <p className="text-sm text-gray-400">Real-time statistics across operations and sales</p>
          </div>
          <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-semibold">
            <CheckCircle className="w-4 h-4" />
            <span>Operational System Online</span>
          </div>
        </div>

        {loading ? (
          <Loading message="Loading telemetry & sales metrics..." />
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center text-red-400">
            <p className="font-semibold">{error}</p>
          </div>
        ) : stats ? (
          <>
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <div className="bg-dark-800 border border-gold-500/20 rounded-xl p-5 shadow-lg">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Revenue</span>
                  <div className="p-2 bg-gold-500/10 rounded-lg text-gold-400">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-100">₹{stats.totalSales.toLocaleString()}</h3>
                <p className="text-xs text-gray-400 mt-1">Gross completed orders</p>
              </div>

              <div className="bg-dark-800 border border-gold-500/20 rounded-xl p-5 shadow-lg">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Orders</span>
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-100">{stats.totalOrders}</h3>
                <p className="text-xs text-gray-400 mt-1">Processed orders</p>
              </div>

              <div className="bg-dark-800 border border-gold-500/20 rounded-xl p-5 shadow-lg">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Reservations</span>
                  <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                    <CalendarCheck className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-100">{stats.totalReservations}</h3>
                <p className="text-xs text-gray-400 mt-1">Booked tables</p>
              </div>

              <div className="bg-dark-800 border border-gold-500/20 rounded-xl p-5 shadow-lg">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Dishes</span>
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                    <Utensils className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-100">{stats.totalMenuItems}</h3>
                <p className="text-xs text-gray-400 mt-1">Active menu items</p>
              </div>

              <div className="bg-dark-800 border border-gold-500/20 rounded-xl p-5 shadow-lg">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Registered Users</span>
                  <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-100">{stats.totalCustomers}</h3>
                <p className="text-xs text-gray-400 mt-1">Customer profiles</p>
              </div>
            </div>

            {/* Recent Orders Section */}
            <div className="bg-dark-800 border border-gold-500/20 rounded-xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-serif font-bold text-gray-100 flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gold-400" />
                    <span>Recent Customer Orders</span>
                  </h3>
                  <p className="text-xs text-gray-400">Latest activity received on the system</p>
                </div>
                <Link
                  to="/admin/orders"
                  className="text-xs font-semibold text-gold-400 hover:text-gold-300 flex items-center space-x-1 border border-gold-500/30 px-3 py-1.5 rounded-lg hover:bg-gold-500/10 transition-colors"
                >
                  <span>Manage All Orders</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              {stats.recentOrders && stats.recentOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-300">
                    <thead className="bg-dark-900/60 text-xs text-gold-400 uppercase border-b border-dark-700">
                      <tr>
                        <th className="py-3 px-4">Order #</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-700/50">
                      {stats.recentOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-dark-700/30 transition-colors">
                          <td className="py-3 px-4 font-mono font-semibold text-gold-400">{order.orderNumber}</td>
                          <td className="py-3 px-4 font-medium text-gray-200">{order.customerName}</td>
                          <td className="py-3 px-4 font-semibold text-gray-100">₹{order.totalAmount}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                                order.orderStatus
                              )}`}
                            >
                              {order.orderStatus.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-xs text-gray-400">
                            {new Date(order.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm border border-dashed border-dark-700 rounded-lg">
                  No orders recorded yet.
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};
