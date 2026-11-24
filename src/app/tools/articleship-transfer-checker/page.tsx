'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ShieldCheck, ArrowLeft, ChevronRight, CheckCircle2, AlertTriangle, FileText, Info } from 'lucide-react';

export default function ArticleshipTransferCheckerPage() {
  const [trainingYear, setTrainingYear] = useState<'1' | '2'>('1');
  const [transferReason, setTransferReason] = useState<string>('first_year_unconditional');
  const [principalConsent, setPrincipalConsent] = useState<'yes' | 'no'>('yes');

  // Reason definitions
  const reasons = [
    { id: 'first_year_unconditional', label: 'Within First Year of Articleship (Unconditional)', applicableYears: ['1'] },
    { id: 'medical_grounds', label: 'Medical grounds of self requiring change of station (Doctor Certificate)', applicableYears: ['2'] },
    { id: 'parents_relocation', label: 'Transfer / relocation of parents to another city', applicableYears: ['2'] },
    { id: 'marriage_relocation', label: 'Marriage or family shifting to another city (post registration)', applicableYears: ['2'] },
    { id: 'industrial_training', label: 'Joining approved Corporate Industrial Training (after min. 12 months)', applicableYears: ['2'] },
    { id: 'death_or_closure', label: 'Death of Principal / Dissolution of CA Firm', applicableYears: ['1', '2'] },
    { id: 'second_degree', label: 'Pursuing regular graduation / higher degree approved by ICAI', applicableYears: ['2'] },
    { id: 'other_reasons', label: 'Other work culture / personal reasons', applicableYears: ['2'] },
  ];

  // Verdict logic based on ICAI Regulation 54
  let isEligible = false;
  let statusBadge = 'Eligible';
  let explanation = '';
  let formRequired = 'Form 109 (Termination of Articles) within 30 days';

  if (trainingYear === '1') {
    isEligible = true;
    statusBadge = 'Unconditionally Permitted';
    explanation = 'Under ICAI Regulations, a candidate can seek transfer/termination of articles during the first year of practical training without submitting any specific justification or documents.';
  } else {
    // 2nd Year
    if (
      transferReason === 'medical_grounds' ||
      transferReason === 'parents_relocation' ||
      transferReason === 'marriage_relocation' ||
      transferReason === 'industrial_training' ||
      transferReason === 'death_or_closure'
    ) {
      isEligible = true;
      statusBadge = 'Permitted with Documentation';
      explanation = 'Your reason falls strictly within the permissible grounds specified by ICAI Council guidelines for second-year transfers. You will need supporting documents (medical certificate, parent transfer order, marriage card, or industrial training offer).';
    } else {
      isEligible = principalConsent === 'yes';
      statusBadge = isEligible ? 'Permitted with Mutual NOC' : 'Restricted by ICAI';
      explanation = isEligible
        ? 'Since your reason is general, transfer is permissible only if your existing Principal provides an unconditional No Objection Certificate (NOC) and signs Form 109 without dispute.'
        : 'Without Principal consent, ICAI does not permit general second-year articleship transfers unless falling under approved medical or relocation criteria.';
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F6]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-[#52676D] mb-6">
          <Link href="/" className="hover:text-[#102D37]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/tools" className="hover:text-[#102D37]">Web tools</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#102D37] font-semibold">Transfer Rules Checker</span>
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
            ICAI Articleship Transfer Rules & Eligibility Checker
          </h1>
          <p className="text-sm text-[#52676D] mt-2">
            Verify whether your proposed articleship transfer or switch is legally compliant under ICAI Regulation 54.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#DCE5E0] p-6 sm:p-8 space-y-6 shadow-xs">
            {/* Step 1: Year */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#52676D] mb-3">
                1. Current Stage of Practical Training
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setTrainingYear('1');
                    setTransferReason('first_year_unconditional');
                  }}
                  className={`p-4 rounded-xl text-left border transition-all ${
                    trainingYear === '1'
                      ? 'border-[#08765D] bg-[#EAF4EF] text-[#102D37]'
                      : 'border-[#DCE5E0] bg-[#F5F7F6] text-[#52676D]'
                  }`}
                >
                  <div className="font-bold text-sm">1st Year</div>
                  <div className="text-xs text-[#52676D] mt-0.5">&le; 365 Days Completed</div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTrainingYear('2');
                    setTransferReason('industrial_training');
                  }}
                  className={`p-4 rounded-xl text-left border transition-all ${
                    trainingYear === '2'
                      ? 'border-[#08765D] bg-[#EAF4EF] text-[#102D37]'
                      : 'border-[#DCE5E0] bg-[#F5F7F6] text-[#52676D]'
                  }`}
                >
                  <div className="font-bold text-sm">2nd Year</div>
                  <div className="text-xs text-[#52676D] mt-0.5">&gt; 1 Year Completed</div>
                </button>
              </div>
            </div>

            {/* Step 2: Reason (if 2nd year) */}
            {trainingYear === '2' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#52676D] mb-3">
                  2. Reason for Transfer / Termination
                </label>
                <div className="space-y-2">
                  {reasons
                    .filter((r) => r.applicableYears.includes('2'))
                    .map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setTransferReason(r.id)}
                        className={`w-full p-3 rounded-xl text-left border text-xs transition-all ${
                          transferReason === r.id
                            ? 'border-[#08765D] bg-[#EAF4EF] text-[#102D37] font-semibold'
                            : 'border-[#DCE5E0] bg-[#F5F7F6] text-[#52676D]'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Step 3: Consent */}
            {trainingYear === '2' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#52676D] mb-2">
                  3. Will your Principal sign Form 109 amicably?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPrincipalConsent('yes')}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold border ${
                      principalConsent === 'yes'
                        ? 'border-[#08765D] bg-[#08765D] text-white'
                        : 'border-[#DCE5E0] bg-[#F5F7F6] text-[#52676D]'
                    }`}
                  >
                    Yes (Mutual Consent)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrincipalConsent('no')}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold border ${
                      principalConsent === 'no'
                        ? 'border-red-600 bg-red-600 text-white'
                        : 'border-[#DCE5E0] bg-[#F5F7F6] text-[#52676D]'
                    }`}
                  >
                    No (Disputed / Refusing)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Results Box */}
          <div className="lg:col-span-5 space-y-6">
            <div
              className={`rounded-3xl p-6 sm:p-8 text-white space-y-5 shadow-xl ${
                isEligible ? 'bg-[#102D37]' : 'bg-[#3b1219]'
              }`}
            >
              <div className="flex items-center gap-2">
                {isEligible ? (
                  <CheckCircle2 className="w-6 h-6 text-[#76d7b2]" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                )}
                <span className="text-xs font-bold uppercase tracking-wider text-[#76d7b2]">
                  {statusBadge}
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-white">
                  {isEligible ? 'Transfer is Permissible' : 'Transfer is Disallowed'}
                </h3>
                <p className="text-xs text-[#bad1c5] mt-3 leading-relaxed">
                  {explanation}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3 text-xs">
                <div className="flex items-center gap-2 text-[#a7e9d4]">
                  <FileText className="w-4 h-4" />
                  <strong>Procedural Form:</strong>
                </div>
                <div className="text-white/90 bg-white/10 p-3 rounded-xl font-mono text-[11px]">
                  {formRequired}
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="bg-white rounded-2xl border border-[#DCE5E0] p-6 space-y-3">
              <h4 className="text-sm font-bold text-[#102D37]">Important Transfer Steps:</h4>
              <ul className="text-xs text-[#52676D] space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#08765D] font-bold">1.</span>
                  Calculate exact leaves taken during the period served.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#08765D] font-bold">2.</span>
                  Ensure stipend has been paid via bank transfer as per records.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#08765D] font-bold">3.</span>
                  Submit Form 109 on ICAI SSP Portal within 30 days of last working day.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#08765D] font-bold">4.</span>
                  Register with new firm using Form 102/103.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
