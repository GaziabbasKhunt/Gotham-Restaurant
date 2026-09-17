import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { UtensilsCrossed, Calendar, ShoppingBag, User as UserIcon, Menu as MenuIcon, X, LogOut, Shield, Award } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalCount } = useCart();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'About', path: '/about' },
    { name: 'Reservations', path: '/reservation' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full bg-dark-900/90 backdrop-blur-lg border-b border-gold-500/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-700 flex items-center justify-center text-black font-bold shadow-lg shadow-gold-500/20 group-hover:scale-105 transition">
            <UtensilsCrossed className="w-5 h-5 text-black" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-wider text-gray-100 group-hover:text-gold-400 transition">
              GOTHAM
            </span>
            <span className="text-[10px] tracking-[0.25em] text-gold-500 uppercase -mt-1 font-medium">
              Fine Dining
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition duration-200 hover:text-gold-400 relative py-1 ${
                isActive(link.path) ? 'text-gold-400 font-semibold' : 'text-gray-300'
              }`}
            >
              {link.name}
              {isActive(link.path) && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-gold-400 to-gold-600 rounded-full"></span>
              )}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="text-xs font-bold uppercase tracking-wider text-gold-400 bg-gold-500/10 hover:bg-gold-500/20 px-3 py-1.5 rounded-lg border border-gold-500/30 transition flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" /> Admin Panel
            </Link>
          )}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/cart"
            className="p-2.5 rounded-full bg-dark-800 text-gray-300 hover:text-gold-400 border border-gray-800 hover:border-gold-500/30 transition relative"
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold-500 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                {totalCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-gold-500/10 to-amber-500/10 border border-gold-500/30 text-gold-400 text-xs font-medium hover:border-gold-500 transition"
                title={`${user?.loyaltyTier || 'Bronze Gargoyle'} VIP Member`}
              >
                <Award className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
                <span className="font-bold">{user?.loyaltyPoints || 0} Pts</span>
              </Link>

              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-800 text-gray-200 border border-gray-800 hover:border-gold-500/30 text-xs font-medium transition"
              >
                <div className="w-6 h-6 rounded-full bg-gold-500 text-black font-bold flex items-center justify-center text-[10px]">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <span>{user?.name.split(' ')[0]}</span>
              </Link>
              <button
                onClick={logout}
                className="p-2 rounded-full bg-dark-800 text-gray-400 hover:text-red-400 border border-gray-800 hover:border-red-500/30 transition"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="p-2.5 rounded-full bg-dark-800 text-gray-300 hover:text-gold-400 border border-gray-800 hover:border-gold-500/30 transition"
              aria-label="Account"
            >
              <UserIcon className="w-5 h-5" />
            </Link>
          )}

          <Link
            to="/reservation"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-black font-semibold text-sm hover:brightness-110 transition gold-glow shadow-md shadow-gold-500/10"
          >
            <Calendar className="w-4 h-4" /> Book Table
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gray-400 hover:text-white"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-7 h-7" /> : <MenuIcon className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-800 border-b border-gold-500/20 px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-medium py-2 border-b border-gray-800 ${
                  isActive(link.path) ? 'text-gold-400 font-semibold' : 'text-gray-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold py-2 text-gold-400 flex items-center gap-2"
              >
                <Shield className="w-4 h-4" /> Admin Dashboard
              </Link>
            )}
          </div>

          <div className="pt-4 flex items-center justify-between">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold text-gold-400 flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4" /> Profile ({user?.name})
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-red-400"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-gray-300 hover:text-gold-400 text-sm font-medium"
              >
                <UserIcon className="w-4 h-4" /> Sign In
              </Link>
            )}

            <Link
              to="/reservation"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 rounded-lg bg-gold-500 text-black font-semibold text-xs"
            >
              Reserve Table
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
