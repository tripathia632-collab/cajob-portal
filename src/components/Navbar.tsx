'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Menu, X, ArrowUpRight, ShieldCheck, User, Wrench, LogOut } from 'lucide-react';
import { getStoredSession, isAuthorizedAdmin, clearSession } from '@/lib/auth';

interface NavbarProps {
  userEmail?: string | null;
}

export function Navbar({ userEmail: initialUserEmail }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [jobsDropdownOpen, setJobsDropdownOpen] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(initialUserEmail || null);

  useEffect(() => {
    const session = getStoredSession();
    if (session?.user?.email) {
      setCurrentUserEmail(session.user.email);
    }
  }, []);

  const isAdmin = isAuthorizedAdmin(currentUserEmail);

  const handleLogout = () => {
    clearSession();
    setCurrentUserEmail(null);
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#DCE5E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo - Official Doorway 3D Icon */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-8 h-10 flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
                <Image
                  src="/brand/doorway-icon.png"
                  alt="cajob.in"
                  width={32}
                  height={44}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-[#102D37]">
                cajob<span className="text-[#08765D]">.in</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {/* Find Jobs with hover dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setJobsDropdownOpen(true)}
                onMouseLeave={() => setJobsDropdownOpen(false)}
              >
                <Link
                  href="/jobs"
                  className="text-sm font-medium text-[#102D37] hover:text-[#08765D] transition-colors py-2 flex items-center gap-1"
                >
                  Find jobs
                </Link>

                {jobsDropdownOpen && (
                  <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-[#DCE5E0] p-2 py-3 z-50 animate-dropdown backdrop-blur-md">
                    <Link
                      href="/jobs"
                      className="block px-3 py-2 text-sm font-medium text-[#102D37] hover:bg-[#EAF4EF] rounded-lg transition-colors"
                    >
                      All Opportunities
                      <span className="block text-xs font-normal text-[#52676D]">View all 60+ verified roles</span>
                    </Link>
                    <Link
                      href="/articleship"
                      className="block px-3 py-2 text-sm font-medium text-[#102D37] hover:bg-[#EAF4EF] rounded-lg transition-colors"
                    >
                      Articleship
                      <span className="block text-xs font-normal text-[#52676D]">Fresh intake & transfer openings</span>
                    </Link>
                    <Link
                      href="/industrial-training"
                      className="block px-3 py-2 text-sm font-medium text-[#102D37] hover:bg-[#EAF4EF] rounded-lg transition-colors"
                    >
                      Industrial Training
                      <span className="block text-xs font-normal text-[#52676D]">ICAI-compliant corporate roles</span>
                    </Link>
                    <Link
                      href="/ca-jobs"
                      className="block px-3 py-2 text-sm font-medium text-[#102D37] hover:bg-[#EAF4EF] rounded-lg transition-colors"
                    >
                      Qualified CA Jobs
                      <span className="block text-xs font-normal text-[#52676D]">Audit, Tax, Advisory & FP&A</span>
                    </Link>
                    <Link
                      href="/finance-jobs"
                      className="block px-3 py-2 text-sm font-medium text-[#102D37] hover:bg-[#EAF4EF] rounded-lg transition-colors"
                    >
                      Other Finance Roles
                      <span className="block text-xs font-normal text-[#52676D]">CA Inter, Analysts & Semi-qualified</span>
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/blog"
                className="text-sm font-medium text-[#52676D] hover:text-[#102D37] transition-colors"
              >
                Career guides
              </Link>

              <Link
                href="/resources"
                className="text-sm font-medium text-[#52676D] hover:text-[#102D37] transition-colors"
              >
                Free resources
              </Link>

              <Link
                href="/tools"
                className="text-sm font-medium text-[#52676D] hover:text-[#102D37] transition-colors flex items-center gap-1.5"
              >
                <Wrench className="w-3.5 h-3.5 text-[#08765D]" />
                Web tools
              </Link>

              <Link
                href="/courses"
                className="text-sm font-medium text-[#52676D] hover:text-[#102D37] transition-colors flex items-center gap-1.5"
              >
                Courses
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-[#EAF4EF] text-[#08765D]">
                  Soon
                </span>
              </Link>
            </nav>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/jobs"
              className="p-2 text-[#52676D] hover:text-[#102D37] hover:bg-[#EAF4EF] rounded-full transition-colors"
              aria-label="Search jobs"
            >
              <Search className="w-5 h-5" />
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                Admin CMS
              </Link>
            )}

            {currentUserEmail ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#102D37] hover:text-[#08765D] transition-colors"
                >
                  <User className="w-4 h-4 text-[#08765D]" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-[#52676D] hover:text-red-600 rounded-lg transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#52676D] hover:text-[#102D37] transition-colors"
              >
                <User className="w-4 h-4" />
                Sign in
              </Link>
            )}

            <Link
              href="/for-employers"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-[#08765D] hover:bg-[#065F4B] rounded-xl shadow-xs hover:shadow-md transition-all duration-200 btn-press-effect hover:scale-[1.02]"
            >
              Post a job
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/jobs"
              className="p-2 text-[#52676D] hover:text-[#102D37] rounded-lg"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#102D37] hover:bg-[#EAF4EF] rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#DCE5E0] bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="space-y-1">
            <Link
              href="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-semibold text-[#102D37] hover:bg-[#EAF4EF] rounded-lg"
            >
              All Jobs
            </Link>
            <div className="pl-4 space-y-1 border-l-2 border-[#DCE5E0] ml-3">
              <Link
                href="/articleship"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 text-sm text-[#52676D] hover:text-[#08765D]"
              >
                Articleship
              </Link>
              <Link
                href="/industrial-training"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 text-sm text-[#52676D] hover:text-[#08765D]"
              >
                Industrial Training
              </Link>
              <Link
                href="/ca-jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 text-sm text-[#52676D] hover:text-[#08765D]"
              >
                Qualified CA Jobs
              </Link>
              <Link
                href="/finance-jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 text-sm text-[#52676D] hover:text-[#08765D]"
              >
                Other Finance Roles
              </Link>
            </div>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-[#102D37] hover:bg-[#EAF4EF] rounded-lg"
            >
              Career Guides & Articles
            </Link>
            <Link
              href="/resources"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-[#102D37] hover:bg-[#EAF4EF] rounded-lg"
            >
              Free Resources & Templates
            </Link>
            <Link
              href="/tools"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-[#102D37] hover:bg-[#EAF4EF] rounded-lg"
            >
              Web Tools Hub
            </Link>
            <Link
              href="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-[#102D37] hover:bg-[#EAF4EF] rounded-lg"
            >
              Courses (Coming Soon)
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-semibold text-emerald-800 bg-emerald-50 rounded-lg"
              >
                Admin CMS
              </Link>
            )}
          </div>

          <div className="pt-3 border-t border-[#DCE5E0] flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-medium text-[#102D37] border border-[#DCE5E0] rounded-lg"
            >
              Sign In
            </Link>
            <Link
              href="/for-employers"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-medium text-white bg-[#08765D] rounded-lg"
            >
              Post an Opportunity
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
