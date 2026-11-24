'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Calculator, ArrowLeft, CheckCircle2, Info, ChevronRight } from 'lucide-react';

export default function ArticleshipStipendCalculatorPage() {
  const [cityTier, setCityTier] = useState<'A' | 'B' | 'C'>('A');
  const [scheme, setScheme] = useState<'new' | 'industrial'>('new');
  const [year, setYear] = useState<'1' | '2'>('1');

  // ICAI minimum stipend rates under new scheme (Regulation 48)
  // Class A: Pop >= 20 Lakhs (e.g. Mumbai, Delhi, Bengaluru, Kolkata, Chennai, Hyderabad, Ahmedabad, Pune)
  // Class B: Pop 4 - 20 Lakhs
  // Class C: Pop < 4 Lakhs
  const stipendTable = {
    new: {
      A: { '1': 4000, '2': 5000 },
      B: { '1': 3000, '2': 4000 },
      C: { '1': 2000, '2': 3000 },
    },
    industrial: {
      A: { '1': 15000, '2': 15000 },
      B: { '1': 15000, '2': 15000 },
      C: { '1': 15000, '2': 15000 },
    },
  };

  const marketBenchmarks = {
    A: {
      Big4: '₹15,000 - ₹25,000 / month',
      Top20: '₹10,000 - ₹18,000 / month',
      MidSize: '₹5,000 - ₹10,000 / month',
    },
    B: {
      Big4: '₹12,000 - ₹20,000 / month',
      Top20: '₹8,000 - ₹14,000 / month',
      MidSize: '₹4,000 - ₹8,000 / month',
    },
    C: {
      Big4: 'N/A',
      Top20: '₹6,000 - ₹10,000 / month',
      MidSize: '₹3,000 - ₹6,000 / month',
    },
  };

  const minStatutoryStipend = stipendTable[scheme][cityTier][year];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F6]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-[#52676D] mb-6">
          <Link href="/" className="hover:text-[#102D37]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/tools" className="hover:text-[#102D37]">Web tools</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#102D37] font-semibold">Stipend Calculator</span>
        </nav>

        <div className="mb-8">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#08765D] hover:underline mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to tools directory
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#102D37] tracking-tight">
            ICAI Articleship & Industrial Training Stipend Calculator
          </h1>
          <p className="text-sm text-[#52676D] mt-2">
            Calculate your official statutory minimum stipend under the latest ICAI Chartered Accountants Regulations and review current market averages.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#DCE5E0] p-6 sm:p-8 space-y-6 shadow-xs">
            {/* 1. Scheme */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#52676D] mb-3">
                1. Select Training Stage
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setScheme('new')}
                  className={`p-4 rounded-xl text-left border transition-all ${
                    scheme === 'new'
                      ? 'border-[#08765D] bg-[#EAF4EF] text-[#102D37]'
                      : 'border-[#DCE5E0] bg-[#F5F7F6] text-[#52676D]'
                  }`}
                >
                  <div className="font-bold text-sm">Articleship</div>
                  <div className="text-xs text-[#52676D] mt-0.5">2-Year Practical Scheme</div>
                </button>
                <button
                  type="button"
                  onClick={() => setScheme('industrial')}
                  className={`p-4 rounded-xl text-left border transition-all ${
                    scheme === 'industrial'
                      ? 'border-[#08765D] bg-[#EAF4EF] text-[#102D37]'
                      : 'border-[#DCE5E0] bg-[#F5F7F6] text-[#52676D]'
                  }`}
                >
                  <div className="font-bold text-sm">Industrial Training</div>
                  <div className="text-xs text-[#52676D] mt-0.5">Corporate (9-12 months)</div>
                </button>
              </div>
            </div>

            {/* 2. City Population Tier */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#52676D] mb-3">
                2. City Tier (Based on Population)
              </label>
              <div className="space-y-2">
                {[
                  {
                    tier: 'A' as const,
                    label: 'Class A: Population 20 Lakhs or more',
                    sub: 'Mumbai, Delhi, Bengaluru, Chennai, Kolkata, Hyderabad, Ahmedabad, Pune, etc.',
                  },
                  {
                    tier: 'B' as const,
                    label: 'Class B: Population 4 Lakhs to 20 Lakhs',
                    sub: 'Jaipur, Lucknow, Chandigarh, Surat, Indore, Nagpur, Patna, etc.',
                  },
                  {
                    tier: 'C' as const,
                    label: 'Class C: Population below 4 Lakhs',
                    sub: 'Other towns, districts and smaller commercial centers.',
                  },
                ].map((c) => (
                  <button
                    key={c.tier}
                    type="button"
                    onClick={() => setCityTier(c.tier)}
                    className={`w-full p-3.5 rounded-xl text-left border transition-all ${
                      cityTier === c.tier
                        ? 'border-[#08765D] bg-[#EAF4EF] text-[#102D37]'
                        : 'border-[#DCE5E0] bg-[#F5F7F6] text-[#52676D]'
                    }`}
                  >
                    <div className="font-semibold text-xs text-[#102D37]">{c.label}</div>
                    <div className="text-[11px] text-[#52676D] mt-0.5">{c.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Year of Training (for Articleship) */}
            {scheme === 'new' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#52676D] mb-3">
                  3. Training Year
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setYear('1')}
                    className={`py-3 px-4 rounded-xl font-bold text-xs text-center border transition-all ${
                      year === '1'
                        ? 'border-[#08765D] bg-[#08765D] text-white'
                        : 'border-[#DCE5E0] bg-[#F5F7F6] text-[#52676D]'
                    }`}
                  >
                    1st Year Articleship
                  </button>
                  <button
                    type="button"
                    onClick={() => setYear('2')}
                    className={`py-3 px-4 rounded-xl font-bold text-xs text-center border transition-all ${
                      year === '2'
                        ? 'border-[#08765D] bg-[#08765D] text-white'
                        : 'border-[#DCE5E0] bg-[#F5F7F6] text-[#52676D]'
                    }`}
                  >
                    2nd Year Articleship
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#102D37] rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#76d7b2]">
                  ICAI Statutory Minimum
                </span>
                <div className="text-4xl font-extrabold text-white mt-1">
                  ₹{minStatutoryStipend.toLocaleString('en-IN')}{' '}
                  <span className="text-sm font-normal text-[#bad1c5]">/ month</span>
                </div>
                <p className="text-xs text-[#bad1c5] mt-2">
                  No employer or CA firm can lawfully disburse below this rate under ICAI regulations.
                </p>
              </div>

              {/* Market Benchmark Range */}
              <div className="pt-6 border-t border-[#1f4e5c] space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#a7e9d4]">
                  Realistic Market Benchmarks ({cityTier === 'A' ? 'Metro' : 'Tier 2/3'}):
                </span>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-[#1b434f]">
                    <span className="text-[#bad1c5]">Big 4 (EY, PwC, Deloitte, KPMG)</span>
                    <span className="font-bold text-white">{marketBenchmarks[cityTier].Big4}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#1b434f]">
                    <span className="text-[#bad1c5]">Top 20 / National Firms</span>
                    <span className="font-bold text-white">{marketBenchmarks[cityTier].Top20}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-[#bad1c5]">Reputed Mid-Size Firms</span>
                    <span className="font-bold text-white">{marketBenchmarks[cityTier].MidSize}</span>
                  </div>
                </div>
              </div>

              {scheme === 'industrial' && (
                <div className="p-3 bg-[#174450] rounded-xl text-xs text-[#bad1c5] space-y-1">
                  <span className="font-bold text-[#76d7b2] block">ICAI Notification Note:</span>
                  Industrial training is permitted for 9 to 12 months after completing at least 12 months of practical training. Minimum ₹15,000/mo.
                </div>
              )}
            </div>

            {/* Quick Link to Open Vacancies */}
            <div className="bg-white rounded-2xl border border-[#DCE5E0] p-6 text-center space-y-3">
              <h3 className="text-sm font-bold text-[#102D37]">
                Ready to find high-stipend openings?
              </h3>
              <p className="text-xs text-[#52676D]">
                Browse actively hiring firms with verified stipend information.
              </p>
              <Link
                href={scheme === 'industrial' ? '/industrial-training' : '/articleship'}
                className="inline-block w-full py-2.5 px-4 bg-[#08765D] hover:bg-[#065F4B] text-white font-semibold text-xs rounded-xl transition-colors"
              >
                View {scheme === 'industrial' ? 'Industrial Training' : 'Articleship'} Openings →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
