'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Users,
  MessageCircle,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Bell,
  ArrowLeft,
  Sparkles,
  Phone,
  Search,
} from 'lucide-react';
import {
  getCommunityChannels,
  WHATSAPP_FEEDBACK_NUMBER,
  WHATSAPP_FEEDBACK_URL,
  OFFICIAL_WHATSAPP_CHANNEL_URL,
  CommunityChannel,
} from '@/lib/community';
import { ChannelWaitlistModal } from '@/components/ChannelWaitlistModal';

export function CommunityDirectoryClient() {
  const allChannels = getCommunityChannels();
  const featured = allChannels.find((c) => c.featured) || allChannels[0];

  const [activeCategory, setActiveCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedUpcomingChannel, setSelectedUpcomingChannel] = useState<CommunityChannel | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const categories = [
    { id: 'ALL', label: 'All Community Groups (8)' },
    { id: 'Active', label: 'Active Now (1)' },
    { id: 'Articleship', label: 'Articleship & Training (2)' },
    { id: 'Finance', label: 'Finance & Deals (2)' },
    { id: 'TaxAudit', label: 'Tax & Audit (2)' },
    { id: 'Tech', label: 'Tech & Leadership (2)' },
  ];

  const filteredChannels = useMemo(() => {
    return allChannels.filter((c) => {
      // Search query
      if (search) {
        const q = search.toLowerCase();
        const matches =
          c.name.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.tagline.toLowerCase().includes(q) ||
          (c.audience && c.audience.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Category tab
      if (activeCategory === 'Active') return c.status === 'Active';
      if (activeCategory === 'Articleship') {
        return c.id.includes('articleship') || c.id.includes('industrial');
      }
      if (activeCategory === 'Finance') {
        return c.id.includes('finance') || c.id.includes('freshers');
      }
      if (activeCategory === 'TaxAudit') {
        return c.id.includes('tax') || c.id.includes('audit');
      }
      if (activeCategory === 'Tech') {
        return c.id.includes('tech') || c.id.includes('cfo');
      }

      return true;
    });
  }, [allChannels, activeCategory, search]);

  const handleNotifyMe = (channel: CommunityChannel) => {
    setSelectedUpcomingChannel(channel);
    setModalOpen(true);
  };

  return (
    <div className="py-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#52676D] mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-semibold text-[#52676D] hover:text-[#08765D] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </Link>
        <span className="text-[#DCE5E0]">/</span>
        <span className="text-[#102D37] font-semibold">WhatsApp Community</span>
      </nav>

      {/* Page Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-[#EAF4EF] text-[#08765D] border border-[#bcdbc8]">
          <Users className="w-3.5 h-3.5" />
          <span>Official WhatsApp Community</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#102D37] tracking-tight">
          CAJob.in WhatsApp Community
        </h1>
        <p className="text-sm sm:text-base text-[#52676D] leading-relaxed">
          Join our official WhatsApp community for verified CA vacancies, articleship openings, corporate industrial training, and finance opportunities.
        </p>
      </div>

      {/* ============================================================== */}
      {/* SECTION 1: LIVE BROADCAST SPOTLIGHT (Core Finance for CAs)     */}
      {/* ============================================================== */}
      <div className="mb-14 bg-gradient-to-br from-[#102D37] via-[#143e4d] to-[#08765D] rounded-3xl p-6 sm:p-12 text-white shadow-xl border border-[#2a6575] relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#25D366]/20 text-[#a7e9d4] border border-[#25D366]/30">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
              Official WhatsApp Community · Live &amp; Active
            </span>
            <span className="text-xs text-[#bad1c5]">
              Direct Broadcast · Zero Spam
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/10 backdrop-blur-md p-3 flex items-center justify-center border border-white/20 flex-shrink-0 shadow-inner">
              <Image
                src="/brand/doorway-icon.png"
                alt="Core Finance for CAs"
                width={64}
                height={84}
                className="object-contain"
              />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {featured.name}
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-[#76d7b2]">
                {featured.category} · Curated on cajob.in
              </p>
            </div>
          </div>

          <p className="text-sm sm:text-base text-[#d2e4dc] leading-relaxed max-w-3xl">
            {featured.description || featured.tagline}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href={featured.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm sm:text-base rounded-xl shadow-lg transition-all duration-200 hover:scale-105"
            >
              <svg
                className="w-5 h-5 fill-current"
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
              <span>Confidential Broadcast (Your mobile number remains hidden by WhatsApp)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION 2: COMMUNITY GROUPS FOR ALL KINDS OF DOMAINS          */}
      {/* ============================================================== */}
      <div className="mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#102D37]">
              Explore Community by Domain
            </h2>
            <p className="text-xs sm:text-sm text-[#52676D] mt-1">
              Select your career focus below to explore live and upcoming WhatsApp groups and broadcasts.
            </p>
          </div>

          {/* Search filter */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#52676D] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search community groups..."
              className="w-full pl-10 pr-4 py-2 bg-white text-[#102D37] text-xs rounded-xl border border-[#DCE5E0] focus:border-[#08765D] focus:outline-none transition-all placeholder:text-[#52676D]/60"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#08765D] text-white shadow-xs'
                  : 'bg-white text-[#52676D] hover:bg-[#EAF4EF] hover:text-[#08765D] border border-[#DCE5E0]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Channels & Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChannels.map((channel) => {
            const isActive = channel.status === 'Active';

            return (
              <div
                key={channel.id}
                className="bg-white rounded-3xl border border-[#DCE5E0] p-6 shadow-xs hover:border-[#08765D]/50 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#EAF4EF] text-[#08765D]">
                      {channel.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        isActive
                          ? 'bg-[#25D366]/15 text-[#065F4B] border-[#25D366]/40'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {channel.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#102D37] mb-1.5">
                    {channel.name}
                  </h3>

                  {channel.audience && (
                    <div className="text-[11px] font-semibold text-[#52676D] mb-2.5">
                      Target: {channel.audience}
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-[#52676D] leading-relaxed mb-4">
                    {channel.tagline}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F0F4F2]">
                  {isActive ? (
                    <a
                      href={channel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                    >
                      <span>Join WhatsApp Community</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleNotifyMe(channel)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-[#08765D] hover:bg-[#065F4B] text-white text-xs font-bold rounded-xl transition-colors"
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span>Notify Me</span>
                      </button>
                      <button
                        onClick={() => handleNotifyMe(channel)}
                        className="py-2.5 px-3 bg-[#F5F7F6] hover:bg-[#EAF4EF] text-[#52676D] hover:text-[#08765D] text-xs font-semibold rounded-xl border border-[#DCE5E0] transition-colors"
                      >
                        Waitlist
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION 3: DIRECT WHATSAPP FEEDBACK (COMPLETELY SEPARATE)       */}
      {/* ============================================================== */}
      <div className="mt-16 pt-10 border-t border-[#DCE5E0]">
        <div className="bg-[#102D37] rounded-3xl p-6 sm:p-10 text-white shadow-md relative overflow-hidden border border-[#1f4e5c]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#174450] text-[#76d7b2] border border-[#2a6575]">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Direct WhatsApp · 1-on-1 Chat</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Have feedback or questions?
              </h2>

              <p className="text-xs sm:text-sm text-[#bad1c5] leading-relaxed max-w-2xl">
                Connect with us for personal assistance, questions about vacancies, suggestions, or employer postings. This direct WhatsApp line is completely separate from our WhatsApp community groups above.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-[#d2e4dc]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#76d7b2]" />
                  <span>Private Direct Chat</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#76d7b2]" />
                  <span>Direct Communication</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#76d7b2]" />
                  <span>Fast Resolution</span>
                </div>
              </div>
            </div>

            {/* Right: Contact Box */}
            <div className="lg:col-span-4 bg-[#174450] rounded-2xl p-6 border border-[#2a6575] space-y-4 text-center">
              <div className="text-xs text-[#bad1c5]">
                Official WhatsApp:
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-white tracking-wide">
                {WHATSAPP_FEEDBACK_NUMBER}
              </div>

              <a
                href={WHATSAPP_FEEDBACK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all hover:scale-105"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Connect with us on WhatsApp</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <p className="text-[11px] text-[#8ca89a]">
                Direct private message with us.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Interactive Waitlist Modal */}
      <ChannelWaitlistModal
        channel={selectedUpcomingChannel}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
