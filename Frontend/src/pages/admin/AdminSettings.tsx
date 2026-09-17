import React, { useEffect, useState } from 'react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Loading } from '../../components/common/Loading';
import { getSettings, updateSettings } from '../../services/settingsService';
import { RestaurantSettings } from '../../types';
import { Settings, Save, Check, AlertCircle } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await getSettings();
        if (res.success && res.data) {
          setSettings(res.data);
        } else {
          setError(res.message || 'Failed to fetch settings');
        }
      } catch (err: unknown) {
        const errorObj = err as { response?: { data?: { message?: string } } };
        setError(errorObj.response?.data?.message || 'Error loading settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setSaving(true);
      setError(null);
      setSuccessMsg(null);
      const res = await updateSettings(settings);
      if (res.success && res.data) {
        setSettings(res.data);
        setSuccessMsg('Restaurant configuration saved successfully!');
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        setError(res.message || 'Failed to update settings');
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message || 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 pb-16">
      <AdminHeader />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-serif font-bold text-gray-100 flex items-center space-x-3">
              <Settings className="w-7 h-7 text-gold-400" />
              <span>Restaurant Settings</span>
            </h2>
            <p className="text-sm text-gray-400">Configure business information, taxes, and service fees</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 flex items-center space-x-2 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 flex items-center space-x-2 text-sm">
            <Check className="w-5 h-5 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {loading ? (
          <Loading message="Loading configuration settings..." />
        ) : settings ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* General Info */}
            <div className="bg-dark-800 border border-gold-500/20 rounded-xl p-6 shadow-xl space-y-4">
              <h3 className="text-lg font-serif font-bold text-gold-400 border-b border-dark-700 pb-2">
                Brand & Identity
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.restaurantName}
                    onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })}
                    className="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  required
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                  Tagline / Description
                </label>
                <textarea
                  rows={2}
                  value={settings.description || ''}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                  className="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            {/* Fees & Charges */}
            <div className="bg-dark-800 border border-gold-500/20 rounded-xl p-6 shadow-xl space-y-4">
              <h3 className="text-lg font-serif font-bold text-gold-400 border-b border-dark-700 pb-2">
                Order Financial Rules
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={settings.taxPercentage}
                    onChange={(e) => setSettings({ ...settings, taxPercentage: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                    Delivery Fee (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={settings.deliveryCharge}
                    onChange={(e) => setSettings({ ...settings, deliveryCharge: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                    Currency Symbol
                  </label>
                  <input
                    type="text"
                    value={settings.currency}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                    className="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center space-x-2 bg-gold-500 hover:bg-gold-600 text-dark-900 font-bold px-6 py-3 rounded-xl transition-colors shadow-lg disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                <span>{saving ? 'Saving Settings...' : 'Save Configuration'}</span>
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
};
