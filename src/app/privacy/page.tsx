import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | CAJob.in',
  description: 'Our commitment to data protection, candidate privacy, and Indian DPDP compliance.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F6]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-white rounded-3xl border border-[#DCE5E0] p-6 sm:p-12 shadow-xs space-y-6 text-[#102D37]">
          <span className="text-xs font-bold uppercase tracking-wider text-[#08765D]">
            Legal & Compliance
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Privacy Policy</h1>
          <div className="text-xs text-[#52676D]">Last updated: 23 November 2026</div>

          <div className="space-y-4 text-sm text-[#52676D] leading-relaxed">
            <h2 className="text-lg font-bold text-[#102D37] pt-4">1. Our Commitment to Your Privacy</h2>
            <p>
              CAJob.in operates with a strict candidate-first privacy policy. We believe that job searching should be safe, transparent, and respectful of your professional confidentiality.
            </p>

            <h2 className="text-lg font-bold text-[#102D37] pt-4">2. Direct Employer Application Routing</h2>
            <p>
              When you click &ldquo;Apply Directly&rdquo; on an opportunity, CAJob.in redirects you straight to the verified employer&apos;s career website, ATS system, or official HR contact email. We do not store, intercept, or sell your curriculum vitae (CV) or job application data to third parties.
            </p>

            <h2 className="text-lg font-bold text-[#102D37] pt-4">3. Information We Collect</h2>
            <p>
              You can browse all jobs, read blogs, and access calculators without creating an account or providing personal details. If you choose to subscribe to email alerts, submit a contact inquiry, or create an account, we collect only the necessary credentials (such as your email address and name).
            </p>

            <h2 className="text-lg font-bold text-[#102D37] pt-4">4. Compliance with India&apos;s DPDP Act</h2>
            <p>
              We adhere strictly to the Digital Personal Data Protection Act (DPDP), 2023. You have full right to request deletion of your account or unsubscribe from any communications at any time.
            </p>

            <h2 className="text-lg font-bold text-[#102D37] pt-4">5. Contact Us Regarding Privacy</h2>
            <p>
              For any data privacy concerns or requests, reach out directly to privacy@cajob.in.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
