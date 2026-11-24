'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Users,
  ArrowUpRight,
  Sparkles,
  MessageCircle,
  Bell,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  Send,
} from 'lucide-react';
import {
  getCommunityChannels,
  WHATSAPP_FEEDBACK_NUMBER,
  WHATSAPP_FEEDBACK_URL,
  OFFICIAL_WHATSAPP_CHANNEL_URL,
  CommunityChannel,
} from '@/lib/community';
import { ChannelWaitlistModal } from '@/components/ChannelWaitlistModal';

export function CommunitySection() {
  const channels = getCommunityChannels();
  const featuredChannel = channels.find((c) => c.featured) || channels[0];
  const upcomingChannels = channels.filter((c) => !c.featured);

  const [selectedUpcomingChannel, setSelectedUpcomingChannel] = useState<CommunityChannel | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleNotifyMe = (channel: CommunityChannel) => {
    setSelectedUpcomingChannel(channel);
    setModalOpen(true);
  };

  return (
    <section className="py-16 bg-white border-y border-[#DCE5E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* ============================================================== */}
        {/* PART 1: WHATSAPP COMMUNITY (CHANNELS & GROUPS)                 */}
        {/* ============================================================== */}
        <div>
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-[#08765D] mb-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Official WhatsApp Community</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#102D37] tracking-tight">
                CAJob.in WhatsApp Community
              </h2>
              <p className="text-sm sm:text-base text-[#52676D] mt-2 max-w-2xl">
                Join our official WhatsApp community for verified CA vacancies, articleship openings, corporate industrial training, and finance opportunities.
              </p>
            </div>

            <Link
              href="/community"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-[#08765D] hover:text-white bg-white hover:bg-[#08765D] border border-[#bcdbc8] rounded-xl shadow-2xs transition-all w-fit btn-press-effect"
            >
              <span>Explore all community groups</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* SPOTLIGHT LIVE CHANNEL: Core Finance for CAs */}
          <div className="bg-gradient-to-br from-[#102D37] via-[#143e4d] to-[#08765D] rounded-3xl p-6 sm:p-10 text-white shadow-lg relative overflow-hidden border border-[#2a6575] mb-10">
            <div className="relative z-10 space-y-6">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#25D366]/20 text-[#a7e9d4] border border-[#25D366]/30">
                  <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
                  Active Now · Official WhatsApp Community
                </span>
                <span className="text-xs text-[#bad1c5]">
                  Free to Join · Zero Spam
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md p-2.5 flex items-center justify-center border border-white/20 flex-shrink-0 shadow-inner">
                  <Image
                    src="/brand/doorway-icon.png"
                    alt="Core Finance for CAs"
                    width={56}
                    height={72}
                    className="object-contain"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {featuredChannel.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-[#76d7b2]">
                    {featuredChannel.category} · Verified CA Network
                  </p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-[#d2e4dc] leading-relaxed max-w-3xl">
                {featuredChannel.description || featuredChannel.tagline}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href={featuredChannel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm rounded-xl shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <svg
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z" />
                  </svg>
                  <span>Join WhatsApp Community</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                <div className="flex items-center gap-2 text-xs text-[#a7e9d4]">
                  <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
                  <span>Confidential Broadcast · Mobile Numbers Kept Private</span>
                </div>
              </div>
            </div>
          </div>

          {/* COMMUNITY GROUPS FOR ALL KINDS OF DOMAINS */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#102D37]">
                  Explore Community by Domain
                </h3>
                <p className="text-xs sm:text-sm text-[#52676D] mt-0.5">
                  Join domain-specific WhatsApp groups and broadcasts across every stage of your CA journey.
                </p>
              </div>
              <span className="text-xs font-semibold text-[#08765D] bg-[#EAF4EF] px-3 py-1 rounded-full border border-[#bcdbc8] w-fit">
                Rollout in Progress
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {upcomingChannels.slice(0, 6).map((c) => (
                <div
                  key={c.id}
                  className="p-5 sm:p-6 bg-[#F5F7F6] rounded-2xl border border-[#DCE5E0] hover:border-[#08765D]/40 transition-all flex flex-col justify-between group shadow-2xs hover:shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white text-[#08765D] border border-[#DCE5E0]">
                        {c.category}
                      </span>
                      <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full">
                        Coming Soon
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-[#102D37] mb-1.5 group-hover:text-[#08765D] transition-colors">
                      {c.name}
                    </h4>

                    {c.audience && (
                      <div className="text-[11px] font-semibold text-[#52676D] mb-2">
                        Target: {c.audience}
                      </div>
                    )}

                    <p className="text-xs text-[#52676D] leading-relaxed mb-4">
                      {c.tagline}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#DCE5E0] flex items-center justify-between">
                    <button
                      onClick={() => handleNotifyMe(c)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#08765D] hover:text-[#065F4B] transition-colors"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>Notify Me When Live</span>
                    </button>

                    <button
                      onClick={() => handleNotifyMe(c)}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-white hover:bg-[#EAF4EF] text-[#102D37] border border-[#DCE5E0] rounded-lg transition-colors"
                    >
                      Join Waitlist
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* PART 2: DIRECT WHATSAPP FEEDBACK (COMPLETELY SEPARATE)         */}
        {/* ============================================================== */}
        <div className="pt-4 border-t border-[#DCE5E0]">
          <div className="bg-gradient-to-r from-[#F0F7F4] via-white to-[#F5F7F6] rounded-3xl p-6 sm:p-10 border border-[#bcdbc8] shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              <div className="lg:col-span-8 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#EAF4EF] text-[#08765D] border border-[#bcdbc8]">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Direct 1-on-1 WhatsApp Chat</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#102D37] tracking-tight">
                  Have feedback or questions?
                </h3>

                <p className="text-sm text-[#52676D] leading-relaxed max-w-2xl">
                  Connect with us for portal suggestions, job posting inquiries, or technical questions. Whether you found a broken link, have feature suggestions, or need assistance, message us directly on WhatsApp.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#102D37]">
                    <CheckCircle2 className="w-4 h-4 text-[#08765D]" />
                    <span>Direct WhatsApp Chat</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#102D37]">
                    <CheckCircle2 className="w-4 h-4 text-[#08765D]" />
                    <span>Quick Responses</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#102D37]">
                    <CheckCircle2 className="w-4 h-4 text-[#08765D]" />
                    <span>Free for Candidates &amp; Employers</span>
                  </div>
                </div>
              </div>

              {/* Action Box */}
              <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-[#DCE5E0] shadow-xs text-center space-y-4">
                <div className="text-xs text-[#52676D] font-medium">
                  Official WhatsApp:
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-[#102D37] tracking-tight">
                  {WHATSAPP_FEEDBACK_NUMBER}
                </div>

                <a
                  href={WHATSAPP_FEEDBACK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all hover:scale-[1.02]"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Connect with us on WhatsApp</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                <p className="text-[11px] text-[#52676D]">
                  Clicking opens a direct 1-on-1 private WhatsApp chat with us.
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Interactive Waitlist Modal for Coming Soon Channels */}
      <ChannelWaitlistModal
        channel={selectedUpcomingChannel}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}
