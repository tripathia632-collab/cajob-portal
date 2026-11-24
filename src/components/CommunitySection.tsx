import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Users,
  ArrowUpRight,
  Sparkles,
  MessageCircle,
  Bell,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import {
  getCommunityChannels,
  WHATSAPP_FEEDBACK_NUMBER,
  WHATSAPP_FEEDBACK_URL,
  OFFICIAL_WHATSAPP_CHANNEL_URL,
} from '@/lib/community';

export function CommunitySection() {
  const channels = getCommunityChannels();
  const featuredChannel = channels.find((c) => c.featured) || channels[0];
  const otherChannels = channels.filter((c) => !c.featured);

  return (
    <section className="py-16 bg-white border-y border-[#DCE5E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-[#08765D] mb-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>CAJob.in Professional Community</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#102D37] tracking-tight">
              Join WhatsApp channels &amp; peer circles
            </h2>
            <p className="text-sm sm:text-base text-[#52676D] mt-2">
              Stay ahead with real-time vacancy alerts, off-market finance opportunities, and curated CA market insights.
            </p>
          </div>

          <Link
            href="/community"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-[#08765D] hover:text-white bg-white hover:bg-[#08765D] border border-[#bcdbc8] rounded-xl shadow-2xs transition-all w-fit btn-press-effect"
          >
            All community channels
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Top Flagship Banner: Core Finance for CAs */}
        <div className="mb-10 bg-gradient-to-br from-[#102D37] via-[#143d4a] to-[#08765D] rounded-3xl p-6 sm:p-10 text-white shadow-md relative overflow-hidden border border-[#2a6575]">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Channel Details */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#25D366]/20 text-[#a7e9d4] border border-[#25D366]/30">
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
                Official WhatsApp Channel · Free to Join
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md p-2 flex items-center justify-center border border-white/20 flex-shrink-0">
                  <Image
                    src="/brand/doorway-icon.png"
                    alt="Core Finance for CAs"
                    width={48}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {featuredChannel.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#bad1c5]">
                    {featuredChannel.category} · Verified CA &amp; Finance Network
                  </p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-[#d2e4dc] leading-relaxed max-w-2xl">
                {featuredChannel.tagline}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href={featuredChannel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm rounded-xl shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <svg
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z" />
                  </svg>
                  <span>Join Channel on WhatsApp</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                <div className="flex items-center gap-2 text-xs text-[#a7e9d4]">
                  <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
                  <span>Zero Spam · One-Way Broadcast</span>
                </div>
              </div>
            </div>

            {/* Right: Quick Feedback Box */}
            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#76d7b2]">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Direct WhatsApp Feedback</span>
              </div>
              <h4 className="text-lg font-bold text-white">Have queries or suggestions?</h4>
              <p className="text-xs text-[#bad1c5] leading-relaxed">
                Connect directly with our desk for portal feedback, vacancy inquiries, or employer partnerships.
              </p>
              <div className="p-3 bg-black/20 rounded-xl border border-white/10">
                <div className="text-[11px] text-[#bad1c5]">Direct Line &amp; WhatsApp:</div>
                <div className="text-base font-extrabold text-[#76d7b2] tracking-wide mt-0.5">
                  {WHATSAPP_FEEDBACK_NUMBER}
                </div>
              </div>
              <a
                href={WHATSAPP_FEEDBACK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-semibold text-xs rounded-xl transition-all"
              >
                <span>Message on WhatsApp</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Upcoming Groups & Sub-Communities Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[#102D37]">Specialized Sub-Communities &amp; Groups</h3>
            <span className="text-xs text-[#52676D]">Rolling out across segments</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherChannels.map((c) => (
              <div
                key={c.id}
                className="p-6 bg-[#F5F7F6] rounded-2xl border border-[#DCE5E0] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white text-[#08765D] border border-[#DCE5E0]">
                      {c.category}
                    </span>
                    <span className="text-[10px] font-semibold text-[#52676D] bg-[#DCE5E0]/60 px-2 py-0.5 rounded-full">
                      {c.status}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-[#102D37] mb-2">{c.name}</h4>
                  <p className="text-xs text-[#52676D] leading-relaxed mb-4">{c.tagline}</p>
                </div>

                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between pt-3 border-t border-[#DCE5E0] text-xs font-semibold text-[#08765D] hover:underline"
                >
                  <span>Follow via main channel</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
