import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { JobsListingClient } from '@/components/JobsListingClient';
import { getJobs } from '@/lib/supabase';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Articleship Vacancies | CAJob.in',
  description: 'Verified CA Articleship openings with clear stipends, transfer policies, and firm details.',
};

export const revalidate = 3600;

export default async function ArticleshipPage() {
  const jobs = await getJobs();

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F6]">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <JobsListingClient
          initialJobs={jobs}
          initialCategory="Articleship"
          pageTitle="CA Articleship Vacancies"
          pageDescription="Explore verified article assistant openings for fresh registration and transfer across statutory audit, direct tax, GST, and financial advisory."
        />
      </main>
      <Footer />
    </div>
  );
}
