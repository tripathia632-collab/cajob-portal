'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Briefcase, ArrowUpRight } from 'lucide-react';

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
    <section className="relative bg-gradient-to-b from-[#EAF4EF] via-[#EAF4EF]/60 to-[#F5F7F6] pt-8 pb-10 border-b border-[#DCE5E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top: Concise Headline & Signature Doorway with Orbiting Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Concise, Executive Copy */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#EAF4EF] text-[#08765D] border border-[#bcdbc8]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#08765D]"></span>
              Chartered Accountants &amp; Finance
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#102D37] tracking-tight leading-[1.15]">
              The Dedicated Career Platform for CAs &amp; Finance
            </h1>

            <p className="text-base text-[#52676D] max-w-xl leading-relaxed">
              Verified articleship, industrial training, qualified CA roles, and finance vacancies across India with direct employer applications.
            </p>
          </div>

          {/* Right: Signature 3D Doorway with Orbiting Category Tags */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center">
              {/* Authentic User 3D Doorway - Ultra-HD without background drops or artificial shapes */}
              <div className="relative w-48 sm:w-52 h-60 sm:h-64 flex items-center justify-center z-10">
                <Image
                  src="/brand/doorway-icon.png"
                  alt="cajob.in"
                  width={220}
                  height={310}
                  className="w-full h-full object-contain filter drop-shadow-sm"
                  priority
                />
              </div>

              {/* Circling Orbit Track and Counter-Rotating Category Tags */}
              <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
                <div
                  className="relative w-full h-full animate-orbit-slow"
                  style={{ transformOrigin: 'center center' }}
                >
                  {/* Label 1: Articleship */}
                  <div
                    className="absolute left-1/2 top-1/2"
                    style={{
                      transform: 'translate(-50%, -50%) rotate(0deg) translateX(130px) rotate(0deg)',
                    }}
                  >
                    <div className="animate-counter-slow pointer-events-auto">
                      <Link
                        href="/articleship"
                        className="block px-3 py-1 text-xs font-semibold text-[#e4f1d9] bg-[#102D37]/90 hover:bg-[#08765D] border border-[#bddfce]/30 rounded-full shadow-md backdrop-blur-md transition-all hover:scale-105 whitespace-nowrap"
                      >
                        Articleship
                      </Link>
                    </div>
                  </div>

                  {/* Label 2: Industrial Training */}
                  <div
                    className="absolute left-1/2 top-1/2"
                    style={{
                      transform: 'translate(-50%, -50%) rotate(90deg) translateX(130px) rotate(-90deg)',
                    }}
                  >
                    <div className="animate-counter-slow pointer-events-auto">
                      <Link
                        href="/industrial-training"
                        className="block px-3 py-1 text-xs font-semibold text-[#e4f1d9] bg-[#102D37]/90 hover:bg-[#08765D] border border-[#bddfce]/30 rounded-full shadow-md backdrop-blur-md transition-all hover:scale-105 whitespace-nowrap"
                      >
                        Industrial training
                      </Link>
                    </div>
                  </div>

                  {/* Label 3: CA Careers */}
                  <div
                    className="absolute left-1/2 top-1/2"
                    style={{
                      transform: 'translate(-50%, -50%) rotate(180deg) translateX(130px) rotate(-180deg)',
                    }}
                  >
                    <div className="animate-counter-slow pointer-events-auto">
                      <Link
                        href="/ca-jobs"
                        className="block px-3 py-1 text-xs font-semibold text-[#e4f1d9] bg-[#102D37]/90 hover:bg-[#08765D] border border-[#bddfce]/30 rounded-full shadow-md backdrop-blur-md transition-all hover:scale-105 whitespace-nowrap"
                      >
                        CA careers
                      </Link>
                    </div>
                  </div>

                  {/* Label 4: Finance Jobs */}
                  <div
                    className="absolute left-1/2 top-1/2"
                    style={{
                      transform: 'translate(-50%, -50%) rotate(270deg) translateX(130px) rotate(-270deg)',
                    }}
                  >
                    <div className="animate-counter-slow pointer-events-auto">
                      <Link
                        href="/finance-jobs"
                        className="block px-3 py-1 text-xs font-semibold text-[#e4f1d9] bg-[#102D37]/90 hover:bg-[#08765D] border border-[#bddfce]/30 rounded-full shadow-md backdrop-blur-md transition-all hover:scale-105 whitespace-nowrap"
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

        {/* Compact Search Card */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-[#DCE5E0] p-4 sm:p-5">
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-10 gap-3">
              {/* Field 1: Role, skill or employer */}
              <div className="lg:col-span-4 relative">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#52676D] mb-1">
                  What are you looking for?
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-[#52676D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Job title, skill or employer"
                    className="w-full pl-10 pr-4 py-2 bg-[#F5F7F6] text-[#102D37] rounded-xl text-sm border border-transparent focus:border-[#08765D] focus:bg-white focus:outline-none transition-all placeholder:text-[#52676D]/60"
                  />
                </div>
              </div>

              {/* Field 2: Location */}
              <div className="lg:col-span-3 relative">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#52676D] mb-1">
                  Where?
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#52676D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City or remote"
                    className="w-full pl-10 pr-4 py-2 bg-[#F5F7F6] text-[#102D37] rounded-xl text-sm border border-transparent focus:border-[#08765D] focus:bg-white focus:outline-none transition-all placeholder:text-[#52676D]/60"
                  />
                </div>
              </div>

              {/* Field 3: Career Stage */}
              <div className="lg:col-span-2 relative">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#52676D] mb-1">
                  Career Stage
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-[#52676D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={careerStage}
                    onChange={(e) => setCareerStage(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#F5F7F6] text-[#102D37] rounded-xl text-sm border border-transparent focus:border-[#08765D] focus:bg-white focus:outline-none transition-all appearance-none cursor-pointer"
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
                  className="w-full py-2 px-4 bg-[#08765D] hover:bg-[#065F4B] text-white font-medium text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 h-[38px]"
                >
                  <span>Search</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Popular Searches */}
            <div className="pt-1 flex flex-wrap items-center gap-1.5 text-xs text-[#52676D]">
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
                  className="px-2.5 py-0.5 bg-[#F5F7F6] hover:bg-[#EAF4EF] text-[#52676D] hover:text-[#08765D] rounded-lg transition-colors text-[11px]"
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
