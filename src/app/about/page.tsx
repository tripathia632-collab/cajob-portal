import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Target, HeartHandshake, ArrowUpRight, ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | CAJob.in',
  description: 'Learn about the mission, values, and story behind CAJob.in — India’s dedicated CA career destination.',
};

export default function AboutPage() {
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
          <span className="text-[#102D37] font-semibold">About Us</span>
        </nav>

        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-[#08765D]">
            Our Mission
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#102D37] tracking-tight mt-2">
            A clearer path to your next finance career
          </h1>
          <p className="text-sm sm:text-base text-[#52676D] mt-4 leading-relaxed">
            CAJob.in was founded to bring clarity, transparency, and dignity to the CA job search. We connect ambitious students and Chartered Accountants directly with genuine employers.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-3xl border border-[#DCE5E0] p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF4EF] text-[#08765D] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#102D37]">Personally Verified</h3>
            <p className="text-sm text-[#52676D] leading-relaxed">
              Every vacancy is checked against direct employer channels. No ghost jobs, expired listings or fake salary bait.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#DCE5E0] p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF4EF] text-[#08765D] flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#102D37]">Specialized Focus</h3>
            <p className="text-sm text-[#52676D] leading-relaxed">
              Tailored specifically to the Chartered Accountancy ecosystem: ICAI stipend norms, articleship transfer policies, and corporate industrial training.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#DCE5E0] p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF4EF] text-[#08765D] flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#102D37]">Zero Fee to Candidates</h3>
            <p className="text-sm text-[#52676D] leading-relaxed">
              Applying for jobs and accessing career guides, templates and calculators is and will always remain completely free.
            </p>
          </div>
        </div>

        {/* The Gate story */}
        <div className="bg-[#102D37] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center gap-8 mb-16">
          <div className="w-20 h-24 flex-shrink-0 relative">
            <Image
              src="/brand/doorway-icon.png"
              alt="Doorway"
              width={80}
              height={96}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-white">The Doorway to Your Next Chapter</h2>
            <p className="text-sm text-[#bad1c5] leading-relaxed">
              Our emblem is an open gateway — symbolizing access to opportunity, career progression, and entering the professional world with confidence.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
