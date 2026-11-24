import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Calculator, ArrowUpRight, CheckCircle2, Wrench, Shield, Sparkles, ArrowLeft, Building2 } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interactive CA Web Tools & Calculators | CAJob.in',
  description: 'Interactive web tools for CA students & finance professionals: Fixed Asset Register & Depreciation Engine, Stipend calculators, ICAI transfer rule checkers, and salary tax estimators.',
};

export const revalidate = 3600;

export default function ToolsHubPage() {
  const tools = [
    {
      slug: 'fixed-asset-register',
      title: 'Fixed Asset Register & Depreciation Engine',
      description: 'Companies Act 2013 (Schedule II) & Income Tax Act 1961 (Sec 32) pro-rata daily depreciation, 180-day rule, shift adjustments, deferred tax, and bulk Excel import/export.',
      badge: 'Flagship Tool · Schedule II & Sec 32',
      icon: Building2,
      status: 'Active',
      featured: true,
    },
    {
      slug: 'articleship-stipend-calculator',
      title: 'ICAI Articleship Stipend & Scheme Calculator',
      description: 'Check official minimum stipend entitlements across Year 1 and Year 2 under latest ICAI regulations by city tier.',
      badge: 'Interactive Tool · Live',
      icon: Calculator,
      status: 'Active',
      featured: false,
    },
    {
      slug: 'articleship-transfer-checker',
      title: 'ICAI Transfer Rules & Eligibility Checker',
      description: 'Find out whether your articleship transfer falls within the permitted ICAI 1st year or subsequent year transfer criteria.',
      badge: 'Rules Engine · Ready',
      icon: Shield,
      status: 'Active',
      featured: false,
    },
    {
      slug: 'ca-inhand-salary-estimator',
      title: 'CA CTC to In-Hand Take-Home Calculator',
      description: 'Break down gross annual CTC into monthly in-hand take home, PF, standard deduction, and New Tax Regime slabs.',
      badge: 'Financial Model · Ready',
      icon: Sparkles,
      status: 'Active',
      featured: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F6]">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
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
          <span className="text-[#102D37] font-semibold">Web Tools</span>
        </nav>

        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold tracking-widest uppercase text-[#08765D]">
            Web Utilities & Automation
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#102D37] tracking-tight mt-2">
            Interactive CA Web Tools
          </h1>
          <p className="text-sm sm:text-base text-[#52676D] mt-3">
            Free, instant, in-browser calculators and decision tools to help navigate ICAI training rules and compensation packages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}`}
                className={`group bg-white rounded-3xl border p-6 sm:p-7 shadow-xs card-hover-effect flex flex-col justify-between ${
                  t.featured ? 'border-[#08765D]/40 ring-1 ring-[#08765D]/20 bg-gradient-to-br from-white via-white to-[#EAF4EF]/30' : 'border-[#DCE5E0] hover:border-[#08765D]/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#EAF4EF] text-[#08765D] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    {t.featured && (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#08765D] text-white">
                        ★ Featured Flagship
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EAF4EF] text-[#08765D]">
                    {t.badge}
                  </span>
                  <h3 className="text-xl font-bold text-[#102D37] tracking-tight mt-3 mb-2 group-hover:text-[#08765D] transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#52676D] leading-relaxed mb-6">
                    {t.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F0F4F2] flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#08765D]">Launch Tool</span>
                  <ArrowUpRight className="w-4 h-4 text-[#08765D] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Suggest a tool box */}
        <div className="mt-12 bg-white rounded-2xl border border-[#DCE5E0] p-6 text-center max-w-xl mx-auto shadow-2xs">
          <p className="text-xs text-[#52676D]">
            Have a suggestion for a new CA calculator or ICAI compliance checker?{' '}
            <Link href="/contact" className="text-[#08765D] font-semibold hover:underline">
              Send us your request
            </Link>
            .
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
