import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Phone, Mail, MapPin, Clock, Instagram, Facebook, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-800 border-t border-gold-500/10 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-black font-bold">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-wider text-gray-100">GOTHAM</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Where culinary artistry meets dark elegance. Experience modern fine dining crafted with passion and world-class ingredients.
            </p>
            <div className="flex items-center gap-4 text-gray-400 pt-2">
              <a href="#" className="hover:text-gold-400 transition" aria-label="Instagram"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-gold-400 transition" aria-label="Facebook"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-gold-400 transition" aria-label="Twitter"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-gray-100 mb-4 border-b border-gold-500/20 pb-2">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-gold-400 transition">Home</Link></li>
              <li><Link to="/menu" className="hover:text-gold-400 transition">Our Menu</Link></li>
              <li><Link to="/about" className="hover:text-gold-400 transition">About Us</Link></li>
              <li><Link to="/reservation" className="hover:text-gold-400 transition">Book a Table</Link></li>
              <li><Link to="/contact" className="hover:text-gold-400 transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-gray-100 mb-4 border-b border-gold-500/20 pb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold-500" /> Opening Hours
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between"><span className="text-gray-300">Mon – Thu:</span> <span>5:00 PM – 11:00 PM</span></li>
              <li className="flex justify-between"><span className="text-gray-300">Fri – Sat:</span> <span>5:00 PM – 12:00 AM</span></li>
              <li className="flex justify-between"><span className="text-gray-300">Sunday:</span> <span>4:00 PM – 10:00 PM</span></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-gray-100 mb-4 border-b border-gold-500/20 pb-2">Get in Touch</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                <span>100 Wayne Manor Blvd, Gotham City</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold-500 shrink-0" />
                <span>+1 (555) 468-4261</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold-500 shrink-0" />
                <span>reservations@gothamrestaurant.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Gotham Restaurant. All Rights Reserved. Crafted for Culinary Perfection.</p>
        </div>
      </div>
    </footer>
  );
};
