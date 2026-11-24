import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { NavigationProgress } from '@/components/NavigationProgress';
import { ScrollToTop } from '@/components/ScrollToTop';
import { WhatsAppFloatingButton } from '@/components/WhatsAppFloatingButton';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CAJob.in — The Focused CA & Finance Career Platform',
  description:
    'Find articleship, industrial training, qualified Chartered Accountant jobs, and finance careers. Verified vacancies, blogs, free templates and web tools.',
  icons: {
    icon: '/brand/doorway-icon.png',
    shortcut: '/brand/doorway-icon.png',
    apple: '/brand/doorway-icon.png',
  },
  openGraph: {
    title: 'CAJob.in — The Focused CA & Finance Career Platform',
    description:
      'Find articleship, industrial training, qualified Chartered Accountant jobs, and finance careers.',
    url: 'https://www.cajob.in',
    siteName: 'CAJob.in',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col font-sans bg-[#F5F7F6] text-[#102D37] selection:bg-[#EAF4EF] selection:text-[#08765D]">
        <NavigationProgress />
        {children}
        <WhatsAppFloatingButton />
        <ScrollToTop />
      </body>
    </html>
  );
}
