import React from 'react';
import { ReservationForm } from '../components/reservation/ReservationForm';
import { Sparkles, Clock, ShieldCheck, PhoneCall } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TableReservation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Hero Heading */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" /> Gotham Dining Experience
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-100">
          Book Your <span className="text-gold-gradient">Table</span>
        </h1>
        <p className="text-gray-400 text-base font-light leading-relaxed">
          Join us for an exquisite dining experience. Select your preferred date, time, and table location below.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left 2 Cols: Reservation Form */}
        <div className="lg:col-span-2">
          <ReservationForm onSuccess={() => navigate('/my-reservations')} />
        </div>

        {/* Right Col: Info Cards */}
        <div className="space-y-6">
          
          <div className="glass-card rounded-2xl p-6 border border-gray-800 space-y-4">
            <h3 className="font-serif font-bold text-lg text-gray-100 flex items-center gap-2 border-b border-gray-800 pb-3">
              <Clock className="w-5 h-5 text-gold-500" /> Dining Hours
            </h3>
            <ul className="space-y-3 text-xs text-gray-300">
              <li className="flex justify-between">
                <span className="text-gray-400">Monday – Thursday:</span>
                <span className="font-semibold text-gray-200">5:00 PM – 11:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Friday – Saturday:</span>
                <span className="font-semibold text-gray-200">5:00 PM – 12:00 AM</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Sunday:</span>
                <span className="font-semibold text-gray-200">4:00 PM – 10:00 PM</span>
              </li>
            </ul>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-gray-800 space-y-4">
            <h3 className="font-serif font-bold text-lg text-gray-100 flex items-center gap-2 border-b border-gray-800 pb-3">
              <ShieldCheck className="w-5 h-5 text-gold-500" /> Reservation Policy
            </h3>
            <ul className="space-y-2 text-xs text-gray-400 list-disc list-inside leading-relaxed">
              <li>Tables are held for 15 minutes past your reserved time.</li>
              <li>For parties larger than 10 guests, please contact our VIP manager directly.</li>
              <li>Cancellations can be made anytime up to 2 hours prior to reservation.</li>
            </ul>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-gold-500/20 bg-gold-500/5 space-y-3">
            <h4 className="font-serif font-bold text-gold-400 flex items-center gap-2">
              <PhoneCall className="w-4 h-4" /> Need Direct Assistance?
            </h4>
            <p className="text-xs text-gray-300">
              For private dining rooms or special event arrangements:
            </p>
            <p className="text-sm font-bold text-gray-100">+1 (555) 468-4261</p>
          </div>

        </div>

      </div>

    </div>
  );
};
