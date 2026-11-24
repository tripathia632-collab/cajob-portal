import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getResources } from '@/lib/supabase';
import { Download, FileText, CheckCircle2, ArrowUpRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free CA Resources & CV Templates | CAJob.in',
  description: 'Download free CA articleship CV templates, application email scripts, and opportunity comparison worksheets.',
};


export default async function ResourcesPage() {
  const resources = await getResources();

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F6]">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
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
          <span className="text-[#102D37] font-semibold">Free Resources</span>
        </nav>

        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold tracking-widest uppercase text-[#08765D]">
            Downloadable Tools
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#102D37] tracking-tight mt-2">
            Free career resources & templates
          </h1>
          <p className="text-sm sm:text-base text-[#52676D] mt-3">
            Practical files, CV formats, and email templates tailored specifically for CA students and finance candidates. 100% free to download.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources.map((res) => (
            <div
              key={res.id}
              className="bg-white rounded-3xl border border-[#DCE5E0] p-6 shadow-xs flex flex-col justify-between hover:border-[#08765D] transition-colors"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#EAF4EF] text-[#08765D] flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#08765D] mb-1">
                  {res.category} · {res.fileType}
                </div>
                <h3 className="text-xl font-bold text-[#102D37] tracking-tight mb-2">
                  {res.title}
                </h3>
                <p className="text-sm text-[#52676D] leading-relaxed mb-6">
                  {res.description}
                </p>
              </div>

              <div>
                <a
                  href={res.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-[#08765D] hover:bg-[#065F4B] text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  Download Free Template
                </a>
                <div className="mt-3 text-center text-[11px] text-[#52676D]">
                  Verified editable document
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info card */}
        <div className="mt-12 bg-white rounded-3xl border border-[#DCE5E0] p-8 text-center max-w-xl mx-auto space-y-3">
          <ShieldCheck className="w-8 h-8 text-[#08765D] mx-auto" />
          <h3 className="text-lg font-bold text-[#102D37]">More resources added weekly</h3>
          <p className="text-xs sm:text-sm text-[#52676D] leading-relaxed">
            Have a specific template or Excel model you need? Let our editorial team know and we will curate it for our community.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#08765D] hover:underline"
            >
              Suggest a resource <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
