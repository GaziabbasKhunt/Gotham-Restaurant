import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UtensilsCrossed, User as UserIcon, Mail, Lock, Phone, MapPin, UserPlus, AlertCircle } from 'lucide-react';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError('Name, email, and password are required.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setSubmitting(true);
      await register({
        name,
        email,
        password,
        phone: phone || undefined,
        address: (street || city) ? { street, city } : undefined
      });
      navigate('/', { replace: true });
    } catch (err) {
      setError((err as Error).message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="glass-card max-w-lg w-full rounded-2xl p-8 border border-gold-500/20 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-black font-bold mx-auto shadow-lg shadow-gold-500/20">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-gray-100 tracking-tight">
            Create an Account
          </h2>
          <p className="text-gray-400 text-sm">
            Join Gotham Restaurant for exclusive dining & online ordering
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <UserIcon className="w-5 h-5" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Bruce Wayne"
                className="w-full pl-11 pr-4 py-3 bg-dark-900/80 border border-gray-800 rounded-xl text-gray-100 focus:outline-none focus:border-gold-500 text-sm transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="bruce@wayneenterprises.com"
                className="w-full pl-11 pr-4 py-3 bg-dark-900/80 border border-gray-800 rounded-xl text-gray-100 focus:outline-none focus:border-gold-500 text-sm transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-11 pr-4 py-3 bg-dark-900/80 border border-gray-800 rounded-xl text-gray-100 focus:outline-none focus:border-gold-500 text-sm transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-11 pr-4 py-3 bg-dark-900/80 border border-gray-800 rounded-xl text-gray-100 focus:outline-none focus:border-gold-500 text-sm transition"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Street Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="100 Wayne Manor Blvd"
                  className="w-full pl-11 pr-4 py-3 bg-dark-900/80 border border-gray-800 rounded-xl text-gray-100 focus:outline-none focus:border-gold-500 text-sm transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Gotham City"
                className="w-full px-4 py-3 bg-dark-900/80 border border-gray-800 rounded-xl text-gray-100 focus:outline-none focus:border-gold-500 text-sm transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold rounded-xl hover:brightness-110 transition duration-200 gold-glow shadow-lg flex items-center justify-center gap-2 text-sm disabled:opacity-50 mt-4"
          >
            {submitting ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <UserPlus className="w-5 h-5" /> Register Account
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-gray-400 pt-2 border-t border-gray-800">
          Already have an account?{' '}
          <Link to="/login" className="text-gold-400 font-semibold hover:underline">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
};
