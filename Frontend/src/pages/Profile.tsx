import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Phone, MapPin, Shield, Calendar, ShoppingBag, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header Banner */}
      <div className="glass-card rounded-2xl p-8 border border-gold-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 text-center md:text-left">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-gold-700 flex items-center justify-center text-black font-serif text-2xl font-bold shadow-xl shadow-gold-500/20 shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-serif font-bold text-gray-100">{user.name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase ${isAdmin ? 'bg-gold-500/20 text-gold-400 border border-gold-500/40' : 'bg-gray-800 text-gray-300'}`}>
                {user.role}
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-1">{user.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-semibold text-sm transition flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      {/* Gotham VIP Loyalty Status Banner */}
      <div className="glass-card rounded-2xl p-6 border border-gold-500/30 bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gold-500 uppercase tracking-widest flex items-center gap-1.5">
              👑 Gotham VIP Rewards Program
            </span>
            <h3 className="text-xl font-serif font-bold text-gray-100">
              Tier: <span className="text-gold-gradient">{user.loyaltyTier || 'Bronze Gargoyle'}</span>
            </h3>
          </div>
          <div className="text-right">
            <span className="text-2xl font-serif font-bold text-gold-400">{user.loyaltyPoints || 0}</span>
            <span className="text-xs text-gray-400 block">Bat-Coins Earned</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Progress to Next VIP Tier</span>
            <span>{user.loyaltyPoints || 0} / 5000 Pts</span>
          </div>
          <div className="w-full bg-dark-950 h-2.5 rounded-full overflow-hidden border border-gray-800">
            <div
              className="bg-gradient-to-r from-gold-500 to-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, ((user.loyaltyPoints || 0) / 5000) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Personal Details */}
        <div className="glass-card rounded-2xl p-6 border border-gray-800 space-y-4">
          <h2 className="font-serif text-lg font-bold text-gray-100 pb-3 border-b border-gray-800 flex items-center gap-2">
            <User className="w-5 h-5 text-gold-500" /> Account Details
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-gray-300">
              <Mail className="w-4 h-4 text-gold-500 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Email Address</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-300">
              <Phone className="w-4 h-4 text-gold-500 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Phone Number</p>
                <p className="font-medium">{user.phone || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-gray-300">
              <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-1" />
              <div>
                <p className="text-xs text-gray-500">Default Address</p>
                <p className="font-medium">
                  {user.address?.street || user.address?.city
                    ? `${user.address.street || ''} ${user.address.city || ''}`
                    : 'No default address stored'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-300">
              <Shield className="w-4 h-4 text-gold-500 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Member Since</p>
                <p className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div className="space-y-4">
          <Link
            to="/my-orders"
            className="glass-card rounded-2xl p-6 border border-gray-800 hover:border-gold-500/40 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center group-hover:scale-110 transition">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-gray-100 group-hover:text-gold-400 transition">My Orders</h3>
                <p className="text-gray-400 text-xs">View past food orders & live status</p>
              </div>
            </div>
          </Link>

          <Link
            to="/my-reservations"
            className="glass-card rounded-2xl p-6 border border-gray-800 hover:border-gold-500/40 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center group-hover:scale-110 transition">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-gray-100 group-hover:text-gold-400 transition">My Reservations</h3>
                <p className="text-gray-400 text-xs">Manage upcoming table bookings</p>
              </div>
            </div>
          </Link>

          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="glass-card rounded-2xl p-6 border border-gold-500/30 bg-gold-500/5 hover:bg-gold-500/10 transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold-500 text-black flex items-center justify-center font-bold">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-gold-400">Admin Control Panel</h3>
                  <p className="text-gray-300 text-xs">Manage menu, orders, tables & settings</p>
                </div>
              </div>
            </Link>
          )}
        </div>

      </div>

    </div>
  );
};
