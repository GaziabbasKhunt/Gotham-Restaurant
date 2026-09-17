import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getAvailableTables, createReservation } from '../../services/reservationService';
import { RestaurantTable } from '../../types';
import { Calendar, Clock, Users, MapPin, User, Phone, Mail, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface ReservationFormProps {
  onSuccess?: () => void;
}

export const ReservationForm: React.FC<ReservationFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();

  // Get tomorrow's date string format (YYYY-MM-DD)
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [date, setDate] = useState<string>(tomorrowStr);
  const [time, setTime] = useState<string>('19:00');
  const [numberOfGuests, setNumberOfGuests] = useState<number>(2);
  const [selectedTableId, setSelectedTableId] = useState<string>('');

  const [customerName, setCustomerName] = useState<string>(user?.name || '');
  const [phone, setPhone] = useState<string>(user?.phone || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [specialRequest, setSpecialRequest] = useState<string>('');

  const [availableTables, setAvailableTables] = useState<RestaurantTable[]>([]);
  const [loadingTables, setLoadingTables] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const timeSlots = [
    '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00', '20:30',
    '21:00', '21:30', '22:00'
  ];

  // Fetch available tables when date, time, or guest count changes
  useEffect(() => {
    const fetchTables = async () => {
      if (!date || !time) return;
      try {
        setLoadingTables(true);
        const res = await getAvailableTables(date, time, numberOfGuests);
        if (res.data) {
          setAvailableTables(res.data);
          // If previously selected table is no longer available, reset selectedTableId
          if (selectedTableId && !res.data.some((t) => t._id === selectedTableId)) {
            setSelectedTableId('');
          }
        }
      } catch (err) {
        console.warn('Failed to load available tables:', err);
      } finally {
        setLoadingTables(false);
      }
    };

    fetchTables();
  }, [date, time, numberOfGuests]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!customerName || !phone || !email || !date || !time) {
      setError('Please fill in all required customer and booking fields.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await createReservation({
        customerName,
        phone,
        email,
        date,
        time,
        numberOfGuests,
        table: selectedTableId || undefined,
        specialRequest: specialRequest || undefined
      });

      if (res.success) {
        setSuccessMsg(`Reservation confirmed at Gotham Restaurant for ${numberOfGuests} guests on ${date} at ${time}!`);
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError((err as Error).message || 'Failed to book table reservation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8 border border-gold-500/20 space-y-6 shadow-2xl">
      
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 text-gold-400 text-xs font-semibold uppercase tracking-widest border border-gold-500/20">
          <Sparkles className="w-3.5 h-3.5" /> Bespoke Table Booking
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-100">Reserve a Table</h2>
        <p className="text-gray-400 text-xs sm:text-sm">Select date, time, guest count, and your preferred table location.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3 text-emerald-400 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Booking Parameters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Date Picker */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
            Reservation Date *
          </label>
          <div className="relative">
            <Calendar className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gold-500" />
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-dark-900/80 border border-gray-800 rounded-xl text-gray-100 focus:outline-none focus:border-gold-500 text-sm transition"
            />
          </div>
        </div>

        {/* Time Slot Picker */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
            Time Slot *
          </label>
          <div className="relative">
            <Clock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gold-500" />
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-dark-900/80 border border-gray-800 rounded-xl text-gray-100 focus:outline-none focus:border-gold-500 text-sm transition appearance-none"
            >
              {timeSlots.map((slot) => (
                <option key={slot} value={slot} className="bg-dark-900 text-gray-100">
                  {slot} PM
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Guest Count */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
            Number of Guests *
          </label>
          <div className="relative">
            <Users className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gold-500" />
            <select
              value={numberOfGuests}
              onChange={(e) => setNumberOfGuests(Number(e.target.value))}
              className="w-full pl-11 pr-4 py-3 bg-dark-900/80 border border-gray-800 rounded-xl text-gray-100 focus:outline-none focus:border-gold-500 text-sm transition appearance-none"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 10].map((num) => (
                <option key={num} value={num} className="bg-dark-900 text-gray-100">
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Available Table Picker & Interactive Visual Floor Plan */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gold-500" /> Select Table Location (Optional)
          </label>
          <div className="inline-flex p-1 bg-dark-900 rounded-lg border border-gray-800 text-[11px]">
            <button
              type="button"
              onClick={() => setSelectedTableId('')}
              className={`px-3 py-1 rounded-md transition ${selectedTableId === '' ? 'bg-gold-500 text-black font-bold' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Auto Assign
            </button>
          </div>
        </div>

        {loadingTables ? (
          <p className="text-xs text-gray-500">Checking live table availability for {date} at {time}...</p>
        ) : availableTables.length === 0 ? (
          <p className="text-xs text-red-400 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
            No active tables available for {numberOfGuests} guests at {time} on {date}. Please try another time slot.
          </p>
        ) : (
          <div className="space-y-4">
            {/* Visual Floor Plan Zone Map */}
            <div className="bg-dark-950/80 rounded-2xl p-5 border border-gold-500/20 space-y-4 shadow-inner">
              <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
                <span className="text-xs font-serif font-bold text-gold-400 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" /> Gotham Restaurant Floor Plan
                </span>
                <div className="flex items-center gap-4 text-[10px] text-gray-400">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-400 shadow-sm shadow-emerald-500/50"></span> Available</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gold-500 border border-gold-400 shadow-sm shadow-gold-500/50"></span> Selected</span>
                </div>
              </div>

              {/* Layout Map by Dining Zones */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Zone 1: VIP Lounge & Private Chef Table */}
                <div className="bg-dark-900/90 rounded-xl p-3.5 border border-amber-500/20 space-y-3">
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between border-b border-gray-800 pb-2">
                    <span>👑 VIP & Chef's Reserve</span>
                    <span className="text-[9px] text-gray-500">Private Dining</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {availableTables.filter(t => (t.location || '').includes('VIP') || (t.location || '').includes('Chef')).map((tbl) => (
                      <button
                        key={tbl._id}
                        type="button"
                        onClick={() => setSelectedTableId(tbl._id)}
                        className={`p-3 rounded-lg border text-left transition transform hover:scale-105 ${
                          selectedTableId === tbl._id
                            ? 'bg-gold-500/25 border-gold-500 text-gold-300 ring-2 ring-gold-500/50'
                            : 'bg-dark-800/80 border-gray-700 text-gray-300 hover:border-gold-500/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs">{tbl.tableNumber}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">{tbl.capacity} Seats</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1 truncate">{tbl.location}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Zone 2: Main Dining Room */}
                <div className="bg-dark-900/90 rounded-xl p-3.5 border border-gold-500/20 space-y-3">
                  <div className="text-[11px] font-bold text-gold-400 uppercase tracking-wider flex items-center justify-between border-b border-gray-800 pb-2">
                    <span>🏛️ Main Dining Room</span>
                    <span className="text-[9px] text-gray-500">Center Hall</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {availableTables.filter(t => (t.location || '').includes('Main') || (!t.location)).map((tbl) => (
                      <button
                        key={tbl._id}
                        type="button"
                        onClick={() => setSelectedTableId(tbl._id)}
                        className={`p-3 rounded-lg border text-left transition transform hover:scale-105 ${
                          selectedTableId === tbl._id
                            ? 'bg-gold-500/25 border-gold-500 text-gold-300 ring-2 ring-gold-500/50'
                            : 'bg-dark-800/80 border-gray-700 text-gray-300 hover:border-gold-500/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs">{tbl.tableNumber}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-gold-500/20 text-gold-400 font-semibold">{tbl.capacity} Seats</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1 truncate">{tbl.location || 'Main Dining'}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Zone 3: Window Side & Patio Terrace */}
                <div className="bg-dark-900/90 rounded-xl p-3.5 border border-sky-500/20 space-y-3">
                  <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wider flex items-center justify-between border-b border-gray-800 pb-2">
                    <span>🌅 Window & Patio Terrace</span>
                    <span className="text-[9px] text-gray-500">Skyline View</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {availableTables.filter(t => (t.location || '').includes('Window') || (t.location || '').includes('Patio')).map((tbl) => (
                      <button
                        key={tbl._id}
                        type="button"
                        onClick={() => setSelectedTableId(tbl._id)}
                        className={`p-3 rounded-lg border text-left transition transform hover:scale-105 ${
                          selectedTableId === tbl._id
                            ? 'bg-gold-500/25 border-gold-500 text-gold-300 ring-2 ring-gold-500/50'
                            : 'bg-dark-800/80 border-gray-700 text-gray-300 hover:border-gold-500/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs">{tbl.tableNumber}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-semibold">{tbl.capacity} Seats</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1 truncate">{tbl.location}</p>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>

      {/* Customer Contact Details */}
      <div className="pt-4 border-t border-gray-800 space-y-4">
        <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Customer Information</h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Bruce Wayne"
                className="w-full pl-9 pr-3 py-2.5 bg-dark-900/80 border border-gray-800 rounded-xl text-gray-100 focus:outline-none focus:border-gold-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Phone Number *</label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 468-4261"
                className="w-full pl-9 pr-3 py-2.5 bg-dark-900/80 border border-gray-800 rounded-xl text-gray-100 focus:outline-none focus:border-gold-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="bruce@wayneenterprises.com"
                className="w-full pl-9 pr-3 py-2.5 bg-dark-900/80 border border-gray-800 rounded-xl text-gray-100 focus:outline-none focus:border-gold-500 text-xs"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Special Dietary or Seating Request</label>
          <textarea
            rows={2}
            value={specialRequest}
            onChange={(e) => setSpecialRequest(e.target.value)}
            placeholder="Anniversary celebration, window seating preference, nut allergies, etc."
            className="w-full p-3 bg-dark-900/80 border border-gray-800 rounded-xl text-gray-100 focus:outline-none focus:border-gold-500 text-xs"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting || availableTables.length === 0}
        className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold hover:brightness-110 transition duration-200 gold-glow shadow-xl text-base disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {submitting ? 'Confirming Reservation...' : 'Confirm Table Reservation'}
      </button>

    </form>
  );
};
