import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { JobsListingClient } from '@/components/JobsListingClient';
import { getJobs } from '@/lib/supabase';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Qualified CA Jobs | CAJob.in',
  description: 'Newly qualified and experienced Chartered Accountant jobs in Audit, Tax, Advisory, and Industry.',
};

export const revalidate = 3600;

export default async function QualifiedCAJobsPage() {
  const jobs = await getJobs();

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F6]">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <JobsListingClient
          initialJobs={jobs}
          initialCategory="Qualified CA"
          pageTitle="Qualified CA Jobs"
          pageDescription="Direct opportunities for newly qualified and experienced Chartered Accountants in Big 4 firms, top accounting practices, MNCs, and corporate finance teams."
        />
      </main>
      <Footer />
    </div>
  );
}
