import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CommunityDirectoryClient } from '@/components/CommunityDirectoryClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'WhatsApp Community | CAJob.in',
  description:
    'Join the official CAJob.in WhatsApp community for verified CA vacancies, articleship openings, corporate industrial training, and finance opportunities.',
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
