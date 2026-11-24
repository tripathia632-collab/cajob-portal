'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sparkles, CheckCircle2, ArrowUpRight, BookOpen, Clock, ArrowLeft } from 'lucide-react';

export default function CoursesPage() {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setJoined(true);
  };

  const upcomingCourses = [
    {
      title: 'Practical Financial Modelling & Valuation',
      desc: 'Build dynamic 3-statement models, DCF valuations, and LBO models from real financial statements.',
      duration: '4 Weeks · Hands-on Projects',
      tag: 'Finance & Deals',
    },
    {
      title: 'Advanced Statutory Audit Workpapers & Documentation',
      desc: 'Master CARO 2020, risk assessment procedures, materiality benchmarks, and Big 4 style audit documentation.',
      duration: '3 Weeks · Case Studies',
      tag: 'Audit & Assurance',
    },
    {
      title: 'Corporate Direct Tax & Transfer Pricing Masterclass',
      desc: 'Real-world tax computations, litigation drafts, TP benchmarking, and international tax treaties.',
      duration: '3 Weeks · Practical Workings',
      tag: 'Direct Taxation',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F6]">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
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
          <span className="text-[#102D37] font-semibold">Courses</span>
        </nav>

        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-[#EAF4EF] text-[#08765D] border border-[#bcdbc8]">
            Coming Soon · Cohort 1
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#102D37] tracking-tight mt-4">
            Practical skills that make you immediately employable
          </h1>
          <p className="text-sm sm:text-base text-[#52676D] mt-3">
            Industry-designed, practitioner-led courses built to bridge the gap between CA exams and real-world finance roles.
          </p>
        </div>

        {/* Waitlist Box */}
        <div className="bg-[#102D37] rounded-3xl p-8 sm:p-12 text-white max-w-2xl mx-auto mb-16 shadow-xl text-center space-y-4">
          <Sparkles className="w-8 h-8 text-[#76d7b2] mx-auto" />
          <h2 className="text-2xl font-bold text-white">Join the Early Access Waitlist</h2>
          <p className="text-xs sm:text-sm text-[#bad1c5] max-w-md mx-auto">
            Get exclusive early bird tuition discounts and priority access to limited cohort seats when we open enrollment.
          </p>

          {joined ? (
            <div className="p-4 bg-[#174450] text-[#76d7b2] rounded-xl text-xs font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              You are on the priority waitlist! We will alert you upon cohort launch.
            </div>
          ) : (
            <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white placeholder:text-white/50 border border-white/20 text-sm focus:outline-none focus:border-[#76d7b2]"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#08765D] hover:bg-[#065F4B] text-white font-bold text-sm rounded-xl transition-colors whitespace-nowrap"
              >
                Join Waitlist
              </button>
            </form>
          )}
        </div>

        {/* Upcoming Syllabus Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingCourses.map((c) => (
            <div key={c.title} className="bg-white rounded-3xl border border-[#DCE5E0] p-6 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EAF4EF] text-[#08765D]">
                {c.tag}
              </span>
              <h3 className="text-lg font-bold text-[#102D37]">{c.title}</h3>
              <p className="text-xs text-[#52676D] leading-relaxed">{c.desc}</p>
              <div className="pt-3 border-t border-[#F0F4F2] flex items-center gap-1.5 text-xs text-[#52676D]">
                <Clock className="w-3.5 h-3.5 text-[#08765D]" />
                <span>{c.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
