import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#102D37] text-white pt-16 pb-12 mt-auto border-t border-[#1a4452]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#1f4e5c]">
          {/* Brand & Purpose */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image
                src="/brand/doorway-icon.png"
                alt="cajob.in"
                width={32}
                height={42}
                className="object-contain"
              />
              <span className="font-extrabold text-2xl tracking-tight text-white">
                cajob<span className="text-[#76d7b2]">.in</span>
              </span>
            </Link>
            <p className="text-sm text-[#bad1c5] max-w-sm leading-relaxed">
              A clearer path to your next finance opportunity. Built specifically for CA students,
              Chartered Accountants, and finance professionals across India.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#174450] text-[#a7e9d4] border border-[#2a6575]">
                <span className="w-2 h-2 rounded-full bg-[#76d7b2] animate-pulse"></span>
                Direct Employer Applications
              </span>
            </div>
          </div>

          {/* Column 1: Explore */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-white/90">
              Explore
            </h3>
            <ul className="space-y-2 text-sm text-[#bad1c5]">
              <li>
                <Link href="/jobs" className="hover:text-white transition-colors">
                  All jobs
                </Link>
              </li>
              <li>
                <Link href="/articleship" className="hover:text-white transition-colors">
                  Articleship
                </Link>
              </li>
              <li>
                <Link href="/industrial-training" className="hover:text-white transition-colors">
                  Industrial Training
                </Link>
              </li>
              <li>
                <Link href="/ca-jobs" className="hover:text-white transition-colors">
                  Qualified CA jobs
                </Link>
              </li>
              <li>
                <Link href="/finance-jobs" className="hover:text-white transition-colors">
                  Other finance jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Learn & Tools */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-white/90">
              Learn & Tools
            </h3>
            <ul className="space-y-2 text-sm text-[#bad1c5]">
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blogs
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-white transition-colors">
                  Free resources & CVs
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-white transition-colors">
                  Interactive Web Tools
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-white transition-colors flex items-center gap-1.5">
                  Courses
                  <span className="text-[10px] uppercase font-bold bg-[#1e4854] text-[#a7e9d4] px-1.5 py-0.2 rounded">
                    Soon
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Connect */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-white/90">
              Company
            </h3>
            <ul className="space-y-2 text-sm text-[#bad1c5]">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/for-employers" className="hover:text-white transition-colors">
                  For employers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#8ca89a]">
          <div>
            &copy; 2026 cajob.in · All rights reserved.
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of use
            </Link>
            <Link href="/cookie-notice" className="hover:text-white transition-colors">
              Cookie notice
            </Link>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#173e4a] text-center text-[11px] text-[#789689]">
          Independent career platform. Verify each opportunity directly with the employer. We never charge candidates to apply.
        </div>
      </div>
    </footer>
  );
}
