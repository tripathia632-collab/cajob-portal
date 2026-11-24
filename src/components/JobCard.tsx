'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Job } from '@/types';
import { Bookmark, Share2, ArrowUpRight, MapPin, Building2, Briefcase } from 'lucide-react';
import { timeAgo } from '@/lib/utils';

interface JobCardProps {
  job: Job;
  isSaved?: boolean;
  onToggleSave?: (jobId: string) => void;
}

export function JobCard({ job, isSaved = false, onToggleSave }: JobCardProps) {
  const [saved, setSaved] = useState(isSaved);
  const [copied, setCopied] = useState(false);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = !saved;
    setSaved(nextState);
    if (onToggleSave) onToggleSave(job.id);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/job/${job.id}`;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Determine avatar initial letter & color
  const firstLetter = (job.employer || job.title || 'C').charAt(0).toUpperCase();

  return (
    <div className="group bg-white rounded-2xl border border-[#DCE5E0] hover:border-[#08765D]/40 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Top Header: Company Avatar & Bookmark */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EAF4EF] text-[#08765D] font-bold text-base flex items-center justify-center border border-[#bcdbc8] flex-shrink-0 group-hover:bg-[#08765D] group-hover:text-white transition-colors">
              {firstLetter}
            </div>
            <div>
              <div className="text-sm font-semibold text-[#102D37] flex items-center gap-1.5">
                {job.employer || 'Confidential Employer'}
              </div>
              <div className="text-xs text-[#52676D] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#52676D]" />
                <span>{job.city || 'India'}</span>
                {job.workMode && (
                  <>
                    <span>·</span>
                    <span className="font-medium text-[#08765D]">{job.workMode}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleBookmark}
            className={`p-2 rounded-lg border transition-colors ${
              saved
                ? 'bg-[#08765D] text-white border-[#08765D]'
                : 'text-[#52676D] hover:text-[#102D37] hover:bg-[#F5F7F6] border-transparent'
            }`}
            aria-label={saved ? 'Remove saved job' : 'Save job'}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <Link href={`/job/${job.id}`} className="block group-hover:text-[#08765D] transition-colors">
          <h3 className="text-base sm:text-lg font-bold text-[#102D37] tracking-tight line-clamp-2 mb-2.5">
            {job.title}
          </h3>
        </Link>

        {/* Badges / Chips */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {job.careerStage && (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-[#EAF4EF] text-[#08765D] border border-[#bcdbc8]/60">
              {job.careerStage}
            </span>
          )}
          {job.category && (
            <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-[#F5F7F6] text-[#52676D] border border-[#DCE5E0]">
              {job.category}
            </span>
          )}
          {job.qualification && (
            <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-[#F5F7F6] text-[#52676D] border border-[#DCE5E0]">
              {job.qualification}
            </span>
          )}
        </div>

        {/* Experience & Pay Details */}
        <div className="text-xs text-[#52676D] flex items-center gap-3 mb-4">
          {job.experience && (
            <span className="flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5" />
              {job.experience}
            </span>
          )}
          {job.pay && (
            <>
              <span>·</span>
              <span className="font-semibold text-[#102D37]">{job.pay}</span>
            </>
          )}
        </div>
      </div>

      {/* Footer Row */}
      <div className="pt-3 border-t border-[#F0F4F2] flex items-center justify-between text-xs text-[#52676D]">
        <span>{timeAgo(job.postedOn || job.employerPostedOn)}</span>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-1.5 text-[#52676D] hover:text-[#102D37] hover:bg-[#F5F7F6] rounded-md transition-colors relative"
            title="Copy job link"
          >
            <Share2 className="w-4 h-4" />
            {copied && (
              <span className="absolute -top-7 right-0 px-2 py-0.5 bg-[#102D37] text-white text-[10px] rounded shadow-md">
                Copied!
              </span>
            )}
          </button>

          <Link
            href={`/job/${job.id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#08765D] hover:text-white bg-[#EAF4EF] hover:bg-[#08765D] rounded-lg transition-all"
          >
            View job
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
