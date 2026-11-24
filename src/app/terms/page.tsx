import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use | CAJob.in',
  description: 'Terms and conditions governing the use of the CAJob.in career platform.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F6]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-white rounded-3xl border border-[#DCE5E0] p-6 sm:p-12 shadow-xs space-y-6 text-[#102D37]">
          <span className="text-xs font-bold uppercase tracking-wider text-[#08765D]">
            Legal
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Terms of Use</h1>
          <div className="text-xs text-[#52676D]">Last updated: 23 November 2026</div>

          <div className="space-y-4 text-sm text-[#52676D] leading-relaxed">
            <h2 className="text-lg font-bold text-[#102D37] pt-4">1. Independent Platform & Disclaimers</h2>
            <p>
              CAJob.in is an independent platform connecting candidates and employers in the chartered accountancy and finance sectors. CAJob.in is not affiliated with, endorsed by, or an official subsidiary of The Institute of Chartered Accountants of India (ICAI).
            </p>

            <h2 className="text-lg font-bold text-[#102D37] pt-4">2. Candidate Verification Responsibility</h2>
            <p>
              While we personally verify listings against official employer channels before publishing, candidates are strongly advised to independently verify all terms of employment, compensation, training periods, and ICAI compliance before signing any contracts or training deeds.
            </p>

            <h2 className="text-lg font-bold text-[#102D37] pt-4">3. Absolute No-Fee-to-Apply Guarantee</h2>
            <p>
              CAJob.in will never charge candidates to apply for vacancies or demand registration fees for job interviews. Any employer attempting to charge candidates will be immediately suspended and reported.
            </p>

            <h2 className="text-lg font-bold text-[#102D37] pt-4">4. Intellectual Property</h2>
            <p>
              The CAJob.in name, doorway logo mark, and editorial guides are proprietary assets. External logos (such as EY, Deloitte, Citi) remain the intellectual property of their respective trademark holders and are referenced purely for informational recruitment purposes.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
