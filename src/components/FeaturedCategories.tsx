import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export function FeaturedCategories() {
  const categories = [
    {
      num: '01',
      title: 'Qualified CA jobs',
      desc: 'Put your qualification to work in audit, tax, advisory, M&A and corporate finance.',
      linkText: 'Explore opportunities',
      href: '/ca-jobs',
    },
    {
      num: '02',
      title: 'Articleship',
      desc: 'Build a strong foundation with leading firms, genuine stipends and transfer options.',
      linkText: 'Find your first firm',
      href: '/articleship',
    },
    {
      num: '03',
      title: 'Industrial Training',
      desc: 'Learn inside top corporates with ICAI-compliant 9-12 month training programs.',
      linkText: 'Explore training roles',
      href: '/industrial-training',
    },
    {
      num: '04',
      title: 'Other finance jobs',
      desc: 'Opportunities for CA Inter, semi-qualified, financial analysts and FP&A experts.',
      linkText: 'Browse finance jobs',
      href: '/finance-jobs',
    },
  ];

  return (
    <section className="py-16 bg-[#F5F7F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <span className="text-xs font-bold tracking-widest uppercase text-[#08765D]">
            Made for your journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#102D37] tracking-tight mt-1.5">
            Where do you want to go next?
          </h2>
          <p className="text-sm sm:text-base text-[#52676D] mt-2">
            One focused platform. Every stage of your finance career.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((c) => (
            <Link
              key={c.num}
              href={c.href}
              className="group bg-white rounded-2xl border border-[#DCE5E0] hover:border-[#08765D] p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-[#52676D] group-hover:text-[#08765D] transition-colors">
                  {c.num}
                </span>
                <h3 className="text-xl font-bold text-[#102D37] tracking-tight mt-2 mb-2 group-hover:text-[#08765D] transition-colors">
                  {c.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#52676D] leading-relaxed mb-6">
                  {c.desc}
                </p>
              </div>

              <div className="inline-flex items-center gap-1 text-xs font-bold text-[#08765D] group-hover:translate-x-0.5 transition-transform">
                {c.linkText}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
