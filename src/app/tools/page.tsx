import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Calculator, ArrowUpRight, CheckCircle2, Wrench, Shield, Sparkles, ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interactive CA Web Tools & Calculators | CAJob.in',
  description: 'Interactive web tools for CA students & finance professionals: Stipend calculators, ICAI transfer rule checkers, and salary tax estimators.',
};

export default function ToolsHubPage() {
  const tools = [
    {
      slug: 'articleship-stipend-calculator',
      title: 'ICAI Articleship Stipend & Scheme Calculator',
      description: 'Check official minimum stipend entitlements across Year 1 and Year 2 under latest ICAI regulations by city tier.',
      badge: 'Interactive Tool · Live',
      icon: Calculator,
      status: 'Active',
    },
    {
      slug: 'articleship-transfer-checker',
      title: 'ICAI Transfer Rules & Eligibility Checker',
      description: 'Find out whether your articleship transfer falls within the permitted ICAI 1st year or subsequent year transfer criteria.',
      badge: 'Rules Engine · Ready',
      icon: Shield,
      status: 'Active',
    },
    {
      slug: 'ca-inhand-salary-estimator',
      title: 'CA CTC to In-Hand Take-Home Calculator',
      description: 'Break down gross annual CTC into monthly in-hand take home, PF, standard deduction, and New Tax Regime slabs.',
      badge: 'Financial Model · Ready',
      icon: Sparkles,
      status: 'Active',
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}`}
                className="group bg-white rounded-3xl border border-[#DCE5E0] hover:border-[#08765D] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#EAF4EF] text-[#08765D] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EAF4EF] text-[#08765D]">
                    {t.badge}
                  </span>
                  <h3 className="text-lg font-bold text-[#102D37] tracking-tight mt-3 mb-2 group-hover:text-[#08765D] transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#52676D] leading-relaxed mb-6">
                    {t.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F0F4F2] flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#08765D]">Launch Tool</span>
                  <ArrowUpRight className="w-4 h-4 text-[#08765D] group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Admin note */}
        <div className="mt-12 bg-white rounded-2xl border border-[#DCE5E0] p-6 text-center max-w-xl mx-auto">
          <p className="text-xs text-[#52676D]">
            As an Administrator, you can upload new tools or embed interactive web apps directly through the{' '}
            <Link href="/admin" className="text-[#08765D] font-bold hover:underline">
              Admin CMS Dashboard
            </Link>
            .
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
