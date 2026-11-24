import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
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
} from 'lucide-react';
import {
  getCommunityChannels,
  WHATSAPP_FEEDBACK_NUMBER,
  WHATSAPP_FEEDBACK_URL,
  OFFICIAL_WHATSAPP_CHANNEL_URL,
} from '@/lib/community';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'WhatsApp Channels & CA Community Hub | CAJob.in',
  description:
    'Join official CAJob.in WhatsApp channels and peer groups for real-time finance jobs, articleship vacancies, and industrial training updates.',
};

export const revalidate = 3600;

export default function CommunityPage() {
  const channels = getCommunityChannels();
  const featured = channels.find((c) => c.featured) || channels[0];
  const upcoming = channels.filter((c) => !c.featured);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F6]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
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
          <span className="text-[#102D37] font-semibold">Community</span>
        </nav>

        {/* Page Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold tracking-widest uppercase text-[#08765D]">
            Official Networks &amp; Alerts
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#102D37] tracking-tight mt-2">
            CAJob.in Community Hub
          </h1>
          <p className="text-sm sm:text-base text-[#52676D] mt-3">
            Join verified WhatsApp channels and interest circles to receive direct opportunity broadcasts, market insights, and peer support.
          </p>
        </div>

        {/* Featured Flagship Channel: Core Finance for CAs */}
        <div className="mb-12 bg-gradient-to-br from-[#102D37] via-[#143e4b] to-[#08765D] rounded-3xl p-8 sm:p-12 text-white shadow-lg border border-[#2a6575]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#25D366]/20 text-[#a7e9d4] border border-[#25D366]/30">
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
                Featured WhatsApp Channel · Active Now
              </div>

              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md p-2 flex items-center justify-center border border-white/20 flex-shrink-0">
                  <Image
                    src="/brand/doorway-icon.png"
                    alt="Core Finance for CAs"
                    width={52}
                    height={70}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {featured.name}
                  </h2>
                  <p className="text-sm text-[#bad1c5]">
                    {featured.category} · Curated by CAJob.in
                  </p>
                </div>
              </div>

              <p className="text-base text-[#d2e4dc] leading-relaxed max-w-2xl">
                {featured.tagline}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href={featured.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm rounded-xl shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <svg
                    className="w-5 h-5 fill-current"
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
                  <span>Private &amp; Confidential (Phone numbers remain hidden by WhatsApp)</span>
                </div>
              </div>
            </div>

            {/* Right: Direct WhatsApp Feedback Desk */}
            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/20 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#76d7b2]">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Direct WhatsApp Feedback</span>
              </div>
              <h3 className="text-xl font-bold text-white">Have feedback or questions?</h3>
              <p className="text-xs text-[#bad1c5] leading-relaxed">
                Connect directly with our team for portal suggestions, job posting inquiries, or technical support.
              </p>

              <div className="p-4 bg-black/25 rounded-2xl border border-white/10">
                <div className="text-[11px] text-[#bad1c5]">Official WhatsApp &amp; Support Line:</div>
                <div className="text-lg font-extrabold text-[#76d7b2] tracking-wide mt-1">
                  {WHATSAPP_FEEDBACK_NUMBER}
                </div>
              </div>

              <a
                href={WHATSAPP_FEEDBACK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-[#102D37] hover:bg-[#EAF4EF] font-bold text-xs rounded-xl shadow-md transition-all duration-200"
              >
                <span>Chat on WhatsApp</span>
                <ArrowUpRight className="w-4 h-4 text-[#08765D]" />
              </a>
            </div>
          </div>
        </div>

        {/* Specialized Sub-Communities & Groups Grid */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#102D37]">Specialized Sub-Communities</h2>
              <p className="text-xs sm:text-sm text-[#52676D] mt-1">
                We are actively rolling out niche groups for specific training stages and career paths.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#08765D] bg-[#EAF4EF] px-3 py-1 rounded-full border border-[#bcdbc8] w-fit">
              More groups rolling out
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcoming.map((channel) => (
              <div
                key={channel.id}
                className="bg-white rounded-3xl border border-[#DCE5E0] p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#EAF4EF] text-[#08765D]">
                      {channel.category}
                    </span>
                    <span className="text-[10px] font-semibold text-[#52676D] bg-[#F5F7F6] border border-[#DCE5E0] px-2.5 py-0.5 rounded-full">
                      {channel.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#102D37] mb-2">{channel.name}</h3>
                  <p className="text-xs sm:text-sm text-[#52676D] leading-relaxed mb-6">
                    {channel.tagline}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F0F4F2] flex items-center justify-between">
                  <a
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#08765D] hover:underline"
                  >
                    <span>Follow via main channel</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Join Section */}
        <section className="bg-white rounded-3xl border border-[#DCE5E0] p-6 sm:p-10 shadow-xs mb-10">
          <h3 className="text-xl font-bold text-[#102D37] mb-6">Why Join CAJob.in WhatsApp Communities?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#EAF4EF] text-[#08765D] flex items-center justify-center font-bold">
                <Bell className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#102D37]">Real-Time Vacancy Alerts</h4>
              <p className="text-xs text-[#52676D] leading-relaxed">
                Receive newly verified articleship, industrial training, and CA job posts the moment they go live.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#EAF4EF] text-[#08765D] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#102D37]">100% Privacy Protected</h4>
              <p className="text-xs text-[#52676D] leading-relaxed">
                WhatsApp Channels ensure your mobile number and identity remain completely hidden from other members.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#EAF4EF] text-[#08765D] flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#102D37]">Free Career Resources</h4>
              <p className="text-xs text-[#52676D] leading-relaxed">
                Get early access to downloadable financial models, interview frameworks, and statutory checklists.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
