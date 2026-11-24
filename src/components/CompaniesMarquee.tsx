'use client';

import React from 'react';
import Link from 'next/link';

interface Company {
  id: string;
  name: string;
  query: string;
  tagline?: string;
  renderLogo: () => React.ReactNode;
}

const companies: Company[] = [
  {
    id: 'deloitte',
    name: 'Deloitte',
    query: 'Deloitte',
    renderLogo: () => (
      <div className="flex items-center">
        <span className="font-extrabold text-base tracking-tight text-[#102D37]">Deloitte</span>
        <span className="w-2 h-2 rounded-full bg-[#86BC25] inline-block ml-0.5"></span>
      </div>
    ),
  },
  {
    id: 'pwc',
    name: 'PwC',
    query: 'PwC',
    renderLogo: () => (
      <div className="flex items-center gap-1.5">
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="7" width="8" height="8" fill="#E0301E" rx="1" />
          <rect x="7" y="3" width="8" height="8" fill="#EB8C00" rx="1" opacity="0.9" />
          <rect x="13" y="9" width="8" height="8" fill="#D04A02" rx="1" opacity="0.95" />
        </svg>
        <span className="font-extrabold text-base tracking-tight lowercase text-[#2D2D2D]">pwc</span>
      </div>
    ),
  },
  {
    id: 'ey',
    name: 'EY',
    query: 'EY',
    renderLogo: () => (
      <div className="flex items-center gap-1.5">
        <div className="relative font-black text-lg tracking-tighter text-[#102D37] leading-none">
          EY
          <span className="absolute -top-1 -right-2 w-3.5 h-1.5 bg-[#FFE600] -rotate-12 rounded-xs"></span>
        </div>
      </div>
    ),
  },
  {
    id: 'kpmg',
    name: 'KPMG',
    query: 'KPMG',
    renderLogo: () => (
      <div className="flex items-center gap-1.5">
        <div className="flex gap-0.5 items-center">
          <div className="w-2 h-4.5 bg-[#00338D] rounded-xs"></div>
          <div className="w-2 h-4.5 bg-[#005EB8] rounded-xs"></div>
          <div className="w-2 h-4.5 bg-[#0091DA] rounded-xs"></div>
          <div className="w-2 h-4.5 bg-[#483698] rounded-xs"></div>
        </div>
        <span className="font-black text-base tracking-wider text-[#00338D]">KPMG</span>
      </div>
    ),
  },
  {
    id: 'bdo',
    name: 'BDO',
    query: 'BDO',
    renderLogo: () => (
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-md bg-[#ED1622] flex items-center justify-center text-white font-black text-[10px] shadow-2xs">
          B
        </div>
        <span className="font-extrabold text-base tracking-widest text-[#ED1622]">BDO</span>
      </div>
    ),
  },
  {
    id: 'grant-thornton',
    name: 'Grant Thornton',
    query: 'Grant Thornton',
    renderLogo: () => (
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-[#5B2D86] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="9" strokeDasharray="36 14" />
        </svg>
        <span className="font-bold text-sm tracking-tight text-[#102D37] whitespace-nowrap">Grant Thornton</span>
      </div>
    ),
  },
  {
    id: 'goldman-sachs',
    name: 'Goldman Sachs',
    query: 'Goldman Sachs',
    renderLogo: () => (
      <div className="flex items-center gap-2">
        <div className="px-1.5 py-0.5 bg-[#7399C6] text-white font-serif font-bold text-[9px] rounded-xs tracking-tight">
          GS
        </div>
        <span className="font-serif font-bold text-sm tracking-tight text-[#102D37] whitespace-nowrap">Goldman Sachs</span>
      </div>
    ),
  },
  {
    id: 'jp-morgan',
    name: 'J.P. Morgan',
    query: 'J.P. Morgan',
    renderLogo: () => (
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 rounded-full border-2 border-[#1B365D] flex items-center justify-center font-serif text-[9px] font-bold text-[#1B365D]">
          J
        </div>
        <span className="font-serif font-bold text-sm tracking-tight text-[#1B365D] whitespace-nowrap">J.P. Morgan</span>
      </div>
    ),
  },
  {
    id: 'morgan-stanley',
    name: 'Morgan Stanley',
    query: 'Morgan Stanley',
    renderLogo: () => (
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-4 bg-[#002D62] rounded-xs"></div>
        <span className="font-bold text-xs uppercase tracking-wider text-[#002D62] whitespace-nowrap">Morgan Stanley</span>
      </div>
    ),
  },
  {
    id: 'tata',
    name: 'Tata Group',
    query: 'Tata',
    renderLogo: () => (
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-[#004B87] flex items-center justify-center text-white font-extrabold text-[10px]">
          T
        </div>
        <span className="font-extrabold text-sm tracking-widest text-[#004B87]">TATA</span>
      </div>
    ),
  },
  {
    id: 'reliance',
    name: 'Reliance',
    query: 'Reliance',
    renderLogo: () => (
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-[#D12630] flex items-center justify-center text-white font-bold text-[10px]">
          R
        </div>
        <span className="font-extrabold text-sm tracking-wide text-[#0A2240]">Reliance</span>
      </div>
    ),
  },
  {
    id: 'hdfc',
    name: 'HDFC Bank',
    query: 'HDFC',
    renderLogo: () => (
      <div className="flex items-center gap-2">
        <svg className="w-4.5 h-4.5 flex-shrink-0" viewBox="0 0 20 20" fill="none">
          <rect width="20" height="20" rx="3" fill="#004C8F" />
          <rect x="3" y="8" width="14" height="4" fill="#ED1C24" />
          <rect x="8" y="3" width="4" height="14" fill="#ED1C24" />
          <rect x="8" y="8" width="4" height="4" fill="#FFFFFF" />
        </svg>
        <span className="font-extrabold text-xs tracking-wider text-[#004C8F] whitespace-nowrap">HDFC BANK</span>
      </div>
    ),
  },
  {
    id: 'icici',
    name: 'ICICI Bank',
    query: 'ICICI',
    renderLogo: () => (
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-[#F37021] flex items-center justify-center text-white font-bold text-xs italic">
          i
        </div>
        <span className="font-extrabold text-sm tracking-tight text-[#A32020] whitespace-nowrap">ICICI Bank</span>
      </div>
    ),
  },
  {
    id: 'lt',
    name: 'Larsen & Toubro',
    query: 'Larsen & Toubro',
    renderLogo: () => (
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full border-2 border-[#003B71] flex items-center justify-center font-bold text-[9px] text-[#003B71]">
          L&amp;T
        </div>
        <span className="font-black text-sm tracking-widest text-[#003B71]">L&amp;T</span>
      </div>
    ),
  },
  {
    id: 'citi',
    name: 'Citi',
    query: 'Citi',
    renderLogo: () => (
      <div className="flex items-center gap-1 relative">
        <span className="font-bold text-base tracking-tight text-[#002D72]">citi</span>
        <span className="absolute -top-1 right-1.5 w-4 h-2 border-t-2 border-r-2 border-[#ED1C24] rounded-tr-full"></span>
      </div>
    ),
  },
  {
    id: 'barclays',
    name: 'Barclays',
    query: 'Barclays',
    renderLogo: () => (
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-[#00AEEF] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L15 8H21L16 12L18 18L12 14L6 18L8 12L3 8H9L12 2Z" />
        </svg>
        <span className="font-black text-xs tracking-widest text-[#00395D]">BARCLAYS</span>
      </div>
    ),
  },
  {
    id: 'hsbc',
    name: 'HSBC',
    query: 'HSBC',
    renderLogo: () => (
      <div className="flex items-center gap-2">
        <svg className="w-5 h-3.5 flex-shrink-0" viewBox="0 0 24 16" fill="none">
          <rect width="24" height="16" fill="#FFFFFF" />
          <polygon points="0,0 12,8 0,16" fill="#DB0011" />
          <polygon points="24,0 12,8 24,16" fill="#DB0011" />
          <polygon points="6,4 18,4 12,8" fill="#DB0011" />
          <polygon points="6,12 18,12 12,8" fill="#DB0011" />
        </svg>
        <span className="font-bold text-sm tracking-wider text-[#DB0011]">HSBC</span>
      </div>
    ),
  },
  {
    id: 'aditya-birla',
    name: 'Aditya Birla Group',
    query: 'Aditya Birla',
    renderLogo: () => (
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#9B1D22] to-[#FDB813] flex items-center justify-center text-white font-bold text-[8px]">
          AB
        </div>
        <span className="font-bold text-xs uppercase tracking-wider text-[#102D37] whitespace-nowrap">Aditya Birla</span>
      </div>
    ),
  },
  {
    id: 'kotak',
    name: 'Kotak Mahindra',
    query: 'Kotak',
    renderLogo: () => (
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-full bg-[#ED1C24] flex items-center justify-center text-white font-bold text-[10px]">
          ∞
        </div>
        <span className="font-bold text-sm tracking-tight text-[#003366]">kotak</span>
      </div>
    ),
  },
  {
    id: 'itc',
    name: 'ITC Limited',
    query: 'ITC',
    renderLogo: () => (
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-[#17448B] flex items-center justify-center text-white font-bold text-[9px]">
          ITC
        </div>
        <span className="font-bold text-xs tracking-wider text-[#17448B] whitespace-nowrap">ITC Limited</span>
      </div>
    ),
  },
  {
    id: 'mazars',
    name: 'Mazars',
    query: 'Mazars',
    renderLogo: () => (
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-[#0A3254] rounded-xs rotate-45 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-[#41B6E6] rounded-xs"></div>
        </div>
        <span className="font-extrabold text-sm tracking-wider text-[#0A3254]">mazars</span>
      </div>
    ),
  },
  {
    id: 'rsm',
    name: 'RSM India',
    query: 'RSM',
    renderLogo: () => (
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">
          <div className="w-1.5 h-4 bg-[#00828A]"></div>
          <div className="w-1.5 h-4 bg-[#54585A]"></div>
          <div className="w-1.5 h-4 bg-[#A7A8AA]"></div>
        </div>
        <span className="font-black text-sm tracking-widest text-[#00828A]">RSM</span>
      </div>
    ),
  },
];

export function CompaniesMarquee() {
  return (
    <section className="py-7 bg-white border-b border-[#DCE5E0] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-widest text-[#52676D]">
            Leading destinations for articleship, industrial training &amp; CA careers
          </p>
          <span className="text-[11px] font-medium text-[#8CA89A]">
            Big 4 · Top Advisory · Global Investment Banks · Blue-chip Corporates
          </span>
        </div>
      </div>

      {/* Marquee Track Container with Gradient Edge Fades */}
      <div className="relative w-full overflow-hidden">
        {/* Left Gradient Edge Fade */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />

        {/* Right Gradient Edge Fade */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

        {/* Animated Infinite Loop */}
        <div className="animate-marquee flex items-center gap-4 sm:gap-6 py-2">
          {/* First loop of companies */}
          {companies.map((c) => (
            <Link
              key={`c1-${c.id}`}
              href={`/jobs?q=${encodeURIComponent(c.query)}`}
              className="flex-shrink-0 flex items-center px-4 sm:px-5 py-2.5 rounded-2xl bg-[#F5F7F6] hover:bg-[#EAF4EF] border border-[#DCE5E0] hover:border-[#08765D]/60 transition-all duration-200 hover:scale-105 shadow-2xs hover:shadow-sm group cursor-pointer"
              title={`View openings at ${c.name}`}
            >
              <div className="transition-all duration-200 opacity-80 group-hover:opacity-100">
                {c.renderLogo()}
              </div>
            </Link>
          ))}

          {/* Second duplicate loop for seamless continuous circle */}
          {companies.map((c) => (
            <Link
              key={`c2-${c.id}`}
              href={`/jobs?q=${encodeURIComponent(c.query)}`}
              className="flex-shrink-0 flex items-center px-4 sm:px-5 py-2.5 rounded-2xl bg-[#F5F7F6] hover:bg-[#EAF4EF] border border-[#DCE5E0] hover:border-[#08765D]/60 transition-all duration-200 hover:scale-105 shadow-2xs hover:shadow-sm group cursor-pointer"
              title={`View openings at ${c.name}`}
            >
              <div className="transition-all duration-200 opacity-80 group-hover:opacity-100">
                {c.renderLogo()}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
