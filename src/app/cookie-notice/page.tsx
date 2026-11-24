import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Notice | CAJob.in',
  description: 'How CAJob.in uses necessary cookies and local storage to preserve your preferences.',
};

export default function CookieNoticePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F6]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-white rounded-3xl border border-[#DCE5E0] p-6 sm:p-12 shadow-xs space-y-6 text-[#102D37]">
          <span className="text-xs font-bold uppercase tracking-wider text-[#08765D]">
            Compliance
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Cookie Notice</h1>
          <div className="text-xs text-[#52676D]">Last updated: 23 November 2026</div>

          <div className="space-y-4 text-sm text-[#52676D] leading-relaxed">
            <h2 className="text-lg font-bold text-[#102D37] pt-4">1. What Cookies We Use</h2>
            <p>
              CAJob.in uses minimal, essential cookies and browser local storage strictly required for website operation, such as preserving your saved jobs bookmarks on your personal device and remembering your reduced-motion preferences.
            </p>

            <h2 className="text-lg font-bold text-[#102D37] pt-4">2. No Intrusive Third-Party Ad Trackers</h2>
            <p>
              We do not employ cross-site behavioral advertising trackers or sell browsing data to ad broker networks.
            </p>

            <h2 className="text-lg font-bold text-[#102D37] pt-4">3. Managing Your Cookies</h2>
            <p>
              You can clear cookies or local storage at any time through your browser settings.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
