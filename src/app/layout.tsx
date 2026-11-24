import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CAJob.in — The Focused CA & Finance Career Platform',
  description:
    'Find articleship, industrial training, qualified Chartered Accountant jobs, and finance careers. Verified vacancies, career guides, free templates and web tools.',
  icons: {
    icon: '/brand/doorway.svg',
    shortcut: '/favicon.svg',
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
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#F5F7F6] text-[#102D37]">
        {children}
      </body>
    </html>
  );
}
