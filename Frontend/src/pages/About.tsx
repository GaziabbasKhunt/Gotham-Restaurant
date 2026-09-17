import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Award, Utensils, GlassWater, Calendar } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" /> Our Culinary Heritage
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif font-bold text-gray-100">
          The Story of <span className="text-gold-gradient">Gotham</span>
        </h1>
        <p className="text-gray-300 text-lg font-light leading-relaxed">
          Born out of a obsession for dark elegance and culinary perfection, Gotham Restaurant stands as a beacon of fine dining excellence.
        </p>
      </div>

      {/* Grid Story Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-serif font-bold text-gray-100">
            A Symphony of Flavour & Atmosphere
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Every dish at Gotham Restaurant is crafted with surgical precision. From 28-day dry-aged Angus steaks and wild truffle risotto to artisanal Neapolitan sourdough pizzas, our menu reflects global inspiration fused with local farm-to-table ingredients.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Our sommelier curates an exclusive cellar of over 500 rare vintages, paired with bespoke mixology cocktails smoked with charred oak and botanical bitters.
          </p>
          <div className="pt-2">
            <Link
              to="/reservation"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gold-500 text-black font-bold text-sm gold-glow transition"
            >
              <Calendar className="w-4 h-4" /> Book Your Table
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="glass-card rounded-2xl overflow-hidden border border-gold-500/20 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=800"
              alt="Gotham Restaurant Interior"
              className="w-full h-80 object-cover"
            />
            <div className="p-6 space-y-2">
              <h3 className="font-serif font-bold text-lg text-gray-100">The Dining Chamber</h3>
              <p className="text-gray-400 text-xs">
                Featuring ambient warm lighting, Italian leather banquettes, and private VIP alcoves.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pillars of Excellence */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card rounded-2xl p-6 border border-gray-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-gray-100">Michelin Standards</h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            Led by world-renowned chefs dedicated to innovation and uncompromising quality.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-gray-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center mx-auto">
            <Utensils className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-gray-100">Fresh Ingredients</h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            Organic produce, fresh seafood, and heritage livestock sourced directly daily.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-gray-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center mx-auto">
            <GlassWater className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-gray-100">Sommelier Cellar</h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            Hand-selected vintage wines and artisanal mixology cocktails.
          </p>
        </div>
      </div>

    </div>
  );
};
