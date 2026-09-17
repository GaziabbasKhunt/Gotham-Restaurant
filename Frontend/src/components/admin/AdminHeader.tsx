import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Layers,
  CalendarCheck,
  Grid,
  Star,
  Users,
  Settings,
  ShieldCheck
} from 'lucide-react';

export const AdminHeader: React.FC = () => {
  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { to: '/admin/menu', label: 'Menu Items', icon: UtensilsCrossed },
    { to: '/admin/categories', label: 'Categories', icon: Layers },
    { to: '/admin/reservations', label: 'Reservations', icon: CalendarCheck },
    { to: '/admin/tables', label: 'Tables', icon: Grid },
    { to: '/admin/reviews', label: 'Reviews', icon: Star },
    { to: '/admin/customers', label: 'Customers', icon: Users },
    { to: '/admin/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="bg-dark-800 border-b border-gold-500/20 mb-8 sticky top-0 z-30 shadow-lg backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4 border-b border-dark-700/50">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-7 h-7 text-gold-400" />
            <div>
              <h1 className="text-xl font-serif font-bold text-gray-100">Gotham Command Center</h1>
              <p className="text-xs text-gold-400">Management & Operational Portal</p>
            </div>
          </div>
          <NavLink
            to="/"
            className="text-xs text-gray-400 hover:text-gold-400 transition-colors border border-dark-700 px-3 py-1.5 rounded-lg hover:border-gold-500/40"
          >
            &larr; Return to Main Site
          </NavLink>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-gold-500/20">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-gold-500/20 text-gold-400 border border-gold-500/40 shadow-sm'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-dark-700/50'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};
