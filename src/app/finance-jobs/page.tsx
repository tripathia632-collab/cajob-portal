import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { JobsListingClient } from '@/components/JobsListingClient';
import { getJobs } from '@/lib/supabase';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Finance & Analyst Jobs | CAJob.in',
  description: 'Finance jobs for CA Inter, semi-qualified, financial analysts, accountants, and FP&A specialists.',
};


export default async function FinanceJobsPage() {
  const jobs = await getJobs();

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F6]">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <JobsListingClient
          initialJobs={jobs}
          initialCategory="Other Finance Jobs"
          pageTitle="Other Finance Opportunities"
          pageDescription="Career openings for CA Inter, semi-qualified professionals, credit analysts, financial controllers, and accountants."
        />
      </main>
      <Footer />
    </div>
  );
}
