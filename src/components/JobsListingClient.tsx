'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Job } from '@/types';
import { JobCard } from '@/components/JobCard';
import { Search, MapPin, SlidersHorizontal, X, Briefcase, Filter, ArrowLeft, Clock } from 'lucide-react';
import { EXPERIENCE_SLABS, matchesExperienceSlab } from '@/lib/utils';

interface JobsListingClientProps {
  initialJobs: Job[];
  initialCategory?: string;
  pageTitle?: string;
  pageDescription?: string;
}

export function JobsListingClient({
  initialJobs,
  initialCategory = '',
  pageTitle = 'All Opportunities',
  pageDescription = 'Discover verified articleship, industrial training, qualified CA and finance openings across India.',
}: JobsListingClientProps) {
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [stageFilter, setStageFilter] = useState(initialCategory);
  const [modeFilter, setModeFilter] = useState('');
  const [expFilter, setExpFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);

  // Sync URL search parameters on mount (e.g. ?exp=fresher or ?city=Mumbai or ?stage=Articleship)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q');
      const city = params.get('city');
      const stage = params.get('stage');
      const exp = params.get('exp');
      if (q) setSearch(q);
      if (city) setCityFilter(city);
      if (stage) setStageFilter(stage);
      if (exp) setExpFilter(exp);
    }
  }, []);

  // Unique cities list for dropdown
  const cities = useMemo(() => {
    const set = new Set<string>();
    initialJobs.forEach((j) => {
      if (j.city) set.add(j.city.trim());
    });
    return Array.from(set).sort();
  }, [initialJobs]);

  const toggleSave = (jobId: string) => {
    setSavedJobIds((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  const filteredJobs = useMemo(() => {
    return initialJobs.filter((job) => {
      if (savedOnly && !savedJobIds.includes(job.id)) return false;

      // Text search
      if (search) {
        const q = search.toLowerCase();
        const matches =
          job.title?.toLowerCase().includes(q) ||
          job.employer?.toLowerCase().includes(q) ||
          job.category?.toLowerCase().includes(q) ||
          job.skills?.toLowerCase().includes(q) ||
          job.description?.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // City filter
      if (cityFilter && !job.city?.toLowerCase().includes(cityFilter.toLowerCase())) {
        return false;
      }

      // Stage / Category filter
      if (stageFilter) {
        const s = stageFilter.toLowerCase();
        const matchesStage =
          job.careerStage?.toLowerCase().includes(s) ||
          job.category?.toLowerCase().includes(s);
        if (!matchesStage) return false;
      }

      // Work mode filter
      if (modeFilter && job.workMode?.toLowerCase() !== modeFilter.toLowerCase()) {
        return false;
      }

      // Experience slab filter
      if (expFilter && !matchesExperienceSlab(job, expFilter)) {
        return false;
      }

      return true;
    });
  }, [initialJobs, search, cityFilter, stageFilter, modeFilter, expFilter, savedOnly, savedJobIds]);

  const activeFiltersCount = [
    Boolean(cityFilter),
    Boolean(stageFilter && stageFilter !== initialCategory),
    Boolean(modeFilter),
    Boolean(expFilter),
    savedOnly,
  ].filter(Boolean).length;

  const resetFilters = () => {
    setSearch('');
    setCityFilter('');
    setStageFilter(initialCategory);
    setModeFilter('');
    setExpFilter('');
    setSavedOnly(false);
  };

  return (
    <div className="py-10">
      {/* Breadcrumb & Home Link */}
      <nav className="flex items-center gap-2 text-xs text-[#52676D] mb-5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-semibold text-[#52676D] hover:text-[#08765D] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Home
        </Link>
        <span className="text-[#DCE5E0]">/</span>
        <span className="text-[#102D37] font-semibold">{pageTitle}</span>
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#102D37] tracking-tight">
          {pageTitle}
        </h1>
        <p className="text-sm sm:text-base text-[#52676D] mt-2 max-w-2xl">
          {pageDescription}
        </p>
      </div>

      {/* Main Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#DCE5E0] p-4 mb-8 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Keyword Search */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-[#52676D] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by role, skill or company..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#F5F7F6] text-[#102D37] rounded-xl text-sm border border-transparent focus:border-[#08765D] focus:bg-white focus:outline-none transition-all placeholder:text-[#52676D]/60"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#52676D] hover:text-[#102D37]"
              >
                Clear
              </button>
            )}
          </div>

          {/* City Dropdown */}
          <div className="md:col-span-2 relative">
            <MapPin className="w-4 h-4 text-[#52676D] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-[#F5F7F6] text-[#102D37] rounded-xl text-sm border border-transparent focus:border-[#08765D] focus:bg-white focus:outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">All Locations</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Career Stage Filter */}
          <div className="md:col-span-2 relative">
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#F5F7F6] text-[#102D37] rounded-xl text-sm border border-transparent focus:border-[#08765D] focus:bg-white focus:outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">All Stages</option>
              <option value="Articleship">Articleship</option>
              <option value="Industrial Training">Industrial Training</option>
              <option value="Qualified CA">Qualified CA</option>
              <option value="Other Finance Jobs">Other Finance</option>
            </select>
          </div>

          {/* Experience Level Filter Dropdown */}
          <div className="md:col-span-2 relative">
            <Briefcase className="w-4 h-4 text-[#52676D] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={expFilter}
              onChange={(e) => setExpFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-[#F5F7F6] text-[#102D37] rounded-xl text-sm border border-transparent focus:border-[#08765D] focus:bg-white focus:outline-none transition-all appearance-none cursor-pointer font-medium"
            >
              {EXPERIENCE_SLABS.map((slab) => (
                <option key={slab.id} value={slab.id}>
                  {slab.label}
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Filter Button / Reset */}
          <div className="md:col-span-2 flex items-center gap-2">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden flex-1 py-2.5 px-3 bg-[#EAF4EF] text-[#08765D] rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>

            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="py-2.5 px-3 text-xs font-semibold text-[#52676D] hover:text-[#102D37] hover:bg-[#F5F7F6] rounded-xl transition-colors whitespace-nowrap"
              >
                Reset all
              </button>
            )}
          </div>
        </div>

        {/* Desktop Quick Chips Bar */}
        <div className="mt-3 pt-3 border-t border-[#F0F4F2] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-[#52676D]">Experience:</span>
            {EXPERIENCE_SLABS.map((slab) => (
              <button
                key={slab.id}
                onClick={() => setExpFilter(slab.id)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  expFilter === slab.id
                    ? 'bg-[#08765D] text-white font-medium shadow-2xs'
                    : 'bg-[#F5F7F6] text-[#52676D] hover:bg-[#EAF4EF] hover:text-[#08765D]'
                }`}
              >
                {slab.short}
              </button>
            ))}

            <span className="ml-2 font-semibold text-[#52676D]">Work Mode:</span>
            {['', 'On-site', 'Hybrid', 'Remote'].map((mode) => (
              <button
                key={mode}
                onClick={() => setModeFilter(mode)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  modeFilter === mode
                    ? 'bg-[#08765D] text-white font-medium'
                    : 'bg-[#F5F7F6] text-[#52676D] hover:bg-[#EAF4EF] hover:text-[#08765D]'
                }`}
              >
                {mode || 'All Modes'}
              </button>
            ))}

            <span className="ml-2 font-semibold text-[#52676D]">Saved:</span>
            <button
              onClick={() => setSavedOnly(!savedOnly)}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                savedOnly
                  ? 'bg-[#08765D] text-white font-medium'
                  : 'bg-[#F5F7F6] text-[#52676D] hover:bg-[#EAF4EF]'
              }`}
            >
              Saved Jobs ({savedJobIds.length})
            </button>
          </div>

          <div className="text-[#52676D]">
            Showing <strong className="text-[#102D37]">{filteredJobs.length}</strong> vacancies
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={savedJobIds.includes(job.id)}
              onToggleSave={toggleSave}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#DCE5E0] p-12 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#EAF4EF] text-[#08765D] flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#102D37] mb-1">No matching opportunities found</h3>
          <p className="text-sm text-[#52676D] mb-6">
            Try loosening your filters, changing location or clearing your search keywords.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-[#08765D] hover:bg-[#065F4B] text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Mobile Filter Drawer (matching Figma frame 19) */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-xs bg-white h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#DCE5E0] mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-[#08765D]" />
                  <h2 className="text-lg font-bold text-[#102D37]">Refine Jobs</h2>
                </div>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-[#52676D] hover:bg-[#F5F7F6]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Stage Filter */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#52676D] mb-2">
                    Career Stage
                  </label>
                  <select
                    value={stageFilter}
                    onChange={(e) => setStageFilter(e.target.value)}
                    className="w-full p-2.5 bg-[#F5F7F6] rounded-xl text-sm border border-[#DCE5E0]"
                  >
                    <option value="">All Stages</option>
                    <option value="Articleship">Articleship</option>
                    <option value="Industrial Training">Industrial Training</option>
                    <option value="Qualified CA">Qualified CA</option>
                    <option value="Other Finance Jobs">Other Finance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#52676D] mb-2">
                    Location
                  </label>
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="w-full p-2.5 bg-[#F5F7F6] rounded-xl text-sm border border-[#DCE5E0]"
                  >
                    <option value="">All Locations</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#52676D] mb-2">
                    Experience Level
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {EXPERIENCE_SLABS.map((slab) => (
                      <button
                        key={slab.id}
                        onClick={() => setExpFilter(slab.id)}
                        className={`p-2 rounded-lg text-xs font-medium border text-center transition-all ${
                          expFilter === slab.id
                            ? 'bg-[#08765D] text-white border-[#08765D] font-bold shadow-xs'
                            : 'bg-[#F5F7F6] text-[#52676D] border-transparent hover:bg-[#EAF4EF]'
                        }`}
                      >
                        {slab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#52676D] mb-2">
                    Work Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['', 'On-site', 'Hybrid', 'Remote'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setModeFilter(mode)}
                        className={`p-2 rounded-lg text-xs font-medium border ${
                          modeFilter === mode
                            ? 'bg-[#08765D] text-white border-[#08765D]'
                            : 'bg-[#F5F7F6] text-[#52676D] border-transparent'
                        }`}
                      >
                        {mode || 'Any mode'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#DCE5E0] space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-[#08765D] text-white font-bold text-sm rounded-xl"
              >
                Show {filteredJobs.length} results
              </button>
              <button
                onClick={resetFilters}
                className="w-full py-2.5 text-xs text-[#52676D] font-medium"
              >
                Reset filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
