'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Building2, CheckCircle2, ArrowUpRight, ShieldCheck, Users, Sparkles } from 'lucide-react';

export default function ForEmployersPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    employer: '',
    title: '',
    careerStage: 'Qualified CA',
    city: '',
    workMode: 'On-site',
    pay: '',
    applyUrl: '',
    description: '',
    contactEmail: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F6]">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-[#08765D]">
            Employer Solutions
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#102D37] tracking-tight mt-2">
            Hire finance talent. Build what&apos;s next.
          </h1>
          <p className="text-sm sm:text-base text-[#52676D] mt-3">
            Publish verified vacancies directly to thousands of actively looking Chartered Accountants, industrial trainees, and article assistants.
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-3xl border border-[#DCE5E0] p-6 space-y-3">
            <Users className="w-8 h-8 text-[#08765D]" />
            <h3 className="text-lg font-bold text-[#102D37]">100% Focused Audience</h3>
            <p className="text-xs text-[#52676D] leading-relaxed">
              No generic clutter. Only CA students, qualified CAs, and specialized finance candidates.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#DCE5E0] p-6 space-y-3">
            <ShieldCheck className="w-8 h-8 text-[#08765D]" />
            <h3 className="text-lg font-bold text-[#102D37]">Direct Applications</h3>
            <p className="text-xs text-[#52676D] leading-relaxed">
              Candidates apply straight to your company career portal or official hiring inbox.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#DCE5E0] p-6 space-y-3">
            <Sparkles className="w-8 h-8 text-[#08765D]" />
            <h3 className="text-lg font-bold text-[#102D37]">Free Pilot Postings</h3>
            <p className="text-xs text-[#52676D] leading-relaxed">
              Post your initial vacancies at zero cost while our team verifies and formats them for maximum reach.
            </p>
          </div>
        </div>

        {/* Post a Job Form */}
        <div className="bg-white rounded-3xl border border-[#DCE5E0] p-6 sm:p-10 shadow-xs">
          <div className="mb-8 pb-6 border-b border-[#F0F4F2]">
            <h2 className="text-2xl font-bold text-[#102D37]">Post a Vacancy</h2>
            <p className="text-xs sm:text-sm text-[#52676D] mt-1">
              Submit your opening details below. Our team reviews and activates listings within 12 hours.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#EAF4EF] text-[#08765D] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#102D37]">Job Submission Received!</h3>
              <p className="text-sm text-[#52676D] max-w-md mx-auto">
                Thank you, <strong>{formData.employer}</strong>. Your vacancy &ldquo;{formData.title}&rdquo; is currently in our review queue. We will notify you at <strong>{formData.contactEmail}</strong> once live.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#52676D] mb-1.5">
                    Company / Firm Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.employer}
                    onChange={(e) => setFormData({ ...formData, employer: e.target.value })}
                    placeholder="e.g. Deloitte India or Mehta & Associates"
                    className="w-full px-4 py-2.5 bg-[#F5F7F6] rounded-xl text-sm border border-[#DCE5E0] focus:outline-none focus:border-[#08765D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#52676D] mb-1.5">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Senior Associate, Statutory Audit"
                    className="w-full px-4 py-2.5 bg-[#F5F7F6] rounded-xl text-sm border border-[#DCE5E0] focus:outline-none focus:border-[#08765D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#52676D] mb-1.5">
                    Career Stage *
                  </label>
                  <select
                    value={formData.careerStage}
                    onChange={(e) => setFormData({ ...formData, careerStage: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F5F7F6] rounded-xl text-sm border border-[#DCE5E0] focus:outline-none focus:border-[#08765D]"
                  >
                    <option value="Articleship">Articleship</option>
                    <option value="Industrial Training">Industrial Training</option>
                    <option value="Qualified CA">Qualified CA</option>
                    <option value="Other Finance Jobs">Other Finance Role</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#52676D] mb-1.5">
                    City / Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Mumbai or Pan-India"
                    className="w-full px-4 py-2.5 bg-[#F5F7F6] rounded-xl text-sm border border-[#DCE5E0] focus:outline-none focus:border-[#08765D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#52676D] mb-1.5">
                    Work Mode *
                  </label>
                  <select
                    value={formData.workMode}
                    onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F5F7F6] rounded-xl text-sm border border-[#DCE5E0] focus:outline-none focus:border-[#08765D]"
                  >
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#52676D] mb-1.5">
                    Pay / Stipend Range
                  </label>
                  <input
                    type="text"
                    value={formData.pay}
                    onChange={(e) => setFormData({ ...formData, pay: e.target.value })}
                    placeholder="e.g. ₹15,000/mo or ₹8-12 LPA"
                    className="w-full px-4 py-2.5 bg-[#F5F7F6] rounded-xl text-sm border border-[#DCE5E0] focus:outline-none focus:border-[#08765D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#52676D] mb-1.5">
                    Direct Apply Link or HR Email *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.applyUrl}
                    onChange={(e) => setFormData({ ...formData, applyUrl: e.target.value })}
                    placeholder="https://... or careers@firm.com"
                    className="w-full px-4 py-2.5 bg-[#F5F7F6] rounded-xl text-sm border border-[#DCE5E0] focus:outline-none focus:border-[#08765D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#52676D] mb-1.5">
                  Job Description & Eligibility Requirements *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Responsibilities, required skills, exam leave policy, etc."
                  className="w-full px-4 py-2.5 bg-[#F5F7F6] rounded-xl text-sm border border-[#DCE5E0] focus:outline-none focus:border-[#08765D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#52676D] mb-1.5">
                  Your Official Email (for verification & updates) *
                </label>
                <input
                  type="email"
                  required
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="hr@yourfirm.com"
                  className="w-full px-4 py-2.5 bg-[#F5F7F6] rounded-xl text-sm border border-[#DCE5E0] focus:outline-none focus:border-[#08765D]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#08765D] hover:bg-[#065F4B] text-white font-bold text-sm rounded-xl shadow-xs transition-colors"
              >
                Submit Vacancy for Verification
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
