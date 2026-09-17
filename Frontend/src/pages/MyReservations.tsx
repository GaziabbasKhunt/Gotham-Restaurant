import React, { useEffect, useState } from 'react';
import { getMyReservations, cancelReservation } from '../services/reservationService';
import { Reservation, ReservationStatus } from '../types';
import { Loading } from '../components/common/Loading';
import { ErrorComponent } from '../components/common/ErrorComponent';
import { Calendar, Clock, Users, MapPin, XCircle, Plus, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyReservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getMyReservations();
      if (res.data) setReservations(res.data);
    } catch (err) {
      setError((err as Error).message || 'Failed to load reservation history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancelReservation = async (reservationId: string) => {
    if (!window.confirm('Are you sure you want to cancel this table reservation?')) return;

    try {
      setCancellingId(reservationId);
      await cancelReservation(reservationId);
      await fetchReservations();
    } catch (err) {
      alert((err as Error).message || 'Failed to cancel reservation');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status: ReservationStatus) => {
    const styles: Record<ReservationStatus, string> = {
      confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      pending: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      completed: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      cancelled: 'bg-red-500/10 text-red-400 border-red-500/30'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${styles[status] || 'bg-gray-800 text-gray-300'}`}>
        {status}
      </span>
    );
  };

  if (loading) return <Loading message="Loading your table bookings..." />;
  if (error) return <ErrorComponent title="Reservation History Error" message={error} onRetry={fetchReservations} />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="border-b border-gray-800 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-100">My Reservations</h1>
          <p className="text-gray-400 text-xs mt-1">Manage your table bookings at Gotham Restaurant</p>
        </div>
        <Link
          to="/reservation"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-500 text-black font-bold text-xs gold-glow transition"
        >
          <Plus className="w-4 h-4" /> Book New Table
        </Link>
      </div>

      {/* Reservation Cards List */}
      {reservations.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center max-w-lg mx-auto border border-gray-800 space-y-4">
          <div className="w-14 h-14 rounded-full bg-gold-500/10 text-gold-400 flex items-center justify-center mx-auto">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-xl font-bold text-gray-200">No Table Reservations Found</h3>
          <p className="text-gray-400 text-sm">
            You don't have any upcoming table bookings. Reserve a table for fine dining today!
          </p>
          <Link
            to="/reservation"
            className="inline-block px-5 py-2.5 rounded-xl bg-gold-500 text-black font-bold text-xs uppercase tracking-wider gold-glow"
          >
            Book a Table Now
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {reservations.map((res) => (
            <div key={res._id} className="glass-card rounded-2xl p-6 border border-gray-800 space-y-4 hover:border-gold-500/30 transition">
              
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-gray-800 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-serif font-bold text-lg text-gray-100">
                      Table {res.table?.tableNumber || 'Assigned'}
                    </span>
                    {getStatusBadge(res.status)}
                  </div>
                  <p className="text-xs text-gray-400">
                    Location: <strong className="text-gold-400">{res.table?.location || 'Main Dining Room'}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {res.status !== 'cancelled' && (
                    <button
                      onClick={() => handleCancelReservation(res._id)}
                      disabled={cancellingId === res._id}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      {cancellingId === res._id ? 'Cancelling...' : 'Cancel Reservation'}
                    </button>
                  )}
                </div>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="bg-dark-900/60 p-3 rounded-xl border border-gray-800/80 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gold-500 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">Reservation Date</p>
                    <p className="font-semibold text-gray-200">
                      {new Date(res.date).toLocaleDateString(undefined, {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="bg-dark-900/60 p-3 rounded-xl border border-gray-800/80 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gold-500 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">Reserved Time Slot</p>
                    <p className="font-semibold text-gray-200">{res.time} PM</p>
                  </div>
                </div>

                <div className="bg-dark-900/60 p-3 rounded-xl border border-gray-800/80 flex items-center gap-3">
                  <Users className="w-5 h-5 text-gold-500 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">Guest Party Size</p>
                    <p className="font-semibold text-gray-200">{res.numberOfGuests} Guests</p>
                  </div>
                </div>
              </div>

              {/* Special Request */}
              {res.specialRequest && (
                <div className="text-xs text-gray-400 bg-dark-900/40 p-3 rounded-xl border border-gray-800">
                  <span className="font-semibold text-gold-400">Special Request:</span> "{res.specialRequest}"
                </div>
              )}

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
