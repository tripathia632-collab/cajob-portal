'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Mail, Phone, MapPin, Send, CheckCircle2, ArrowLeft } from 'lucide-react';

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
                <div className="flex items-center gap-3 text-[#bad1c5]">
                  <Mail className="w-4 h-4 text-[#76d7b2]" />
                  <span>support@cajob.in</span>
                </div>
                <div className="flex items-center gap-3 text-[#bad1c5]">
                  <MapPin className="w-4 h-4 text-[#76d7b2]" />
                  <span>Mumbai & Delhi NCR, India</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-[#76d7b2]">
              Average response time: within 24 hours
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
                  Thank you for writing to us. Our team will get back to you shortly at {form.email}.
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
