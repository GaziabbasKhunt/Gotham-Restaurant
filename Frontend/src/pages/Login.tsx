import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UtensilsCrossed, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setSubmitting(true);
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError((err as Error).message || 'Invalid email or password credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="glass-card max-w-md w-full rounded-2xl p-8 border border-gold-500/20 shadow-2xl space-y-8">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-black font-bold mx-auto shadow-lg shadow-gold-500/20">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-gray-100 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-gray-400 text-sm">
            Sign in to access your reservations, orders & profile
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Email Address
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
                placeholder="name@example.com"
                className="w-full pl-11 pr-4 py-3 bg-dark-900/80 border border-gray-800 rounded-xl text-gray-100 focus:outline-none focus:border-gold-500 text-sm transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Password
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
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-dark-900/80 border border-gray-800 rounded-xl text-gray-100 focus:outline-none focus:border-gold-500 text-sm transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold rounded-xl hover:brightness-110 transition duration-200 gold-glow shadow-lg flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {submitting ? (
              <span>Signing In...</span>
            ) : (
              <>
                <LogIn className="w-5 h-5" /> Sign In
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs text-gray-400 pt-2 border-t border-gray-800">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-gold-400 font-semibold hover:underline">
            Register Here
          </Link>
        </div>

      </div>
    </div>
  );
};
