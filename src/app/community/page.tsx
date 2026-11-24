import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CommunityDirectoryClient } from '@/components/CommunityDirectoryClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'WhatsApp Channels Directory | CAJob.in',
  description:
    'Explore official CAJob.in WhatsApp broadcast channels for verified finance roles, articleship openings, and industrial training updates.',
};

export const revalidate = 3600;

export default function CommunityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F6]">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <CommunityDirectoryClient />
      </main>
      <Footer />
    </div>
  );
}
