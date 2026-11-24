import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getJobById, getJobs } from '@/lib/supabase';
import { JobCard } from '@/components/JobCard';
import {
  MapPin,
  Building2,
  Briefcase,
  Calendar,
  Share2,
  Bookmark,
  ArrowUpRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { formatDate, timeAgo } from '@/lib/utils';
import { Metadata } from 'next';

interface JobPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { id } = await params;
  const job = await getJobById(id);
  if (!job) {
    return { title: 'Job Not Found | CAJob.in' };
  }
  return {
    title: `${job.title} at ${job.employer} | CAJob.in`,
    description: job.description || `${job.title} vacancy in ${job.city}. Apply directly on CAJob.in`,
  };
}

export default async function JobDetailPage({ params }: JobPageProps) {
  const { id } = await params;
  const job = await getJobById(id);

  if (!job) {
    notFound();
  }

  // Related jobs
  const allJobs = await getJobs();
  const relatedJobs = allJobs
    .filter((j) => j.id !== job.id && (j.category === job.category || j.careerStage === job.careerStage))
    .slice(0, 3);

  // Schema.org JSON-LD for Google Job Search
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description || `${job.responsibilities || ''} ${job.requirements || ''}`,
    datePosted: job.postedOn || job.employerPostedOn || '2026-11-23',
    validThrough: job.closingDate || undefined,
    employmentType: job.employmentType === 'Full-time' ? 'FULL_TIME' : 'INTERN',
    hiringOrganization: {
      '@type': 'Organization',
      name: job.employer,
      sameAs: job.companyWebsite || undefined,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.city || 'India',
        addressCountry: 'IN',
      },
    },
    baseSalary: job.pay
      ? {
          '@type': 'MonetaryAmount',
          currency: 'INR',
          value: {
            '@type': 'QuantitativeValue',
            unitText: 'MONTH',
          },
        }
      : undefined,
  };

  const firstLetter = (job.employer || 'C').charAt(0).toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F6]">
      {/* Google Jobs Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* In-Website Back Navigation & Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#102D37] hover:text-[#08765D] bg-white hover:bg-[#EAF4EF] border border-[#DCE5E0] hover:border-[#08765D]/40 rounded-xl transition-all shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to all opportunities
          </Link>
          <nav className="hidden sm:flex items-center gap-1.5 text-xs text-[#52676D]">
            <Link href="/" className="hover:text-[#102D37]">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/jobs" className="hover:text-[#102D37]">Jobs</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#102D37] font-semibold truncate max-w-xs">{job.title}</span>
          </nav>
        </div>

        {/* Top Header Card */}
        <div className="bg-white rounded-3xl border border-[#DCE5E0] p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#EAF4EF] text-[#08765D] font-extrabold text-2xl flex items-center justify-center border border-[#bcdbc8] flex-shrink-0">
                {firstLetter}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#08765D]">
                  {job.careerStage || 'Career Opportunity'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102D37] tracking-tight mt-1">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[#52676D] mt-2">
                  <span className="font-semibold text-[#102D37]">{job.employer}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {job.city || 'India'}
                  </span>
                  {job.workMode && (
                    <>
                      <span>·</span>
                      <span className="px-2 py-0.5 rounded-md bg-[#EAF4EF] text-[#08765D] text-xs font-semibold">
                        {job.workMode}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Apply & Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {job.applyUrl && (
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[#08765D] hover:bg-[#065F4B] text-white font-bold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  Apply Directly
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#F0F4F2] text-xs">
            <div>
              <span className="text-[#52676D] block mb-1">Pay / Stipend</span>
              <span className="font-bold text-[#102D37] text-sm">{job.pay || 'As per norms / Undisclosed'}</span>
            </div>
            <div>
              <span className="text-[#52676D] block mb-1">Experience Required</span>
              <span className="font-bold text-[#102D37] text-sm">{job.experience || 'Fresher / Trainee'}</span>
            </div>
            <div>
              <span className="text-[#52676D] block mb-1">Notice / Joining</span>
              <span className="font-bold text-[#102D37] text-sm">{job.joiningNotice || 'Immediate / Negotiable'}</span>
            </div>
            <div>
              <span className="text-[#52676D] block mb-1">Posted On</span>
              <span className="font-bold text-[#102D37] text-sm">{timeAgo(job.postedOn || job.employerPostedOn)}</span>
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Body */}
          <div className="lg:col-span-8 space-y-8">
            {/* Description */}
            {job.description && (
              <div className="bg-white rounded-2xl border border-[#DCE5E0] p-6 sm:p-8 space-y-4">
                <h2 className="text-lg font-bold text-[#102D37]">Role Overview</h2>
                <div className="text-sm text-[#52676D] leading-relaxed whitespace-pre-line">
                  {job.description}
                </div>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities && (
              <div className="bg-white rounded-2xl border border-[#DCE5E0] p-6 sm:p-8 space-y-4">
                <h2 className="text-lg font-bold text-[#102D37]">Key Responsibilities</h2>
                <div className="text-sm text-[#52676D] leading-relaxed whitespace-pre-line">
                  {job.responsibilities}
                </div>
              </div>
            )}

            {/* Requirements & Qualifications */}
            {(job.requirements || job.qualification) && (
              <div className="bg-white rounded-2xl border border-[#DCE5E0] p-6 sm:p-8 space-y-4">
                <h2 className="text-lg font-bold text-[#102D37]">Eligibility & Requirements</h2>
                <div className="text-sm text-[#52676D] leading-relaxed whitespace-pre-line">
                  {job.requirements || job.qualification}
                </div>
              </div>
            )}

            {/* Skills */}
            {job.skills && (
              <div className="bg-white rounded-2xl border border-[#DCE5E0] p-6 sm:p-8 space-y-4">
                <h2 className="text-lg font-bold text-[#102D37]">Relevant Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.split(',').map((skill) => (
                    <span
                      key={skill.trim()}
                      className="px-3 py-1 bg-[#EAF4EF] text-[#08765D] rounded-lg text-xs font-semibold"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Instructions */}
            {job.applicationInstructions && (
              <div className="bg-[#EAF4EF] rounded-2xl border border-[#bcdbc8] p-6 space-y-2">
                <h3 className="text-sm font-bold text-[#08765D]">How to apply:</h3>
                <p className="text-xs text-[#102D37] leading-relaxed">
                  {job.applicationInstructions}
                </p>
              </div>
            )}

            {/* Bottom In-Website Back Button */}
            <div className="pt-4">
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#102D37] hover:text-[#08765D] bg-white hover:bg-[#EAF4EF] border border-[#DCE5E0] hover:border-[#08765D]/40 rounded-xl transition-all shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to all opportunities
              </Link>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-6">
            {/* About Company */}
            <div className="bg-white rounded-2xl border border-[#DCE5E0] p-6 space-y-4">
              <h3 className="text-base font-bold text-[#102D37]">About Employer</h3>
              <p className="text-xs text-[#52676D] leading-relaxed">
                {job.aboutCompany ||
                  `${job.employer} is hiring for this opportunity. Verified on official career channels.`}
              </p>
              {job.companyWebsite && (
                <a
                  href={job.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[#08765D] hover:underline inline-flex items-center gap-1"
                >
                  Visit company website
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Verification Note */}
            <div className="bg-white rounded-2xl border border-[#DCE5E0] p-6 space-y-3">
              <div className="flex items-center gap-2 text-[#08765D]">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-sm font-bold">CAJob.in Trust Notice</span>
              </div>
              <p className="text-xs text-[#52676D] leading-relaxed">
                Direct employer link. We never charge any fee from candidates. Always apply through official channels.
              </p>
              <div className="text-[11px] text-[#52676D]/70 pt-2 border-t border-[#F0F4F2]">
                Last checked: {job.lastChecked || 'November 2026'}
              </div>
            </div>
          </div>
        </div>

        {/* Related Jobs Section */}
        {relatedJobs.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#DCE5E0]">
            <h2 className="text-2xl font-bold text-[#102D37] mb-6">Similar Opportunities</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedJobs.map((j) => (
                <JobCard key={j.id} job={j} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
