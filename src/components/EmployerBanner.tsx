'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

export function EmployerBanner() {
  return (
    <section className="py-16 bg-[#102D37] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#173e4a] to-[#102D37] rounded-3xl p-8 sm:p-12 border border-[#2a6575] flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-bold tracking-widest uppercase text-[#76d7b2]">
              For employers & firms
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Hire finance talent. Build what&apos;s next.
            </h2>
            <p className="text-sm sm:text-base text-[#bad1c5] leading-relaxed">
              Reach motivated CA students, eligible industrial trainees, and experienced Chartered Accountants in one dedicated destination.
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link
              href="/for-employers"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-[#102D37] hover:bg-[#EAF4EF] font-bold text-sm rounded-xl transition-all shadow-md hover:scale-105"
            >
              Post an opportunity
              <ArrowUpRight className="w-4 h-4 text-[#08765D]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'Opportunity Alerts & Newsletter',
          message: 'Subscribed to verified CA opportunity alerts.',
        }),
      });
      setSubscribed(true);
      setEmail('');
    } catch {
      setSubscribed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-[#F5F7F6] border-t border-[#DCE5E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#DCE5E0] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102D37] tracking-tight">
              Good opportunities. Straight to your inbox.
            </h2>
            <p className="text-sm text-[#52676D]">
              Career insights and verified vacancy updates. Zero spam, unsubscribe anytime.
            </p>
          </div>

          <div className="lg:col-span-6">
            {subscribed ? (
              <div className="flex items-center gap-2 p-4 bg-[#EAF4EF] text-[#08765D] rounded-xl text-sm font-semibold border border-[#bcdbc8]">
                <CheckCircle2 className="w-5 h-5" />
                Thank you! You are now subscribed to verified CA opportunity alerts.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 bg-[#F5F7F6] border border-[#DCE5E0] rounded-xl text-sm text-[#102D37] focus:outline-none focus:border-[#08765D] focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#08765D] hover:bg-[#065F4B] text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  Keep me in the loop
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
