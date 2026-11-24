'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Calculator, ArrowLeft, ChevronRight, CheckCircle2, IndianRupee, Sparkles, TrendingUp } from 'lucide-react';

export default function CAInHandSalaryEstimatorPage() {
  const [ctc, setCtc] = useState<number>(1200000); // 12 LPA default
  const [variablePercent, setVariablePercent] = useState<number>(10); // 10% bonus
  const [regime, setRegime] = useState<'new' | 'old'>('new');

  // CTC Breakup logic
  const annualCtc = Number(ctc) || 0;
  const variablePay = Math.round(annualCtc * (variablePercent / 100));
  const fixedCtc = annualCtc - variablePay;

  // Basic is typically 40% of fixed CTC
  const basicAnnual = Math.round(fixedCtc * 0.4);
  const hraAnnual = Math.round(basicAnnual * 0.5); // 50% of basic
  const specialAllowanceAnnual = Math.max(0, fixedCtc - basicAnnual - hraAnnual);

  // Deductions
  // Employee PF is 12% of Basic (capped or uncapped)
  const employeePfAnnual = Math.round(basicAnnual * 0.12);
  const professionalTaxAnnual = 2400; // standard approx ₹200/month

  // Tax computation under New Tax Regime (Budget 2024 / current slabs)
  // Standard deduction = ₹75,000
  const standardDeduction = regime === 'new' ? 75000 : 50000;
  const taxableIncome = Math.max(0, fixedCtc - standardDeduction - employeePfAnnual);

  let annualTax = 0;
  if (regime === 'new') {
    // Slabs: 0-3L nil, 3-7L 5%, 7-10L 10%, 10-12L 15%, 12-15L 20%, >15L 30%
    // Rebate u/s 87A up to 7L (effectively nil tax up to 7.75L with std deduction)
    if (taxableIncome <= 700000) {
      annualTax = 0;
    } else {
      if (taxableIncome > 300000) annualTax += Math.min(400000, taxableIncome - 300000) * 0.05;
      if (taxableIncome > 700000) annualTax += Math.min(300000, taxableIncome - 700000) * 0.10;
      if (taxableIncome > 1000000) annualTax += Math.min(200000, taxableIncome - 1000000) * 0.15;
      if (taxableIncome > 1200000) annualTax += Math.min(300000, taxableIncome - 1200000) * 0.20;
      if (taxableIncome > 1500000) annualTax += (taxableIncome - 1500000) * 0.30;
      // 4% cess
      annualTax = Math.round(annualTax * 1.04);
    }
  } else {
    // Old regime (assuming basic 80C of 1.5L)
    const oldTaxable = Math.max(0, fixedCtc - standardDeduction - 150000);
    if (oldTaxable <= 500000) {
      annualTax = 0;
    } else {
      if (oldTaxable > 250000) annualTax += Math.min(250000, oldTaxable - 250000) * 0.05;
      if (oldTaxable > 500000) annualTax += Math.min(500000, oldTaxable - 500000) * 0.20;
      if (oldTaxable > 1000000) annualTax += (oldTaxable - 1000000) * 0.30;
      annualTax = Math.round(annualTax * 1.04);
    }
  }

  // Monthly breakdown
  const monthlyGross = Math.round(fixedCtc / 12);
  const monthlyPf = Math.round(employeePfAnnual / 12);
  const monthlyPt = Math.round(professionalTaxAnnual / 12);
  const monthlyTds = Math.round(annualTax / 12);
  const monthlyInHand = Math.max(0, monthlyGross - monthlyPf - monthlyPt - monthlyTds);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F6]">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-[#52676D] mb-6">
          <Link href="/" className="hover:text-[#102D37]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/tools" className="hover:text-[#102D37]">Web tools</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#102D37] font-semibold">Salary Calculator</span>
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
            CA CTC to Monthly In-Hand Salary Calculator
          </h1>
          <p className="text-sm text-[#52676D] mt-2">
            Calculate your actual monthly take-home salary after PF, Professional Tax, standard deductions, and income tax TDS.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#DCE5E0] p-6 sm:p-8 space-y-6 shadow-xs">
            {/* CTC Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#52676D]">
                  Annual Cost to Company (CTC)
                </label>
                <span className="text-base font-extrabold text-[#08765D]">
                  ₹{(ctc / 100000).toFixed(1)} Lakhs / year
                </span>
              </div>
              <input
                type="range"
                min="500000"
                max="4000000"
                step="50000"
                value={ctc}
                onChange={(e) => setCtc(Number(e.target.value))}
                className="w-full accent-[#08765D] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#52676D] mt-1 font-mono">
                <span>₹5 Lakhs</span>
                <span>₹20 Lakhs</span>
                <span>₹40 Lakhs</span>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-2 mt-3">
                {[800000, 1000000, 1200000, 1500000, 1800000, 2400000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setCtc(val)}
                    className={`px-2.5 py-1 text-xs rounded-lg border font-medium transition-colors ${
                      ctc === val
                        ? 'bg-[#08765D] text-white border-[#08765D]'
                        : 'bg-[#F5F7F6] text-[#52676D] border-[#DCE5E0]'
                    }`}
                  >
                    ₹{val / 100000}L
                  </button>
                ))}
              </div>
            </div>

            {/* Variable Pay Percent */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#52676D]">
                  Performance Bonus / Variable Pay
                </label>
                <span className="text-sm font-bold text-[#102D37]">
                  {variablePercent}% (₹{variablePay.toLocaleString('en-IN')})
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="5"
                value={variablePercent}
                onChange={(e) => setVariablePercent(Number(e.target.value))}
                className="w-full accent-[#08765D] cursor-pointer"
              />
            </div>

            {/* Tax Regime Toggle */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#52676D] mb-2">
                Select Tax Regime
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRegime('new')}
                  className={`p-3.5 rounded-xl text-left border transition-all ${
                    regime === 'new'
                      ? 'border-[#08765D] bg-[#EAF4EF] text-[#102D37]'
                      : 'border-[#DCE5E0] bg-[#F5F7F6] text-[#52676D]'
                  }`}
                >
                  <div className="font-bold text-xs">New Tax Regime (Default)</div>
                  <div className="text-[11px] text-[#52676D] mt-0.5">₹75k Standard Deduction</div>
                </button>
                <button
                  type="button"
                  onClick={() => setRegime('old')}
                  className={`p-3.5 rounded-xl text-left border transition-all ${
                    regime === 'old'
                      ? 'border-[#08765D] bg-[#EAF4EF] text-[#102D37]'
                      : 'border-[#DCE5E0] bg-[#F5F7F6] text-[#52676D]'
                  }`}
                >
                  <div className="font-bold text-xs">Old Tax Regime</div>
                  <div className="text-[11px] text-[#52676D] mt-0.5">With 80C & HRA exemptions</div>
                </button>
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#102D37] rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#76d7b2]">
                  Estimated Monthly In-Hand
                </span>
                <div className="text-4xl font-extrabold text-white mt-1">
                  ₹{monthlyInHand.toLocaleString('en-IN')}{' '}
                  <span className="text-sm font-normal text-[#bad1c5]">/ month</span>
                </div>
                <p className="text-xs text-[#bad1c5] mt-1.5">
                  Net salary directly credited to your bank account every month.
                </p>
              </div>

              {/* Monthly Breakdown List */}
              <div className="pt-6 border-t border-[#1f4e5c] space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-[#1b434f]">
                  <span className="text-[#bad1c5]">Monthly Gross Salary</span>
                  <span className="font-bold text-white">₹{monthlyGross.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1b434f]">
                  <span className="text-[#bad1c5]">Employee PF (12% of Basic)</span>
                  <span className="font-semibold text-rose-300">- ₹{monthlyPf.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1b434f]">
                  <span className="text-[#bad1c5]">Professional Tax (PT)</span>
                  <span className="font-semibold text-rose-300">- ₹{monthlyPt.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#bad1c5]">Estimated Monthly TDS (Tax)</span>
                  <span className="font-semibold text-rose-300">- ₹{monthlyTds.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Annual Summary */}
              <div className="p-3.5 bg-[#174450] rounded-xl text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#bad1c5]">Annual Fixed Salary:</span>
                  <span className="font-bold text-white">₹{fixedCtc.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#bad1c5]">Annual Variable Bonus:</span>
                  <span className="font-bold text-[#76d7b2]">₹{variablePay.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#bad1c5]">Estimated Annual Tax:</span>
                  <span className="font-bold text-white">₹{annualTax.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Quick Link */}
            <div className="bg-white rounded-2xl border border-[#DCE5E0] p-6 text-center space-y-3">
              <h3 className="text-sm font-bold text-[#102D37]">
                Compare Open Vacancies in this Salary Band
              </h3>
              <p className="text-xs text-[#52676D]">
                Find roles matching your expected compensation.
              </p>
              <Link
                href="/ca-jobs"
                className="inline-block w-full py-2.5 px-4 bg-[#08765D] hover:bg-[#065F4B] text-white font-semibold text-xs rounded-xl transition-colors"
              >
                Browse Qualified CA Jobs →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
