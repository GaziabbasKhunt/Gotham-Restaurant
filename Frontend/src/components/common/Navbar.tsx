import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { getMenuItems } from '../../services/menuService';
import { UtensilsCrossed, Calendar, ShoppingBag, User as UserIcon, Menu as MenuIcon, X, LogOut, Shield, Award, Heart } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalCount } = useCart();
  const location = useLocation();

  useEffect(() => {
    const updateFavs = async () => {
      const saved: string[] = JSON.parse(localStorage.getItem('gotham_favorites') || '[]');
      if (saved.length === 0) {
        setFavoriteCount(0);
        return;
      }
      try {
        const res = await getMenuItems({ limit: 100 });
        if (res.data) {
          const validIds = new Set(res.data.map((item) => item._id));
          const activeFavorites = saved.filter((id) => validIds.has(id));
          if (activeFavorites.length !== saved.length) {
            localStorage.setItem('gotham_favorites', JSON.stringify(activeFavorites));
          }
          setFavoriteCount(activeFavorites.length);
        } else {
          setFavoriteCount(saved.length);
        }
      } catch {
        setFavoriteCount(saved.length);
      }
    };
    updateFavs();
    window.addEventListener('gotham_favorites_updated', updateFavs);
    return () => window.removeEventListener('gotham_favorites_updated', updateFavs);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'About', path: '/about' },
    { name: 'Reservations', path: '/reservation' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full bg-dark-900/90 backdrop-blur-lg border-b border-gold-500/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo with Smooth Rotate & Scale */}
        <Link
          to="/"
          className="flex items-center gap-3 group transition-transform duration-300 active:scale-95"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-700 flex items-center justify-center text-black font-bold shadow-lg shadow-gold-500/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 ease-out">
            <UtensilsCrossed className="w-5 h-5 text-black group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-wider text-gray-100 group-hover:text-gold-400 transition-colors duration-300">
              GOTHAM
            </span>
            <span className="text-[10px] tracking-[0.25em] text-gold-500 uppercase -mt-1 font-medium group-hover:text-gold-300 transition-colors duration-300">
              Fine Dining
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links with Smooth Sliding Active Underline */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`group relative text-sm font-medium transition-all duration-200 py-1.5 px-1 hover:scale-105 active:scale-95 ${
                  active ? 'text-gold-400 font-semibold' : 'text-gray-300 hover:text-gold-300'
                }`}
              >
                <span>{link.name}</span>
                
                {/* Underline Indicator Animation */}
                <span
                  className={`absolute bottom-0 left-0 h-[2.5px] bg-gradient-to-r from-gold-400 to-amber-500 rounded-full transition-all duration-300 ease-out ${
                    active
                      ? 'w-full opacity-100 scale-x-100 shadow-sm shadow-gold-500/50'
                      : 'w-0 opacity-0 scale-x-0 group-hover:w-full group-hover:opacity-75 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            );
          })}
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="text-xs font-bold uppercase tracking-wider text-gold-400 bg-gold-500/10 hover:bg-gold-500/20 px-3.5 py-1.5 rounded-lg border border-gold-500/30 transition-all duration-200 hover:scale-105 active:scale-95 hover:border-gold-500 flex items-center gap-1.5 shadow-sm"
            >
              <Shield className="w-3.5 h-3.5 animate-pulse" /> Admin Panel
            </Link>
          )}
        </nav>

        {/* Action Buttons with Interactive Spring Effects */}
        <div className="hidden md:flex items-center gap-3.5">
          
          {/* Favorites Heart Icon */}
          <Link
            to="/menu"
            className="p-2.5 rounded-full bg-dark-800/80 text-gray-300 hover:text-red-400 border border-gray-800 hover:border-red-500/40 hover:bg-red-500/10 hover:shadow-lg hover:shadow-red-500/15 transition-all duration-200 hover:scale-110 active:scale-90 relative group"
            aria-label="Favorites"
            title="My Favorite Dishes"
          >
            <Heart className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${favoriteCount > 0 ? 'fill-red-500 text-red-500 animate-pulse' : ''}`} />
            {favoriteCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                {favoriteCount}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="p-2.5 rounded-full bg-dark-800/80 text-gray-300 hover:text-gold-400 border border-gray-800 hover:border-gold-500/40 hover:bg-gold-500/10 hover:shadow-lg hover:shadow-gold-500/15 transition-all duration-200 hover:scale-110 active:scale-90 relative group"
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5 transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold-500 text-black text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                {totalCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {/* VIP Points Pill */}
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-gold-500/10 to-amber-500/10 border border-gold-500/30 text-gold-400 text-xs font-medium hover:border-gold-400 hover:bg-gold-500/20 transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm"
                title={`${user?.loyaltyTier || 'Bronze Gargoyle'} VIP Member`}
              >
                <Award className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
                <span className="font-bold">{user?.loyaltyPoints || 0} Pts</span>
              </Link>

              {/* Profile Pill */}
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-dark-800 text-gray-200 border border-gray-800 hover:border-gold-500/40 hover:text-gold-300 transition-all duration-200 hover:scale-105 active:scale-95 text-xs font-medium shadow-sm"
              >
                <div className="w-6 h-6 rounded-full bg-gold-500 text-black font-bold flex items-center justify-center text-[10px] shadow-sm">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium">{user?.name.split(' ')[0]}</span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="p-2 rounded-full bg-dark-800 text-gray-400 hover:text-red-400 border border-gray-800 hover:border-red-500/30 hover:bg-red-500/10 transition-all duration-200 hover:scale-110 active:scale-90"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="p-2.5 rounded-full bg-dark-800/80 text-gray-300 hover:text-gold-400 border border-gray-800 hover:border-gold-500/30 transition-all duration-200 hover:scale-110 active:scale-90"
              aria-label="Account"
            >
              <UserIcon className="w-5 h-5" />
            </Link>
          )}

          {/* Book Table Golden CTA Button */}
          <Link
            to="/reservation"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-black font-semibold text-sm hover:brightness-110 hover:shadow-xl hover:shadow-gold-500/25 transition-all duration-300 ease-out hover:scale-105 active:scale-95 gold-glow shadow-md shadow-gold-500/10 group"
          >
            <Calendar className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" /> Book Table
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gray-400 hover:text-white transition-all duration-200 hover:scale-110 active:scale-90"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-7 h-7" /> : <MenuIcon className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Drawer with Smooth Fade-in */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-800/95 backdrop-blur-xl border-b border-gold-500/20 px-6 py-6 space-y-4 animate-fade-in transition-all duration-300">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-medium py-2 border-b border-gray-800/80 transition-all duration-200 hover:pl-2 active:scale-98 ${
                  isActive(link.path) ? 'text-gold-400 font-semibold' : 'text-gray-300 hover:text-gold-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold py-2 text-gold-400 flex items-center gap-2 transition-all duration-200 hover:pl-2"
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
                  className="text-sm font-semibold text-gold-400 flex items-center gap-2 hover:scale-105 transition duration-200"
                >
                  <UserIcon className="w-4 h-4" /> Profile ({user?.name})
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-red-400 hover:underline"
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
              className="px-4 py-2 rounded-lg bg-gold-500 text-black font-semibold text-xs hover:scale-105 active:scale-95 transition duration-200"
            >
              Reserve Table
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
