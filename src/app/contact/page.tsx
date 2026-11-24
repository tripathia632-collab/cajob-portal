'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Mail, Phone, MapPin, Send, CheckCircle2, ArrowLeft, ArrowUpRight, MessageCircle } from 'lucide-react';
import {
  WHATSAPP_FEEDBACK_NUMBER,
  WHATSAPP_FEEDBACK_URL,
  OFFICIAL_WHATSAPP_CHANNEL_URL,
} from '@/lib/community';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email) return;
    setSubmitting(true);
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          name: form.name,
          source: 'Contact Form Inquiry',
          message: form.subject ? `Subject: ${form.subject} | Message: ${form.message}` : form.message,
        }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F6]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb & Home Link */}
        <nav className="flex items-center gap-2 text-xs text-[#52676D] mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-semibold text-[#52676D] hover:text-[#08765D] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
          <span className="text-[#DCE5E0]">/</span>
          <span className="text-[#102D37] font-semibold">Contact</span>
        </nav>

        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-[#08765D]">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#102D37] tracking-tight mt-2">
            We are here to help
          </h1>
          <p className="text-sm text-[#52676D] mt-2">
            Questions about job listings, employer partnerships, or suggestions for our free resources? Reach out anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white rounded-3xl border border-[#DCE5E0] p-6 sm:p-10 shadow-xs">
          {/* Contact Details */}
          <div className="md:col-span-5 bg-[#102D37] text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Contact Information</h3>
              <p className="text-xs text-[#bad1c5] leading-relaxed">
                Connect directly with the CAJob.in operations and editorial desk.
              </p>

              <div className="space-y-4 text-xs">
                <a
                  href={WHATSAPP_FEEDBACK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[#a7e9d4] hover:text-white transition-colors group p-2.5 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="w-7 h-7 rounded-full bg-[#25D366] text-white flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 fill-current"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-white">Direct WhatsApp (1-on-1 Chat)</div>
                    <div className="text-[11px] text-[#76d7b2]">{WHATSAPP_FEEDBACK_NUMBER}</div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-auto text-[#76d7b2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>

                <a
                  href={OFFICIAL_WHATSAPP_CHANNEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[#a7e9d4] hover:text-white transition-colors group p-2.5 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="w-7 h-7 rounded-full bg-[#174450] text-[#76d7b2] flex items-center justify-center flex-shrink-0 border border-[#2a6575]">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">WhatsApp Broadcast Channel</div>
                    <div className="text-[11px] text-[#bad1c5]">Core Finance for CAs</div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-auto text-[#76d7b2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>

                <div className="flex items-center gap-3 text-[#bad1c5] px-2.5">
                  <Mail className="w-4 h-4 text-[#76d7b2]" />
                  <span>support@cajob.in</span>
                </div>
                <div className="flex items-center gap-3 text-[#bad1c5] px-2.5">
                  <MapPin className="w-4 h-4 text-[#76d7b2]" />
                  <span>Mumbai &amp; Delhi NCR, India</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-[#76d7b2] pt-2 border-t border-white/10">
              Direct line: {WHATSAPP_FEEDBACK_NUMBER} · Average response: within a few hours
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-7">
            {submitted ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#EAF4EF] text-[#08765D] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#102D37]">Message Received</h3>
                <p className="text-xs sm:text-sm text-[#52676D]">
                  Thank you for writing to us. We will get back to you shortly at {form.email}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#52676D] mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Ashish Tripathi"
                    className="w-full px-4 py-2.5 bg-[#F5F7F6] rounded-xl text-sm border border-[#DCE5E0] focus:outline-none focus:border-[#08765D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#52676D] mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 bg-[#F5F7F6] rounded-xl text-sm border border-[#DCE5E0] focus:outline-none focus:border-[#08765D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#52676D] mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Job listing inquiry, resource suggestion..."
                    className="w-full px-4 py-2.5 bg-[#F5F7F6] rounded-xl text-sm border border-[#DCE5E0] focus:outline-none focus:border-[#08765D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#52676D] mb-1.5">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="How can we help?"
                    className="w-full px-4 py-2.5 bg-[#F5F7F6] rounded-xl text-sm border border-[#DCE5E0] focus:outline-none focus:border-[#08765D]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-[#08765D] hover:bg-[#065F4B] disabled:opacity-60 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
