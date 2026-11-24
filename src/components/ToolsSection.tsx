import React from 'react';
import Link from 'next/link';
import { Calculator, ShieldCheck, TrendingUp, ArrowUpRight, Wrench, Building2 } from 'lucide-react';

export function ToolsSection() {
  const tools = [
    {
      title: 'Fixed Asset Register & Depreciation',
      badge: 'Flagship · Sch II & Sec 32',
      description: 'Audit-ready FAR & pro-rata depreciation engine under Companies Act 2013 and Section 32 Income Tax Act with deferred tax & Excel import.',
      href: '/tools/fixed-asset-register',
      icon: Building2,
      cta: 'Launch FAR Engine',
      featured: true,
    },
    {
      title: 'ICAI Articleship Stipend Calculator',
      badge: 'Interactive · New Scheme',
      description: 'Check statutory minimum stipends by city tier (Class A, B, C) and compare with Big 4 and Top 20 market averages.',
      href: '/tools/articleship-stipend-calculator',
      icon: Calculator,
      cta: 'Launch Calculator',
      featured: false,
    },
    {
      title: 'Articleship Transfer Rules Checker',
      badge: 'Rules Engine · Reg. 54',
      description: 'Instant check for first-year unconditional transfers, medical/relocation grounds, and industrial training NOCs.',
      href: '/tools/articleship-transfer-checker',
      icon: ShieldCheck,
      cta: 'Check Eligibility',
      featured: false,
    },
    {
      title: 'CA CTC to In-Hand Salary Estimator',
      badge: 'Tax Model · ₹75k Std Ded.',
      description: 'Break down gross annual CTC into monthly bank credit after PF, Professional Tax, and New Tax Regime deductions.',
      href: '/tools/ca-inhand-salary-estimator',
      icon: TrendingUp,
      cta: 'Calculate Take-Home',
      featured: false,
    },
  ];

  return (
    <section className="py-16 bg-[#F5F7F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-[#08765D] mb-1.5">
              <Wrench className="w-3.5 h-3.5" />
              <span>Practical Utilities · Free for all</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#102D37] tracking-tight">
              Interactive tools built for CA decisions
            </h2>
            <p className="text-sm sm:text-base text-[#52676D] mt-2">
              No complex spreadsheets needed. In-browser calculators, asset registers, and compliance checkers for your CA career.
            </p>
          </div>

          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-[#08765D] hover:text-white bg-white hover:bg-[#08765D] border border-[#bcdbc8] rounded-xl shadow-2xs transition-all w-fit btn-press-effect"
          >
            All web tools
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Modern Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.title}
                href={t.href}
                className={`group bg-white rounded-3xl border p-6 shadow-xs card-hover-effect flex flex-col justify-between ${
                  t.featured ? 'border-[#08765D]/40 ring-1 ring-[#08765D]/20 bg-gradient-to-b from-white to-[#EAF4EF]/20' : 'border-[#DCE5E0] hover:border-[#08765D]/60'
                }`}
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#EAF4EF] text-[#08765D] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#EAF4EF] text-[#08765D]">
                    {t.badge}
                  </span>
                  <h3 className="text-lg font-bold text-[#102D37] tracking-tight mt-3 mb-2 group-hover:text-[#08765D] transition-colors leading-snug">
                    {t.title}
                  </h3>
                  <p className="text-xs text-[#52676D] leading-relaxed mb-6">
                    {t.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#DCE5E0]/60 flex items-center justify-between text-xs font-bold text-[#08765D]">
                  <span>{t.cta}</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
