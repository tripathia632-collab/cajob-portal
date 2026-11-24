'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { User, Bookmark, FileText, Wrench, ShieldCheck, ArrowUpRight, ArrowLeft } from 'lucide-react';
import { getStoredSession, isAuthorizedAdmin } from '@/lib/auth';

export default function CandidateDashboardPage() {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const session = getStoredSession();
    if (session?.user?.email) {
      setUserEmail(session.user.email);
    }
  }, []);

  const isAdmin = isAuthorizedAdmin(userEmail);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F6]">
      <Navbar userEmail={userEmail} />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* In-Website Back Link */}
        <div className="mb-6">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#102D37] hover:text-[#08765D] bg-white hover:bg-[#EAF4EF] border border-[#DCE5E0] hover:border-[#08765D]/30 rounded-xl transition-all shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Explore Jobs
          </Link>
        </div>

        {/* Welcome Header */}
        <div className="bg-white rounded-3xl border border-[#DCE5E0] p-6 sm:p-8 mb-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#EAF4EF] text-[#08765D] flex items-center justify-center font-bold text-xl border border-[#bcdbc8]">
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-[#08765D]">Candidate Workspace</span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#102D37] mt-0.5">{userEmail}</h1>
              <span className="text-xs text-[#52676D]">Member since November 2026</span>
            </div>
          </div>

          {isAdmin && (
            <Link
              href="/admin"
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 w-fit"
            >
              <ShieldCheck className="w-4 h-4" />
              Open Super Admin CMS
            </Link>
          )}
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Saved Jobs */}
          <div className="bg-white rounded-3xl border border-[#DCE5E0] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#EAF4EF] text-[#08765D] flex items-center justify-center">
                <Bookmark className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#52676D]">Saved</span>
            </div>
            <h3 className="text-lg font-bold text-[#102D37]">Saved Opportunities</h3>
            <p className="text-xs text-[#52676D]">
              Keep track of roles you want to prepare applications for.
            </p>
            <Link
              href="/jobs?saved=1"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#08765D] hover:underline pt-2"
            >
              Browse saved jobs <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Free Templates */}
          <div className="bg-white rounded-3xl border border-[#DCE5E0] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#EAF4EF] text-[#08765D] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#52676D]">Templates</span>
            </div>
            <h3 className="text-lg font-bold text-[#102D37]">CV & Email Formats</h3>
            <p className="text-xs text-[#52676D]">
              Download ready-to-use articleship CVs and partner reach-out scripts.
            </p>
            <Link
              href="/resources"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#08765D] hover:underline pt-2"
            >
              Access resources <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: Calculators */}
          <div className="bg-white rounded-3xl border border-[#DCE5E0] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#EAF4EF] text-[#08765D] flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#52676D]">Tools</span>
            </div>
            <h3 className="text-lg font-bold text-[#102D37]">Calculators Hub</h3>
            <p className="text-xs text-[#52676D]">
              Calculate ICAI minimum stipends and in-hand CTC deductions.
            </p>
            <Link
              href="/tools"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#08765D] hover:underline pt-2"
            >
              Open web tools <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
