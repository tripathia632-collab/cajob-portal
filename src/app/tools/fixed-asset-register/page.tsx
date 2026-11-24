import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import {
  ChevronRight,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  FileSpreadsheet,
  Building2,
  Receipt,
  Scale,
  Sparkles,
  ArrowUpRight,
  Lock,
} from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fixed Asset Register & Depreciation Engine (Companies Act & Income Tax) | CAJob.in',
  description:
    'Free online Fixed Asset Register & Depreciation Engine as per Companies Act 2013 (Schedule II) and Income Tax Act 1961 (Section 32). Pro-rata daily calculations, 180-day rule, shift depreciation, deferred tax computation, and Excel import/export. Built by CA Ashish Tripathi.',
  openGraph: {
    title: 'Fixed Asset Register & Depreciation Engine | CAJob.in',
    description:
      'Audit-ready Fixed Asset Register and Depreciation calculation as per Schedule II and Section 32 with 1-click sample data and Excel exports.',
    url: 'https://www.cajob.in/tools/fixed-asset-register',
  },
};

export const revalidate = 3600;

export default function FixedAssetRegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F6]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-[#52676D] mb-6">
          <Link href="/" className="hover:text-[#102D37] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/tools" className="hover:text-[#102D37] transition-colors">
            Web Tools
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#102D37] font-semibold truncate">
            Fixed Asset Register &amp; Depreciation Engine
          </span>
        </nav>

        {/* Back Link & Header Title */}
        <div className="mb-8">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#08765D] hover:underline mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to all tools
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 text-[11px] font-bold uppercase rounded-md bg-[#EAF4EF] text-[#08765D] border border-[#bcdbc8]">
                  Companies Act 2013 · Income Tax Act 1961
                </span>
                <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-white text-[#52676D] border border-[#DCE5E0] flex items-center gap-1">
                  <Lock className="w-3 h-3 text-[#08765D]" />
                  100% Client-Side Privacy
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#102D37] tracking-tight">
                Fixed Asset Register &amp; Depreciation Engine
              </h1>
              <p className="text-sm sm:text-base text-[#52676D] mt-2 leading-relaxed">
                Enterprise-grade FAR management and dual depreciation calculation bridging <strong>Companies Act, 2013 (Schedule II)</strong> and <strong>Income Tax Act, 1961 (Section 32)</strong> with daily pro-rata math, 180-day rule, shift adjustments, deferred tax workings, and bulk Excel import/export.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/tools/fixed-asset-register/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#08765D] hover:bg-[#065F4B] rounded-xl shadow-xs transition-all btn-press-effect"
              >
                <span>Full-Screen Workspace</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Embedded Interactive Web Application Container */}
        <div className="bg-white rounded-3xl border border-[#DCE5E0] shadow-sm overflow-hidden mb-12">
          {/* Top Bar for Embed */}
          <div className="bg-[#102D37] text-white px-6 py-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#76d7b2] animate-pulse"></span>
              <span>Live Application Workspace · Architected by CA Ashish Tripathi</span>
            </div>
            <a
              href="/tools/fixed-asset-register/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#a7e9d4] hover:text-white font-semibold flex items-center gap-1 transition-colors"
            >
              Open in dedicated full tab <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Iframe hosting the self-contained tool */}
          <div className="relative w-full" style={{ height: '960px' }}>
            <iframe
              src="/tools/fixed-asset-register/index.html"
              className="w-full h-full border-0"
              title="cajob.in Fixed Asset Register & Depreciation Engine"
              loading="lazy"
            />
          </div>
        </div>

        {/* Technical & Statutory Reference Guide */}
        <section className="bg-white rounded-3xl border border-[#DCE5E0] p-6 sm:p-10 mb-12">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold tracking-widest uppercase text-[#08765D]">
              Statutory Documentation &amp; Framework
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102D37] tracking-tight mt-1">
              How the Depreciation Engine Calculates
            </h2>
            <p className="text-sm text-[#52676D] mt-2">
              The engine automates complex statutory provisions so your financial statements and tax audit reports reconcile effortlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 1. Companies Act Card */}
            <div className="p-6 bg-[#F5F7F6] rounded-2xl border border-[#DCE5E0]/70 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EAF4EF] text-[#08765D] flex items-center justify-center font-bold mb-4">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#102D37] mb-2">
                  Companies Act, 2013 (Schedule II)
                </h3>
                <ul className="text-xs text-[#52676D] space-y-2 leading-relaxed">
                  <li>• <strong>Ready for Use Date:</strong> Depreciation starts from ready-to-use date as mandated by AS 10 (Revised) and Ind AS 16.</li>
                  <li>• <strong>Daily Pro-Rata:</strong> Calculated on actual days (365 days / 366 days in leap years).</li>
                  <li>• <strong>Shift Adjustments:</strong> Note 3 extra shift rates for Plant &amp; Machinery (Double Shift: 1.5x, Triple Shift: 2.0x).</li>
                  <li>• <strong>5% Residual Value:</strong> Enforces the statutory 5% floor under Schedule II Part C.</li>
                </ul>
              </div>
            </div>

            {/* 2. Income Tax Act Card */}
            <div className="p-6 bg-[#F5F7F6] rounded-2xl border border-[#DCE5E0]/70 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EAF4EF] text-[#08765D] flex items-center justify-center font-bold mb-4">
                  <Receipt className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#102D37] mb-2">
                  Income Tax Act, 1961 (Section 32)
                </h3>
                <ul className="text-xs text-[#52676D] space-y-2 leading-relaxed">
                  <li>• <strong>Put to Use Date:</strong> Depreciation allowed only from actual business put-to-use date.</li>
                  <li>• <strong>180-Day Rule:</strong> Additions used for &ge; 180 days receive 100% rate; &lt; 180 days receive 50% half-rate.</li>
                  <li>• <strong>Block of Assets:</strong> Reconciles additions, deductions (moneys payable), and Section 50 capital gains.</li>
                  <li>• <strong>Form 3CD Clause 18:</strong> Generates audit-ready tax depreciation schedules.</li>
                </ul>
              </div>
            </div>

            {/* 3. Deferred Tax Card */}
            <div className="p-6 bg-[#F5F7F6] rounded-2xl border border-[#DCE5E0]/70 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EAF4EF] text-[#08765D] flex items-center justify-center font-bold mb-4">
                  <Scale className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#102D37] mb-2">
                  Deferred Tax (AS 22 / Ind AS 12)
                </h3>
                <ul className="text-xs text-[#52676D] space-y-2 leading-relaxed">
                  <li>• <strong>Timing Difference:</strong> Compares Book Depreciation vs. Income Tax Depreciation.</li>
                  <li>• <strong>DTA / DTL Computation:</strong> Automatically calculates Deferred Tax Asset or Liability at prevailing corporate tax rates.</li>
                  <li>• <strong>Section 115BAA/BAB:</strong> Choose applicable corporate rates (25.17%, 26%, 29.12%, 31.20%, 34.944%).</li>
                  <li>• <strong>Audit Schedules:</strong> One-click export for balance sheet finalization.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="mt-8 p-4 rounded-xl bg-[#EAF4EF] border border-[#bcdbc8] flex items-center gap-3 text-xs text-[#08765D]">
            <ShieldCheck className="w-5 h-5 flex-shrink-0" />
            <div>
              <strong>Complete Confidentiality Guarantee:</strong> All asset computations and Excel parsing execute 100% locally in your browser. No sensitive company or client financial records are ever uploaded to any server.
            </div>
          </div>
        </section>

        {/* Other Practical Tools */}
        <div className="pt-8 border-t border-[#DCE5E0]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#102D37]">Other Practical CA Web Tools</h2>
            <Link
              href="/tools"
              className="text-xs font-semibold text-[#08765D] hover:underline flex items-center gap-1"
            >
              View all tools <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/tools/articleship-stipend-calculator"
              className="p-5 bg-white rounded-2xl border border-[#DCE5E0] hover:border-[#08765D] transition-colors shadow-2xs group"
            >
              <span className="text-[10px] font-bold uppercase text-[#08765D] block mb-1">
                ICAI Regulation 48
              </span>
              <h3 className="text-sm font-bold text-[#102D37] group-hover:text-[#08765D] transition-colors mb-2">
                Articleship Stipend Calculator
              </h3>
              <p className="text-xs text-[#52676D] line-clamp-2">
                Statutory minimum stipend entitlements by city tier (A, B, C) and market averages.
              </p>
            </Link>

            <Link
              href="/tools/articleship-transfer-checker"
              className="p-5 bg-white rounded-2xl border border-[#DCE5E0] hover:border-[#08765D] transition-colors shadow-2xs group"
            >
              <span className="text-[10px] font-bold uppercase text-[#08765D] block mb-1">
                ICAI Regulation 54
              </span>
              <h3 className="text-sm font-bold text-[#102D37] group-hover:text-[#08765D] transition-colors mb-2">
                Transfer Rules &amp; Eligibility Checker
              </h3>
              <p className="text-xs text-[#52676D] line-clamp-2">
                Check whether your transfer falls within the 1st year unconditional or subsequent year grounds.
              </p>
            </Link>

            <Link
              href="/tools/ca-inhand-salary-estimator"
              className="p-5 bg-white rounded-2xl border border-[#DCE5E0] hover:border-[#08765D] transition-colors shadow-2xs group"
            >
              <span className="text-[10px] font-bold uppercase text-[#08765D] block mb-1">
                Income Tax Regime
              </span>
              <h3 className="text-sm font-bold text-[#102D37] group-hover:text-[#08765D] transition-colors mb-2">
                CA In-Hand CTC Estimator
              </h3>
              <p className="text-xs text-[#52676D] line-clamp-2">
                Break down annual CTC into monthly bank credit after PF, PT, and ₹75k standard deduction.
              </p>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
