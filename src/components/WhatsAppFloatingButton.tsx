'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, ArrowUpRight } from 'lucide-react';
import { WHATSAPP_FEEDBACK_NUMBER, WHATSAPP_FEEDBACK_URL } from '@/lib/community';

export function WhatsAppFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <aside aria-label="WhatsApp Feedback and Support" className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 select-none">
      {/* Popover Card */}
      {isOpen && (
        <div className="bg-white rounded-2xl p-4 shadow-2xl border border-[#DCE5E0] max-w-xs w-72 mb-2 animate-dropdown backdrop-blur-md text-left">
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-bold text-[#102D37]">WhatsApp Feedback &amp; Queries</div>
                <div className="text-[11px] font-semibold text-[#08765D]">{WHATSAPP_FEEDBACK_NUMBER}</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#52676D] hover:text-[#102D37] p-1 rounded-md"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-[#52676D] leading-relaxed mb-3">
            Have a question, feedback, or job query? Connect with us directly on WhatsApp.
          </p>

          <a
            href={WHATSAPP_FEEDBACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-[#25D366] hover:bg-[#1EBE5D] rounded-xl shadow-xs transition-colors"
          >
            <span>Connect with us on WhatsApp</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          <div className="mt-2.5 pt-2 border-t border-[#F0F4F2] text-center">
            <Link
              href="/community"
              onClick={() => setIsOpen(false)}
              className="text-[10px] font-semibold text-[#08765D] hover:underline"
            >
              Looking for our WhatsApp Community? Join here →
            </Link>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Connect with us on WhatsApp"
          className="group flex items-center gap-2.5 px-3.5 py-2.5 bg-white hover:bg-[#F5F7F6] text-[#102D37] rounded-full shadow-lg border border-[#DCE5E0] hover:border-[#25D366]/50 transition-all duration-300 btn-press-effect"
        >
          <div className="relative w-6 h-6 rounded-full bg-[#25D366] text-white flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <svg
              className="w-3.5 h-3.5 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z" />
            </svg>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </div>

          <div className="hidden sm:flex flex-col text-left pr-1">
            <span className="text-[11px] font-bold text-[#102D37] leading-tight">Connect with us</span>
            <span className="text-[10px] font-semibold text-[#08765D]">{WHATSAPP_FEEDBACK_NUMBER}</span>
          </div>
        </button>
      </div>
    </aside>
  );
}
