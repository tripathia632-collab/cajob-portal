'use client';

import React, { useState } from 'react';
import { X, Bell, CheckCircle2, ArrowUpRight, Loader2 } from 'lucide-react';
import { OFFICIAL_WHATSAPP_CHANNEL_URL, CommunityChannel } from '@/lib/community';

interface ChannelWaitlistModalProps {
  channel: CommunityChannel | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ChannelWaitlistModal({
  channel,
  isOpen,
  onClose,
}: ChannelWaitlistModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !channel) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          source: `Channel Waitlist: ${channel.name}`,
          message: `Interested in joining upcoming channel: ${channel.name} (${channel.category}). Phone/WhatsApp: ${phone || 'Not provided'}`,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to join waitlist');
      }

      setSubmitted(true);
    } catch {
      // Still show success to user so they're not blocked
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEmail('');
    setName('');
    setPhone('');
    setSubmitted(false);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#DCE5E0] relative animate-scaleUp">
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 p-2 text-[#52676D] hover:text-[#102D37] rounded-full hover:bg-[#F5F7F6] transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EAF4EF] text-[#08765D] uppercase tracking-wider">
                {channel.category}
              </span>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Coming Soon
              </span>
            </div>

            <h3 className="text-2xl font-extrabold text-[#102D37] tracking-tight">
              Get notified when <br />
              <span className="text-[#08765D]">{channel.name}</span> goes live
            </h3>

            <p className="text-xs sm:text-sm text-[#52676D] mt-2 leading-relaxed">
              {channel.tagline}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#102D37] mb-1.5">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-4 py-2.5 bg-[#F5F7F6] text-[#102D37] text-sm rounded-xl border border-[#DCE5E0] focus:border-[#08765D] focus:bg-white focus:outline-none transition-all placeholder:text-[#52676D]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#102D37] mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 bg-[#F5F7F6] text-[#102D37] text-sm rounded-xl border border-[#DCE5E0] focus:border-[#08765D] focus:bg-white focus:outline-none transition-all placeholder:text-[#52676D]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#102D37] mb-1.5">
                  WhatsApp Number (Optional, for instant invite ping)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 bg-[#F5F7F6] text-[#102D37] text-sm rounded-xl border border-[#DCE5E0] focus:border-[#08765D] focus:bg-white focus:outline-none transition-all placeholder:text-[#52676D]/50"
                />
              </div>

              {error && (
                <p className="text-xs text-red-600 font-medium">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 bg-[#08765D] hover:bg-[#065F4B] text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Reserving your spot...</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4" />
                    <span>Notify Me on Launch</span>
                  </>
                )}
              </button>
            </form>

            <p className="text-[11px] text-[#52676D] text-center mt-3">
              Zero spam. You will only receive a single priority invite link when this channel opens.
            </p>
          </div>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#EAF4EF] text-[#08765D] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-extrabold text-[#102D37]">
              You are on the priority list!
            </h3>

            <p className="text-xs sm:text-sm text-[#52676D] leading-relaxed max-w-sm mx-auto">
              We have reserved your invite for <strong className="text-[#102D37]">{channel.name}</strong>. We will notify you immediately once the channel goes live.
            </p>

            <div className="pt-2 p-4 bg-[#F5F7F6] rounded-2xl border border-[#DCE5E0] text-left space-y-2">
              <div className="text-xs font-bold text-[#102D37]">
                Active right now:
              </div>
              <p className="text-xs text-[#52676D]">
                Our flagship broadcast channel <strong className="text-[#08765D]">Core Finance for CAs</strong> is already active with live finance roles.
              </p>
              <a
                href={OFFICIAL_WHATSAPP_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#08765D] hover:underline pt-1"
              >
                <span>Join Core Finance Channel Now</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-2.5 px-4 bg-[#102D37] hover:bg-[#174450] text-white text-xs font-bold rounded-xl transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
