import React from 'react';
import Link from 'next/link';
import { Calculator, ShieldCheck, TrendingUp, ArrowUpRight, Wrench } from 'lucide-react';

export function ToolsSection() {
  const tools = [
    {
      title: 'ICAI Articleship Stipend Calculator',
      badge: 'Interactive · New Scheme',
      description: 'Check statutory minimum stipends by city tier (Class A, B, C) and compare with Big 4 and Top 20 market averages.',
      href: '/tools/articleship-stipend-calculator',
      icon: Calculator,
      cta: 'Launch Calculator',
    },
    {
      title: 'Articleship Transfer Rules Checker',
      badge: 'Rules Engine · Reg. 54',
      description: 'Instant check for first-year unconditional transfers, medical/relocation grounds, and industrial training NOCs.',
      href: '/tools/articleship-transfer-checker',
      icon: ShieldCheck,
      cta: 'Check Eligibility',
    },
    {
      title: 'CA CTC to In-Hand Salary Estimator',
      badge: 'Tax Model · ₹75k Std Ded.',
      description: 'Break down gross annual CTC into monthly bank credit after PF, Professional Tax, and New Tax Regime deductions.',
      href: '/tools/ca-inhand-salary-estimator',
      icon: TrendingUp,
      cta: 'Calculate Take-Home',
    },
  ];

  return (
    <section className="py-16 bg-white border-y border-[#DCE5E0]">
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
              No complex spreadsheets needed. In-browser calculators and compliance checkers for your CA career.
            </p>
          </div>

          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-[#08765D] hover:text-white bg-white hover:bg-[#08765D] border border-[#bcdbc8] rounded-xl shadow-2xs transition-all w-fit"
          >
            All web tools
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 Figma-Styled Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.title}
                href={t.href}
                className="group bg-[#F5F7F6] hover:bg-white rounded-3xl border border-[#DCE5E0] hover:border-[#08765D]/60 p-6 sm:p-7 shadow-xs card-hover-effect flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#EAF4EF] text-[#08765D] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#EAF4EF] text-[#08765D]">
                    {t.badge}
                  </span>
                  <h3 className="text-xl font-bold text-[#102D37] tracking-tight mt-3 mb-2 group-hover:text-[#08765D] transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#52676D] leading-relaxed mb-6">
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
