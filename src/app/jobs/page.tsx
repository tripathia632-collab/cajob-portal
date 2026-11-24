import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { JobsListingClient } from '@/components/JobsListingClient';
import { getJobs } from '@/lib/supabase';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Jobs & Vacancies | CAJob.in',
  description: 'Search verified articleship, industrial training, qualified CA and finance opportunities.',
};

export const revalidate = 3600;

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F6]">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <JobsListingClient
          initialJobs={jobs}
          pageTitle="All Opportunities"
          pageDescription="Discover verified CA articleship, industrial training, qualified Chartered Accountant roles, and related finance vacancies."
        />
      </main>
      <Footer />
    </div>
  );
}
