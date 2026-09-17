import React, { useState } from 'react';
import { submitContactForm } from '../services/contactService';
import { Mail, Phone, MapPin, Clock, Send, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!name || !email || !subject || !message) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      await submitContactForm({
        name,
        email,
        phone: phone || undefined,
        subject,
        message
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setError((err as Error).message || 'Failed to submit message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" /> We Value Your Inquiries
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-100">
          Contact <span className="text-gold-gradient">Gotham</span>
        </h1>
        <p className="text-gray-400 text-base font-light leading-relaxed">
          Have a question about our menu, private events, or table reservations? Reach out to our concierge team.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Details Cards */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-gray-800 space-y-4">
            <h3 className="font-serif font-bold text-lg text-gray-100 border-b border-gray-800 pb-3">
              Location & Details
            </h3>

            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-100">Gotham Restaurant</p>
                  <p className="text-xs text-gray-400">100 Wayne Manor Blvd, Gotham City, NY 10001</p>
                </div>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold-500 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Telephone</p>
                  <p className="font-semibold text-gray-100">+1 (555) 468-4261</p>
                </div>
              </li>

              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold-500 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Email Address</p>
                  <p className="font-semibold text-gray-100">reservations@gothamrestaurant.com</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-gray-800 space-y-3">
            <h3 className="font-serif font-bold text-lg text-gray-100 flex items-center gap-2 border-b border-gray-800 pb-3">
              <Clock className="w-5 h-5 text-gold-500" /> Opening Hours
            </h3>
            <ul className="space-y-2 text-xs text-gray-300">
              <li className="flex justify-between">
                <span>Mon – Thu:</span>
                <span className="font-semibold text-gray-100">5:00 PM – 11:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Fri – Sat:</span>
                <span className="font-semibold text-gray-100">5:00 PM – 12:00 AM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday:</span>
                <span className="font-semibold text-gray-100">4:00 PM – 10:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right 2 Cols: Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8 border border-gold-500/20 space-y-5 shadow-2xl">
            <h2 className="text-2xl font-serif font-bold text-gray-100">Send Us a Message</h2>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3 text-red-400 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3 text-emerald-400 text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Thank you! Your message has been sent to our concierge team.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Bruce Wayne"
                  className="w-full px-4 py-3 bg-dark-900/80 border border-gray-800 rounded-xl text-gray-100 focus:outline-none focus:border-gold-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="bruce@wayneenterprises.com"
                  className="w-full px-4 py-3 bg-dark-900/80 border border-gray-800 rounded-xl text-gray-100 focus:outline-none focus:border-gold-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 468-4261"
                  className="w-full px-4 py-3 bg-dark-900/80 border border-gray-800 rounded-xl text-gray-100 focus:outline-none focus:border-gold-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Private Event Inquiry / Feedback"
                  className="w-full px-4 py-3 bg-dark-900/80 border border-gray-800 rounded-xl text-gray-100 focus:outline-none focus:border-gold-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Message Body *
              </label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can our culinary team assist you today?"
                className="w-full p-4 bg-dark-900/80 border border-gray-800 rounded-xl text-gray-100 focus:outline-none focus:border-gold-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold hover:brightness-110 transition duration-200 gold-glow shadow-xl text-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Sending Message...' : 'Send Message'}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
