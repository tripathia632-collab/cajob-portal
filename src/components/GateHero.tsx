'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Briefcase, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export function GateHero() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [careerStage, setCareerStage] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set('q', keyword);
    if (city) params.set('city', city);
    if (careerStage) params.set('stage', careerStage);
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F7F6] via-[#EAF4EF]/50 to-[#F5F7F6] pt-8 pb-14 border-b border-[#DCE5E0]">
      {/* Ambient background glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#d9ffbf]/20 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Grid: Copy & 3D Gate Doorway + Ambition Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero Copy (Figma style) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#EAF4EF] text-[#08765D] border border-[#bcdbc8]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#08765D]"></span>
              Built for finance. Built for your next.
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#102D37] tracking-tight leading-[1.12]">
              Find the right opportunity for your finance career
            </h1>

            <p className="text-lg text-[#52676D] max-w-xl leading-relaxed">
              From your first articleship to your next leadership move. Discover verified, direct-apply opportunities for CA students and finance professionals.
            </p>

            {/* Quick target group pills */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <Link
                href="/articleship"
                className="px-3.5 py-1.5 text-xs font-medium bg-white text-[#102D37] border border-[#DCE5E0] rounded-full hover:border-[#08765D] hover:text-[#08765D] transition-colors shadow-2xs"
              >
                CA students
              </Link>
              <Link
                href="/ca-jobs"
                className="px-3.5 py-1.5 text-xs font-medium bg-white text-[#102D37] border border-[#DCE5E0] rounded-full hover:border-[#08765D] hover:text-[#08765D] transition-colors shadow-2xs"
              >
                Qualified CAs
              </Link>
              <Link
                href="/finance-jobs"
                className="px-3.5 py-1.5 text-xs font-medium bg-white text-[#102D37] border border-[#DCE5E0] rounded-full hover:border-[#08765D] hover:text-[#08765D] transition-colors shadow-2xs"
              >
                Finance professionals
              </Link>
            </div>

            {/* Trust features */}
            <div className="flex items-center gap-6 pt-2 text-xs text-[#52676D]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#08765D]" />
                <span>No sign-up needed to browse</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#08765D]" />
                <span>Direct employer apply links</span>
              </div>
            </div>
          </div>

          {/* Right Hero: The Signature Gate Doorway with Orbiting Categories */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[390px] aspect-square flex items-center justify-center">
              {/* Radial glow halo */}
              <div
                className="absolute inset-8 rounded-full bg-gradient-to-tr from-[#75dcbb]/25 to-[#d9ffbf]/35 blur-2xl pointer-events-none"
                aria-hidden="true"
              />

              {/* 3D Gate Doorway SVG Graphic */}
              <svg
                viewBox="0 0 590 570"
                className="w-[280px] sm:w-[320px] h-auto drop-shadow-2xl relative z-10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="arch-front" x1="180" y1="80" x2="410" y2="450" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#d9ffbf" />
                    <stop offset=".28" stopColor="#75dcbb" />
                    <stop offset=".62" stopColor="#228e89" />
                    <stop offset="1" stopColor="#16434f" />
                  </linearGradient>
                  <linearGradient id="arch-side" x1="225" y1="70" x2="470" y2="475" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#96f1cd" />
                    <stop offset=".45" stopColor="#255e69" />
                    <stop offset="1" stopColor="#0d303e" />
                  </linearGradient>
                  <linearGradient id="arch-inner" x1="228" y1="160" x2="350" y2="440" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#071f27" />
                    <stop offset=".6" stopColor="#1a5d5d" />
                    <stop offset="1" stopColor="#a0dfac" />
                  </linearGradient>
                  <linearGradient id="floor" x1="166" y1="421" x2="444" y2="517" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#a3e4bb" />
                    <stop offset=".4" stopColor="#37747c" />
                    <stop offset="1" stopColor="#092b38" />
                  </linearGradient>
                  <linearGradient id="beam" x1="280" y1="190" x2="280" y2="488" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#d9ffbf" stopOpacity="0" />
                    <stop offset="1" stopColor="#d9ffbf" stopOpacity=".35" />
                  </linearGradient>
                  <radialGradient id="orb">
                    <stop stopColor="#dcffbf" />
                    <stop offset=".55" stopColor="#b4f2bc" />
                    <stop offset="1" stopColor="#4c9e8d" />
                  </radialGradient>
                  <filter id="blur"><feGaussianBlur stdDeviation="16" /></filter>
                  <filter id="shadow"><feGaussianBlur stdDeviation="9" /></filter>
                </defs>

                {/* Gate orbits backdrop */}
                <g stroke="#a7e9d4" strokeOpacity=".18">
                  <ellipse cx="296" cy="316" rx="242" ry="153" transform="rotate(-24 296 316)" />
                  <ellipse cx="296" cy="316" rx="282" ry="187" transform="rotate(-24 296 316)" />
                  <path d="M30 498h525M70 532h460" strokeOpacity=".1" />
                </g>

                {/* Floor shadow and threshold */}
                <ellipse cx="305" cy="493" rx="174" ry="21" fill="#000e17" opacity=".5" filter="url(#shadow)" />
                <path d="m132 452 177-49 166 58-169 65z" fill="#133d49" stroke="#6b9d99" strokeOpacity=".3" />
                <path d="m132 443 177-49 166 58-169 65z" fill="url(#floor)" stroke="#abdabc" strokeOpacity=".45" />
                <path d="m132 443 174 62v12l-174-65z" fill="#174450" />
                <path d="m306 505 169-53v9l-169 65z" fill="#0b2838" />

                {/* 3D Gate Arches */}
                <path
                  d="M207 421V204c0-90 60-148 131-129 61 17 103 72 103 153v199l-47 14V224c0-60-27-103-66-113-45-12-77 30-77 91v205z"
                  fill="url(#arch-side)"
                  stroke="#a6e6cd"
                  strokeOpacity=".35"
                />
                <path
                  d="M166 435V219c0-91 59-148 130-130 62 17 104 73 104 154v198l-49-17V242c0-58-25-100-65-111-44-12-72 29-72 90v198z"
                  fill="url(#arch-front)"
                  stroke="#c1f1d3"
                  strokeOpacity=".6"
                />
                <path
                  d="M214 420V222c0-62 29-103 72-91 39 11 65 52 65 111v182l-48 14z"
                  fill="url(#arch-inner)"
                />
                <path
                  d="M214 420V222c0-62 29-103 72-91 39 11 65 52 65 111v182"
                  stroke="#b9f7ce"
                  strokeOpacity=".6"
                />
                <path d="M172 427V219c0-85 55-141 122-124" stroke="#e1ffc8" strokeOpacity=".65" />
                <path d="m236 245 95 23 39 180-159-10z" fill="url(#beam)" filter="url(#blur)" />

                {/* Floating orb & sparks */}
                <g>
                  <circle cx="441" cy="142" r="20" fill="url(#orb)" />
                  <circle cx="435" cy="135" r="5" fill="#efffdc" opacity=".6" filter="url(#shadow)" />
                </g>
                <g stroke="#c7efc9" strokeOpacity=".65">
                  <path d="M119 166v18m-9-9h18M475 359v12m-6-6h12" />
                </g>
              </svg>

              {/* Circling Orbit Track and Counter-Rotating Category Tags */}
              <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
                <div
                  className="relative w-full h-full animate-orbit-slow"
                  style={{ transformOrigin: 'center center' }}
                >
                  {/* Label 1: Articleship at 0deg */}
                  <div
                    className="absolute left-1/2 top-1/2"
                    style={{
                      transform: 'translate(-50%, -50%) rotate(0deg) translateX(140px) rotate(0deg)',
                    }}
                  >
                    <div className="animate-counter-slow pointer-events-auto">
                      <Link
                        href="/articleship"
                        className="block px-3 py-1.5 text-xs font-semibold text-[#e4f1d9] bg-[#102D37]/90 hover:bg-[#08765D] border border-[#bddfce]/30 rounded-full shadow-lg backdrop-blur-md transition-all hover:scale-105 whitespace-nowrap"
                      >
                        Articleship
                      </Link>
                    </div>
                  </div>

                  {/* Label 2: Industrial Training at 90deg */}
                  <div
                    className="absolute left-1/2 top-1/2"
                    style={{
                      transform: 'translate(-50%, -50%) rotate(90deg) translateX(140px) rotate(-90deg)',
                    }}
                  >
                    <div className="animate-counter-slow pointer-events-auto">
                      <Link
                        href="/industrial-training"
                        className="block px-3 py-1.5 text-xs font-semibold text-[#e4f1d9] bg-[#102D37]/90 hover:bg-[#08765D] border border-[#bddfce]/30 rounded-full shadow-lg backdrop-blur-md transition-all hover:scale-105 whitespace-nowrap"
                      >
                        Industrial training
                      </Link>
                    </div>
                  </div>

                  {/* Label 3: CA Careers at 180deg */}
                  <div
                    className="absolute left-1/2 top-1/2"
                    style={{
                      transform: 'translate(-50%, -50%) rotate(180deg) translateX(140px) rotate(-180deg)',
                    }}
                  >
                    <div className="animate-counter-slow pointer-events-auto">
                      <Link
                        href="/ca-jobs"
                        className="block px-3 py-1.5 text-xs font-semibold text-[#e4f1d9] bg-[#102D37]/90 hover:bg-[#08765D] border border-[#bddfce]/30 rounded-full shadow-lg backdrop-blur-md transition-all hover:scale-105 whitespace-nowrap"
                      >
                        CA careers
                      </Link>
                    </div>
                  </div>

                  {/* Label 4: Finance Jobs at 270deg */}
                  <div
                    className="absolute left-1/2 top-1/2"
                    style={{
                      transform: 'translate(-50%, -50%) rotate(270deg) translateX(140px) rotate(-270deg)',
                    }}
                  >
                    <div className="animate-counter-slow pointer-events-auto">
                      <Link
                        href="/finance-jobs"
                        className="block px-3 py-1.5 text-xs font-semibold text-[#e4f1d9] bg-[#102D37]/90 hover:bg-[#08765D] border border-[#bddfce]/30 rounded-full shadow-lg backdrop-blur-md transition-all hover:scale-105 whitespace-nowrap"
                      >
                        Finance jobs
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Search Box (Figma specification) */}
        <div className="mt-10 bg-white rounded-2xl shadow-xl border border-[#DCE5E0] p-4 sm:p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-10 gap-3">
              {/* Field 1: Role, skill or employer */}
              <div className="lg:col-span-4 relative">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#52676D] mb-1.5">
                  What are you looking for?
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-[#52676D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Job title, skill or employer"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F5F7F6] text-[#102D37] rounded-xl text-sm border border-transparent focus:border-[#08765D] focus:bg-white focus:outline-none transition-all placeholder:text-[#52676D]/60"
                  />
                </div>
              </div>

              {/* Field 2: Location */}
              <div className="lg:col-span-3 relative">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#52676D] mb-1.5">
                  Where?
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#52676D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City or remote"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F5F7F6] text-[#102D37] rounded-xl text-sm border border-transparent focus:border-[#08765D] focus:bg-white focus:outline-none transition-all placeholder:text-[#52676D]/60"
                  />
                </div>
              </div>

              {/* Field 3: Career Stage */}
              <div className="lg:col-span-2 relative">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#52676D] mb-1.5">
                  Career Stage
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-[#52676D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={careerStage}
                    onChange={(e) => setCareerStage(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F5F7F6] text-[#102D37] rounded-xl text-sm border border-transparent focus:border-[#08765D] focus:bg-white focus:outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="">All stages</option>
                    <option value="Articleship">Articleship</option>
                    <option value="Industrial Training">Industrial Training</option>
                    <option value="Qualified CA">Qualified CA</option>
                    <option value="Other Finance Jobs">Other Finance</option>
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <div className="lg:col-span-1 flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-[#08765D] hover:bg-[#065F4B] text-white font-medium text-sm rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 h-[42px]"
                >
                  <span>Search</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Popular Searches */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-[#52676D]">
              <span className="font-semibold text-[#102D37]">Popular:</span>
              {[
                { label: 'Articleship', href: '/articleship' },
                { label: 'Industrial Training', href: '/industrial-training' },
                { label: 'Qualified CA Jobs', href: '/ca-jobs' },
                { label: 'Statutory Audit', href: '/jobs?q=Audit' },
                { label: 'M&A Tax', href: '/jobs?q=Tax' },
                { label: 'FP&A', href: '/jobs?q=FP%26A' },
                { label: 'Mumbai', href: '/jobs?city=Mumbai' },
                { label: 'Bengaluru', href: '/jobs?city=Bengaluru' },
                { label: 'Remote', href: '/jobs?q=Remote' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-2.5 py-1 bg-[#F5F7F6] hover:bg-[#EAF4EF] text-[#52676D] hover:text-[#08765D] rounded-lg transition-colors border border-transparent hover:border-[#bcdbc8]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
