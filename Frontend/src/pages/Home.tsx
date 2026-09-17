import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/home/Hero';
import { getHealthStatus } from '../services/api';
import { HealthStatus } from '../types';
import { Activity, Server, Database, CheckCircle, AlertCircle } from 'lucide-react';

export const Home: React.FC = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        setLoading(true);
        const res = await getHealthStatus();
        if (res.data) {
          setHealth(res.data);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Banner */}
      <Hero />

      {/* Chef's Special Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 border border-gold-500/30 bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/20 text-gold-400 text-xs font-bold uppercase tracking-widest border border-gold-500/40">
                ⭐ Chef's Signature Special of the Day
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-100">
                28-Day Dry-Aged <span className="text-gold-gradient">Prime Ribeye Steak</span>
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed font-light">
                Hand-selected 300g Angus ribeye seared with rosemary garlic butter, served alongside white truffle mashed potato purée and aged Bordeaux red wine reduction.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="bg-dark-950 px-4 py-2 rounded-xl border border-gold-500/30">
                  <span className="text-[10px] text-gray-400 block uppercase">Special Price</span>
                  <span className="text-xl font-serif font-bold text-gold-400">₹950</span>
                </div>
                <div className="bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  🎁 Use Code <span className="underline">DARKNIGHT20</span> for 20% OFF
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/menu"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-500 text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition gold-glow"
                >
                  Order Chef Special Now
                </Link>
              </div>
            </div>

            <div className="relative group">
              <img
                src="https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&q=80&w=800"
                alt="Prime Ribeye Steak"
                className="w-full h-72 object-cover rounded-2xl border border-gold-500/20 shadow-2xl group-hover:scale-[1.02] transition duration-300"
              />
              <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-gold-500/40 text-xs font-bold text-gold-400">
                🔥 Highly Requested
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="glass-card rounded-2xl p-6 border border-gold-500/20">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
            <div className="flex items-center gap-2 text-gold-400 font-semibold text-sm uppercase tracking-wider">
              <Activity className="w-4 h-4" /> System Initialization (Phase 1)
            </div>
            <span className="text-xs text-gray-500">Live Status Monitor</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Express Server State */}
            <div className="flex items-center gap-4 bg-dark-900/60 p-4 rounded-xl border border-gray-800">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Backend REST API</p>
                <p className="text-sm font-bold text-gray-200">Express Node.js TS</p>
              </div>
            </div>

            {/* Database State */}
            <div className="flex items-center gap-4 bg-dark-900/60 p-4 rounded-xl border border-gray-800">
              <div className="w-10 h-10 rounded-lg bg-gold-500/10 text-gold-400 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">MongoDB Database</p>
                <p className="text-sm font-bold text-gray-200">
                  {loading ? 'Checking...' : health?.database === 'connected' ? 'Connected' : 'Configured / Ready'}
                </p>
              </div>
            </div>

            {/* Overall Health Signal */}
            <div className="flex items-center gap-4 bg-dark-900/60 p-4 rounded-xl border border-gray-800">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${error ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                {error ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">API Health Status</p>
                <p className="text-sm font-bold text-gray-200">
                  {loading ? 'Ping API...' : error ? 'Offline (Start Backend)' : 'Online & Ready'}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
