import React, { useEffect, useState } from 'react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Loading } from '../../components/common/Loading';
import { getAllReservations, updateReservationStatus } from '../../services/reservationService';
import { Reservation, ReservationStatus } from '../../types';
import { CalendarCheck, Search, Filter, Check, AlertCircle, Users, Clock } from 'lucide-react';

export const AdminReservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const res = await getAllReservations(statusFilter || undefined);
      if (res.success && res.data) {
        setReservations(res.data);
      } else {
        setError(res.message || 'Failed to load reservations');
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message || 'Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [statusFilter]);

  const handleStatusChange = async (id: string, newStatus: ReservationStatus) => {
    try {
      setUpdatingId(id);
      setError(null);
      setSuccessMsg(null);
      const res = await updateReservationStatus(id, newStatus);
      if (res.success && res.data) {
        setReservations((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
        );
        setSuccessMsg(`Reservation status updated to ${newStatus}`);
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        setError(res.message || 'Failed to update reservation');
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message || 'Failed to update reservation');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredReservations = reservations.filter((r) => {
    const term = searchTerm.toLowerCase();
    return (
      r.customerName.toLowerCase().includes(term) ||
      r.phone.includes(term) ||
      r.email.toLowerCase().includes(term)
    );
  });

  const getStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
    }
  };

  const allStatuses: ReservationStatus[] = ['pending', 'confirmed', 'completed', 'cancelled'];

  return (
    <div className="min-h-screen bg-dark-900 pb-16">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-gray-100 flex items-center space-x-3">
              <CalendarCheck className="w-7 h-7 text-gold-400" />
              <span>Dining Reservations</span>
            </h2>
            <p className="text-sm text-gray-400">View and manage table bookings and customer seating</p>
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
              placeholder="Search by guest name, phone..."
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
                  {st.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <Loading message="Fetching table reservations..." />
        ) : filteredReservations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReservations.map((r) => (
              <div
                key={r._id}
                className="bg-dark-800 border border-gold-500/20 rounded-xl p-6 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4 pb-3 border-b border-dark-700">
                    <div>
                      <h3 className="font-serif font-bold text-gray-100 text-lg">{r.customerName}</h3>
                      <p className="text-xs text-gray-400">{r.phone}</p>
                      <p className="text-xs text-gray-400">{r.email}</p>
                    </div>

                    <select
                      disabled={updatingId === r._id}
                      value={r.status}
                      onChange={(e) => handleStatusChange(r._id, e.target.value as ReservationStatus)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border focus:outline-none cursor-pointer ${getStatusBadge(
                        r.status
                      )} bg-dark-900`}
                    >
                      {allStatuses.map((st) => (
                        <option key={st} value={st}>
                          {st.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2 text-sm text-gray-300 mb-4">
                    <div className="flex items-center space-x-2 text-xs text-gold-400">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(r.date).toLocaleDateString()} at {r.time}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-gray-300">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>{r.numberOfGuests} Guests</span>
                    </div>

                    <div className="text-xs text-gray-300">
                      <span className="text-gray-400">Assigned Table:</span>{' '}
                      <strong className="text-gold-400">
                        {r.table ? `Table ${r.table.tableNumber} (${r.table.capacity} seats)` : 'Unassigned'}
                      </strong>
                    </div>

                    {r.specialRequest && (
                      <p className="text-xs bg-dark-900/60 p-2.5 rounded border border-dark-700 text-gray-400 mt-2">
                        <strong className="text-gold-400 block mb-1">Special Request:</strong> {r.specialRequest}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-dark-700/50 text-xs text-gray-500 flex justify-between items-center">
                  <span>Booked: {new Date(r.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-dark-800 border border-gold-500/20 rounded-xl text-gray-400">
            No table reservations found.
          </div>
        )}
      </div>
    </div>
  );
};
