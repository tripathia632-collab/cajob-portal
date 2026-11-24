import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, BookOpen, Download, Sparkles } from 'lucide-react';

export function ThreeStepProcess() {
  const steps = [
    {
      num: '01',
      title: 'Find your fit',
      desc: 'Explore roles by career stage, specialism, location and stipend with no sign-up wall.',
    },
    {
      num: '02',
      title: 'Get the full picture',
      desc: 'Read clear role requirements, eligibility criteria, exam leave policies and verified employer facts.',
    },
    {
      num: '03',
      title: 'Apply directly',
      desc: 'Send your CV directly to the verified employer portal or hiring email with zero middleman.',
    },
  ];

  return (
    <section className="py-16 bg-white border-y border-[#DCE5E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-[#08765D]">
            Simple by design
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#102D37] tracking-tight mt-1.5">
            Your next chapter in three steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s) => (
            <div key={s.num} className="space-y-3">
              <span className="text-4xl font-extrabold text-[#08765D]/30 block">
                {s.num}
              </span>
              <h3 className="text-xl font-bold text-[#102D37] tracking-tight">
                {s.title}
              </h3>
              <p className="text-sm text-[#52676D] leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GuidanceSection() {
  return (
    <section className="py-16 bg-[#F5F7F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <span className="text-xs font-bold tracking-widest uppercase text-[#08765D]">
            Tools for your next move
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#102D37] tracking-tight mt-1.5">
            A little guidance goes a long way
          </h2>
          <p className="text-sm sm:text-base text-[#52676D] mt-2">
            Practical support for every step of your career.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Career Guides */}
          <Link
            href="/blog"
            className="group bg-white rounded-2xl border border-[#DCE5E0] hover:border-[#08765D] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EAF4EF] text-[#08765D]">
                  Read · 50+ Guides
                </span>
                <BookOpen className="w-4 h-4 text-[#08765D]" />
              </div>
              <h3 className="text-xl font-bold text-[#102D37] tracking-tight mb-2 group-hover:text-[#08765D] transition-colors">
                Career guides
              </h3>
              <p className="text-sm text-[#52676D] leading-relaxed mb-6">
                Make informed moves with interview frameworks, firm selection tips, and practical technical prep.
              </p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-[#08765D]">
              Read the guides
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 2: Free Resources */}
          <Link
            href="/resources"
            className="group bg-white rounded-2xl border border-[#DCE5E0] hover:border-[#08765D] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EAF4EF] text-[#08765D]">
                  Download · Free
                </span>
                <Download className="w-4 h-4 text-[#08765D]" />
              </div>
              <h3 className="text-xl font-bold text-[#102D37] tracking-tight mb-2 group-hover:text-[#08765D] transition-colors">
                Free resources
              </h3>
              <p className="text-sm text-[#52676D] leading-relaxed mb-6">
                Resume templates, email drafts, opportunity comparison sheets and checklists ready to save and use.
              </p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-[#08765D]">
              Explore resources
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 3: Courses (Coming Soon) */}
          <Link
            href="/courses"
            className="group bg-white rounded-2xl border border-[#DCE5E0] hover:border-[#08765D] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F5F7F6] text-[#52676D] border border-[#DCE5E0]">
                  Coming soon
                </span>
                <Sparkles className="w-4 h-4 text-[#52676D]" />
              </div>
              <h3 className="text-xl font-bold text-[#102D37] tracking-tight mb-2 group-hover:text-[#08765D] transition-colors">
                Courses
              </h3>
              <p className="text-sm text-[#52676D] leading-relaxed mb-6">
                Build job-ready practical skills in advanced Excel, financial modelling, GST filings and audit tools.
              </p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-[#08765D]">
              Join the waitlist
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
