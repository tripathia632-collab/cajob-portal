import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GateHero } from '@/components/GateHero';
import { FeaturedCategories } from '@/components/FeaturedCategories';
import { ThreeStepProcess, GuidanceSection } from '@/components/GuidanceSection';
import { EmployerBanner, NewsletterBanner } from '@/components/EmployerBanner';
import { JobCard } from '@/components/JobCard';
import { getJobs } from '@/lib/supabase';
import { ArrowUpRight } from 'lucide-react';


export default async function HomePage() {
  const allJobs = await getJobs();
  // Take top 6 published jobs for homepage grid
  const featuredJobs = allJobs.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F6]">
      <Navbar />

      <main className="flex-1">
        {/* Signature Gate Doorway & Orbiting Hero */}
        <GateHero />

        {/* Employer Brands / Teams Banner */}
        <section className="py-8 bg-white border-b border-[#DCE5E0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs font-bold uppercase tracking-wider text-[#52676D]/70 mb-4">
              Discover opportunities with leading firms & finance teams
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
              <span className="font-extrabold text-base tracking-widest text-[#102D37]">MERIDIAN</span>
              <span className="font-bold text-base tracking-wider text-[#102D37]">northstar</span>
              <span className="font-semibold text-base tracking-wide text-[#102D37]">Finverse</span>
              <span className="font-extrabold text-base tracking-widest text-[#102D37]">OAKLINE</span>
              <span className="font-bold text-base tracking-wider text-[#102D37]">SUMMIT</span>
              <span className="font-bold text-base text-[#102D37]">EY</span>
              <span className="font-bold text-base text-[#102D37]">Deloitte</span>
              <span className="font-bold text-base text-[#102D37]">Citi</span>
            </div>
          </div>
        </section>

        {/* Categories: Where do you want to go next? */}
        <FeaturedCategories />

        {/* Featured Jobs Section (Figma specification) */}
        <section className="py-16 bg-[#F5F7F6]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-bold tracking-widest uppercase text-[#08765D]">
                  Your next move
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#102D37] tracking-tight mt-1.5">
                  Fresh opportunities, real possibilities
                </h2>
                <p className="text-sm sm:text-base text-[#52676D] mt-2">
                  A focused selection across articleship, audit, tax, advisory and corporate finance.
                </p>
              </div>

              <Link
                href="/jobs"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-[#08765D] hover:text-white bg-white hover:bg-[#08765D] border border-[#bcdbc8] rounded-xl shadow-2xs transition-all w-fit"
              >
                View all jobs ({allJobs.length})
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        </section>

        {/* Three Step Process */}
        <ThreeStepProcess />

        {/* Career Guides & Free Resources */}
        <GuidanceSection />

        {/* Employer CTA Banner */}
        <EmployerBanner />

        {/* Newsletter Subscription */}
        <NewsletterBanner />
      </main>

      <Footer />
    </div>
  );
}
