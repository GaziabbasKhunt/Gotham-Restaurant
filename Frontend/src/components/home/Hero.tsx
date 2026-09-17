import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Utensils, Award, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 py-20 px-4">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5" /> Michelin Standard Gastronomy
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-gray-100 tracking-tight leading-tight">
          Where <span className="text-gold-gradient">Dark Elegance</span> Meets Culinary Passion
        </h1>

        {/* Subtitle */}
        <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto font-light leading-relaxed">
          Indulge in a symphony of refined flavors, bespoke cocktails, and unforgettable atmospheres handcrafted by Gotham's master chefs.
        </p>

        {/* CTA Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/reservation"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold text-base hover:brightness-110 transition gold-glow shadow-xl shadow-gold-500/20 flex items-center justify-center gap-3"
          >
            <Calendar className="w-5 h-5" /> Reserve Your Table
          </Link>
          <Link
            to="/menu"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-dark-800/80 hover:bg-dark-700 text-gray-200 border border-gold-500/30 hover:border-gold-500 font-semibold text-base transition flex items-center justify-center gap-3"
          >
            <Utensils className="w-5 h-5 text-gold-400" /> Explore Menu
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-16 border-t border-gold-500/10 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 text-gray-400 text-sm">
            <Award className="w-5 h-5 text-gold-500 shrink-0" />
            <span>Award-Winning Chefs</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-gray-400 text-sm">
            <Utensils className="w-5 h-5 text-gold-500 shrink-0" />
            <span>Farm-to-Table Ingredients</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-gray-400 text-sm">
            <Sparkles className="w-5 h-5 text-gold-500 shrink-0" />
            <span>Exclusive Wine Cellar</span>
          </div>
        </div>

      </div>
    </section>
  );
};
