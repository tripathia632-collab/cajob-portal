import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { JobsListingClient } from '@/components/JobsListingClient';
import { getJobs } from '@/lib/supabase';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CA Industrial Training Vacancies | CAJob.in',
  description: 'Verified CA Industrial Training vacancies in top corporates, investment banks, and MNCs.',
};


export default async function IndustrialTrainingPage() {
  const jobs = await getJobs();

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F6]">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <JobsListingClient
          initialJobs={jobs}
          initialCategory="Industrial Training"
          pageTitle="CA Industrial Training"
          pageDescription="ICAI-compliant corporate industrial training opportunities (9–12 months, min ₹15,000 stipend) across leading investment banks, FMCG, consulting and financial institutions."
        />
      </main>
      <Footer />
    </div>
  );
}
