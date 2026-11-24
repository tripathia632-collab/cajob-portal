'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Briefcase,
  BookOpen,
  FileText,
  Wrench,
  Users,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Search,
  ArrowLeft,
  LogOut,
  X,
  Inbox,
  Download,
  Mail,
  UserCheck,
} from 'lucide-react';
import {
  SUPER_ADMIN_EMAIL,
  getJobs,
  getBlogs,
  getResources,
  createOrUpdateJob,
  deleteJob,
  createOrUpdateBlog,
  deleteBlog,
  createOrUpdateResource,
  deleteResource,
} from '@/lib/supabase';
import { getStoredSession, isAuthorizedAdmin, clearSession } from '@/lib/auth';
import initialJobs from '@/data/initial-jobs.json';
import initialBlogs from '@/data/initial-blogs.json';
import initialResources from '@/data/initial-resources.json';
import { Job, Blog, Resource } from '@/types';

interface WaitlistEntry {
  id: string;
  email: string;
  name: string;
  source: string;
  message: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'jobs' | 'blogs' | 'resources' | 'tools' | 'waitlists' | 'users'>('jobs');
  const [currentAdmin, setCurrentAdmin] = useState(SUPER_ADMIN_EMAIL);

  // Strict session check on mount & live data sync
  useEffect(() => {
    const session = getStoredSession();
    if (!session || !isAuthorizedAdmin(session.user?.email)) {
      router.replace('/login?redirect=/admin');
      return;
    }
    setCurrentAdmin(session.user.email);
    setAuthorized(true);

    // Sync live database data
    getJobs({ status: '' }).then((data) => {
      if (data && data.length > 0) setJobs(data);
    });
    getBlogs().then((data) => {
      if (data && data.length > 0) setBlogs(data);
    });
    getResources().then((data) => {
      if (data && data.length > 0) setResources(data);
    });
    fetch('/api/waitlist')
      .then((res) => res.json())
      .then((data) => {
        if (data?.waitlists) setWaitlists(data.waitlists);
      })
      .catch((err) => console.error('Failed to load waitlists:', err));
  }, [router]);

  // Dynamic state
  const [jobs, setJobs] = useState<Job[]>(initialJobs as unknown as Job[]);
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs as unknown as Blog[]);
  const [resources, setResources] = useState<Resource[]>(initialResources as unknown as Resource[]);
  const [tools, setTools] = useState([
    {
      id: 'tool-1',
      slug: 'articleship-stipend-calculator',
      title: 'ICAI Articleship Stipend & Scheme Calculator',
      category: 'Calculators',
      toolType: 'built-in',
      status: 'Active',
    },
    {
      id: 'tool-2',
      slug: 'articleship-transfer-checker',
      title: 'ICAI Transfer Rules & Eligibility Checker',
      category: 'Compliance Checker',
      toolType: 'built-in',
      status: 'Active',
    },
    {
      id: 'tool-3',
      slug: 'ca-inhand-salary-estimator',
      title: 'CA CTC to In-Hand Take-Home Calculator',
      category: 'Tax & Finance',
      toolType: 'built-in',
      status: 'Active',
    },
  ]);

  // Delegated admins list
  const [authorizedAdmins, setAuthorizedAdmins] = useState<string[]>([
    SUPER_ADMIN_EMAIL,
  ]);
  const [newAdminEmail, setNewAdminEmail] = useState('');

  // Waitlists & Leads state
  const [waitlists, setWaitlists] = useState<WaitlistEntry[]>([]);
  const [waitlistSearch, setWaitlistSearch] = useState('');
  const [waitlistSourceFilter, setWaitlistSourceFilter] = useState('ALL');

  const handleExportCSV = () => {
    if (waitlists.length === 0) {
      showToast('No leads available to export.');
      return;
    }
    const headers = ['Name', 'Email', 'Source / Campaign', 'Message / Inquiry Details', 'Submitted At'];
    const rows = waitlists.map((entry) => [
      `"${(entry.name || '').replace(/"/g, '""')}"`,
      `"${(entry.email || '').replace(/"/g, '""')}"`,
      `"${(entry.source || '').replace(/"/g, '""')}"`,
      `"${(entry.message || '').replace(/"/g, '""')}"`,
      `"${new Date(entry.createdAt).toLocaleString('en-IN')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `cajob-in-leads-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Successfully exported ${waitlists.length} leads as CSV!`);
  };

  const handleDeleteLead = (id: string) => {
    setWaitlists((prev) => prev.filter((item) => item.id !== id));
    showToast('Lead record removed from view');
  };

  // Modals
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [jobForm, setJobForm] = useState<Partial<Job>>({
    title: '',
    employer: '',
    category: 'Audit',
    careerStage: 'Qualified CA',
    city: 'Mumbai',
    workMode: 'Hybrid',
    pay: '',
    experience: '',
    experienceSlab: 'Fresher / Trainee',
    applyUrl: '',
    description: '',
    responsibilities: '',
    requirements: '',
    status: 'Published',
  });

  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [blogForm, setBlogForm] = useState<Partial<Blog>>({
    slug: '',
    title: '',
    category: 'Career Planning',
    summary: '',
    content: '',
    author: 'CAJob.in Editorial',
    status: 'Published',
  });

  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [resourceForm, setResourceForm] = useState<Partial<Resource>>({
    title: '',
    category: 'CV & Applications',
    fileType: 'PDF',
    description: '',
    fileUrl: '',
    status: 'Published',
  });

  const [isToolModalOpen, setIsToolModalOpen] = useState(false);
  const [toolForm, setToolForm] = useState({
    slug: '',
    title: '',
    category: 'Calculators',
    toolType: 'built-in',
    status: 'Active',
  });

  // Search in table
  const [tableSearch, setTableSearch] = useState('');

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Job Actions
  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.title || !jobForm.employer) return;

    const newJob: Job = {
      id: (jobForm.id as string) || `job-${Date.now()}`,
      title: jobForm.title || '',
      employer: jobForm.employer || '',
      category: jobForm.category || 'Finance',
      careerStage: jobForm.careerStage || 'Qualified CA',
      city: jobForm.city || 'India',
      workMode: jobForm.workMode || 'On-site',
      pay: jobForm.pay || '',
      experience: jobForm.experience || '',
      experienceSlab: jobForm.experienceSlab || '',
      description: jobForm.description || '',
      responsibilities: jobForm.responsibilities || '',
      requirements: jobForm.requirements || '',
      applyUrl: jobForm.applyUrl || '',
      postedOn: new Date().toISOString().split('T')[0],
      status: jobForm.status || 'Published',
    };

    setJobs((prev) => [newJob, ...prev.filter((j) => j.id !== newJob.id)]);
    setIsJobModalOpen(false);
    showToast(`Job "${newJob.title}" saved successfully!`);

    try {
      await createOrUpdateJob(newJob);
    } catch (err) {
      console.error('Failed to sync job to database:', err);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (confirm('Are you sure you want to delete this job?')) {
      setJobs((prev) => prev.filter((j) => j.id !== id));
      showToast('Job listing removed.');
      try {
        await deleteJob(id);
      } catch (err) {
        console.error('Failed to delete job from database:', err);
      }
    }
  };

  // Blog Actions
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title) return;

    const slug =
      blogForm.slug ||
      blogForm.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const newBlog: Blog = {
      slug,
      title: blogForm.title || '',
      category: blogForm.category || 'Career Planning',
      summary: blogForm.summary || '',
      content: blogForm.content || '',
      author: blogForm.author || 'CAJob.in Editorial',
      publishedOn: new Date().toISOString().split('T')[0],
      status: blogForm.status || 'Published',
    };

    setBlogs((prev) => [newBlog, ...prev.filter((b) => b.slug !== newBlog.slug)]);
    setIsBlogModalOpen(false);
    showToast(`Article "${newBlog.title}" published successfully!`);

    try {
      await createOrUpdateBlog(newBlog);
    } catch (err) {
      console.error('Failed to sync blog to database:', err);
    }
  };

  const handleDeleteBlog = async (slug: string) => {
    if (confirm('Delete this article?')) {
      setBlogs((prev) => prev.filter((b) => b.slug !== slug));
      showToast('Article deleted.');
      try {
        await deleteBlog(slug);
      } catch (err) {
        console.error('Failed to delete blog from database:', err);
      }
    }
  };

  // Resource Actions
  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceForm.title || !resourceForm.fileUrl) return;

    const newRes: Resource = {
      id: `res-${Date.now()}`,
      title: resourceForm.title || '',
      category: resourceForm.category || 'CV & Applications',
      fileType: resourceForm.fileType || 'PDF',
      description: resourceForm.description || '',
      fileUrl: resourceForm.fileUrl || '',
      publishedOn: new Date().toISOString().split('T')[0],
      status: resourceForm.status || 'Published',
      downloads: 0,
    };

    setResources((prev) => [newRes, ...prev]);
    setIsResourceModalOpen(false);
    showToast(`Resource "${newRes.title}" uploaded!`);

    try {
      await createOrUpdateResource(newRes);
    } catch (err) {
      console.error('Failed to sync resource to database:', err);
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (confirm('Delete this resource?')) {
      setResources((prev) => prev.filter((r) => r.id !== id));
      showToast('Resource removed.');
      try {
        await deleteResource(id);
      } catch (err) {
        console.error('Failed to delete resource from database:', err);
      }
    }
  };

  // Tool Actions
  const handleSaveTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolForm.title || !toolForm.slug) return;

    const newTool = {
      id: `tool-${Date.now()}`,
      slug: toolForm.slug,
      title: toolForm.title,
      category: toolForm.category,
      toolType: toolForm.toolType,
      status: toolForm.status,
    };

    setTools((prev) => [newTool, ...prev]);
    setIsToolModalOpen(false);
    showToast(`Tool "${newTool.title}" registered!`);
  };

  // Admin Delegation Actions
  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newAdminEmail.trim().toLowerCase();
    if (!clean) return;
    if (authorizedAdmins.includes(clean)) {
      alert('This email is already an authorized administrator.');
      return;
    }
    setAuthorizedAdmins((prev) => [...prev, clean]);
    setNewAdminEmail('');
    showToast(`Granted Administrator access to ${clean}`);
  };

  const handleRevokeAdmin = (email: string) => {
    if (email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
      alert('Cannot revoke primary Super Admin access for ' + SUPER_ADMIN_EMAIL);
      return;
    }
    if (confirm(`Revoke admin privileges from ${email}?`)) {
      setAuthorizedAdmins((prev) => prev.filter((e) => e !== email));
      showToast(`Revoked admin access for ${email}`);
    }
  };

  const handleSignOut = () => {
    clearSession();
    router.push('/login');
  };

  if (authorized === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F7F6]">
        <div className="w-10 h-10 border-3 border-[#08765D] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold text-[#52676D] uppercase tracking-wider">
          Verifying administrator authorization...
        </p>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F7F6] flex flex-col">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-[#102D37] text-white rounded-xl shadow-2xl flex items-center gap-2 border border-[#76d7b2]/40 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#76d7b2]" />
          {toastMessage}
        </div>
      )}

      {/* Top Admin Header */}
      <header className="bg-[#102D37] text-white border-b border-[#1f4e5c] px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/brand/doorway-icon.png"
                alt="Doorway"
                width={28}
                height={36}
                className="object-contain"
              />
              <span className="font-extrabold text-xl tracking-tight text-white">
                cajob<span className="text-[#76d7b2]">.in</span>
              </span>
            </Link>
            <div className="h-5 w-px bg-[#265b6a] hidden sm:block" />
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#174450] text-[#76d7b2] text-xs font-bold border border-[#2a6879]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Super Admin CMS
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-white">{currentAdmin}</div>
              <div className="text-[10px] text-[#8ca89a]">Authorized Administrator</div>
            </div>
            <Link
              href="/"
              className="px-3 py-1.5 bg-[#174450] hover:bg-[#1f5767] text-xs font-semibold text-white rounded-lg transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Website
            </Link>
            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 text-xs font-semibold text-red-200 border border-red-800 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#DCE5E0] pb-4 mb-8">
          {[
            { id: 'jobs', label: `Jobs (${jobs.length})`, icon: Briefcase },
            { id: 'blogs', label: `Blogs (${blogs.length})`, icon: BookOpen },
            { id: 'resources', label: `Free Resources (${resources.length})`, icon: FileText },
            { id: 'tools', label: `Web Tools Hub (${tools.length})`, icon: Wrench },
            { id: 'waitlists', label: `Leads & Waitlists (${waitlists.length})`, icon: Inbox },
            { id: 'users', label: `Admin Access (${authorizedAdmins.length})`, icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-[#08765D] text-white shadow-xs'
                    : 'bg-white text-[#52676D] hover:bg-[#EAF4EF] hover:text-[#08765D] border border-[#DCE5E0]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: JOBS MANAGER */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#DCE5E0]">
              <div>
                <h2 className="text-xl font-bold text-[#102D37]">Jobs Desk</h2>
                <p className="text-xs text-[#52676D]">Manage, verify, publish or archive vacancies</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsJobModalOpen(true)}
                  className="px-4 py-2.5 bg-[#08765D] hover:bg-[#065F4B] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  Post New Vacancy
                </button>
              </div>
            </div>

            {/* Jobs Table */}
            <div className="bg-white rounded-2xl border border-[#DCE5E0] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F5F7F6] text-[#52676D] font-bold uppercase tracking-wider border-b border-[#DCE5E0]">
                    <tr>
                      <th className="p-4">Role Title & Employer</th>
                      <th className="p-4">Career Stage</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F4F2]">
                    {jobs.slice(0, 25).map((job) => (
                      <tr key={job.id} className="hover:bg-[#F5F7F6]/60 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-[#102D37] text-sm">{job.title}</div>
                          <div className="text-[#52676D]">{job.employer}</div>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-md bg-[#EAF4EF] text-[#08765D] font-semibold text-[11px]">
                            {job.careerStage}
                          </span>
                        </td>
                        <td className="p-4 text-[#52676D]">
                          {job.city} · {job.workMode}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              job.status === 'Published'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {job.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <Link
                            href={`/job/${job.id}`}
                            target="_blank"
                            className="p-1.5 inline-block text-[#52676D] hover:text-[#08765D]"
                            title="View Public Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="p-1.5 text-[#52676D] hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BLOGS & GUIDES */}
        {activeTab === 'blogs' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#DCE5E0]">
              <div>
                <h2 className="text-xl font-bold text-[#102D37]">Blogs &amp; Articles ({blogs.length})</h2>
                <p className="text-xs text-[#52676D]">Editorial content, articleship advice, interview guides</p>
              </div>

              <button
                onClick={() => setIsBlogModalOpen(true)}
                className="px-4 py-2.5 bg-[#08765D] hover:bg-[#065F4B] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                Write New Blog
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-[#DCE5E0] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F5F7F6] text-[#52676D] font-bold uppercase tracking-wider border-b border-[#DCE5E0]">
                    <tr>
                      <th className="p-4">Title & Slug</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Author</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F4F2]">
                    {blogs.slice(0, 20).map((blog) => (
                      <tr key={blog.slug} className="hover:bg-[#F5F7F6]/60 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-[#102D37] text-sm">{blog.title}</div>
                          <div className="text-[11px] text-[#52676D] font-mono">/blog/{blog.slug}</div>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-md bg-[#EAF4EF] text-[#08765D] font-semibold text-[11px]">
                            {blog.category}
                          </span>
                        </td>
                        <td className="p-4 text-[#52676D]">{blog.author}</td>
                        <td className="p-4 text-right space-x-2">
                          <Link
                            href={`/blog/${blog.slug}`}
                            target="_blank"
                            className="p-1.5 inline-block text-[#52676D] hover:text-[#08765D]"
                            title="Read Article"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteBlog(blog.slug)}
                            className="p-1.5 text-[#52676D] hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FREE RESOURCES */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#DCE5E0]">
              <div>
                <h2 className="text-xl font-bold text-[#102D37]">Free Resources Desk</h2>
                <p className="text-xs text-[#52676D]">Upload downloadable CV templates, comparison sheets, email scripts</p>
              </div>

              <button
                onClick={() => setIsResourceModalOpen(true)}
                className="px-4 py-2.5 bg-[#08765D] hover:bg-[#065F4B] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                Add Free Resource
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {resources.map((res) => (
                <div key={res.id} className="bg-white rounded-2xl border border-[#DCE5E0] p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#EAF4EF] text-[#08765D]">
                      {res.fileType}
                    </span>
                    <button
                      onClick={() => handleDeleteResource(res.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="font-bold text-sm text-[#102D37]">{res.title}</h3>
                  <p className="text-xs text-[#52676D] line-clamp-2">{res.description}</p>
                  <div className="pt-2 border-t border-[#F0F4F2] flex items-center justify-between text-xs">
                    <span className="text-[#52676D]">{res.category}</span>
                    <a
                      href={res.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#08765D] font-bold flex items-center gap-1 hover:underline"
                    >
                      Open Link <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: WEB TOOLS HUB */}
        {activeTab === 'tools' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#DCE5E0]">
              <div>
                <h2 className="text-xl font-bold text-[#102D37]">Web Tools Hub</h2>
                <p className="text-xs text-[#52676D]">Register new web tools, calculators, or interactive embed apps</p>
              </div>

              <button
                onClick={() => setIsToolModalOpen(true)}
                className="px-4 py-2.5 bg-[#08765D] hover:bg-[#065F4B] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                Add New Tool
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tools.map((tool) => (
                <div key={tool.id} className="bg-white rounded-2xl border border-[#DCE5E0] p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#EAF4EF] text-[#08765D]">
                      {tool.category}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {tool.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-[#102D37]">{tool.title}</h3>
                  <div className="text-[11px] font-mono text-[#52676D]">/tools/{tool.slug}</div>
                  <div className="pt-2 border-t border-[#F0F4F2] flex items-center justify-between text-xs">
                    <span className="text-[#52676D] capitalize">{tool.toolType}</span>
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="text-[#08765D] font-bold flex items-center gap-1 hover:underline"
                    >
                      Open Tool <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: LEADS & WAITLISTS */}
        {activeTab === 'waitlists' && (
          <div className="space-y-6">
            {/* Header / Stats Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#DCE5E0]">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-[#102D37]">Leads & Waitlist Inquiries</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EAF4EF] text-[#08765D] text-xs font-bold border border-[#bcdbc8]">
                    {waitlists.length} Captured
                  </span>
                </div>
                <p className="text-xs text-[#52676D] mt-0.5">
                  Submissions from Courses early access, alerts/newsletter signups, employer postings, and contact forms.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2.5 bg-[#08765D] hover:bg-[#065F4B] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  Export All Leads (CSV)
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-[#DCE5E0] flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                {[
                  { label: 'All Sources', key: 'ALL' },
                  { label: 'Courses Waitlist', key: 'Courses' },
                  { label: 'Alerts & Newsletter', key: 'Alerts' },
                  { label: 'Employer Submissions', key: 'Employer' },
                  { label: 'Contact Inquiries', key: 'Contact' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setWaitlistSourceFilter(item.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      waitlistSourceFilter === item.key
                        ? 'bg-[#102D37] text-white'
                        : 'bg-[#F5F7F6] text-[#52676D] hover:bg-[#EAF4EF] hover:text-[#08765D]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-[#52676D] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search email, name or text..."
                  value={waitlistSearch}
                  onChange={(e) => setWaitlistSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-[#F5F7F6] border border-[#DCE5E0] rounded-xl focus:outline-none focus:border-[#08765D]"
                />
              </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-2xl border border-[#DCE5E0] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F5F7F6] text-[#52676D] border-b border-[#DCE5E0]">
                      <th className="py-3.5 px-4 font-bold">Contact / Applicant</th>
                      <th className="py-3.5 px-4 font-bold">Source / Channel</th>
                      <th className="py-3.5 px-4 font-bold">Submitted Details / Message</th>
                      <th className="py-3.5 px-4 font-bold whitespace-nowrap">Date & Time</th>
                      <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F4F2]">
                    {waitlists
                      .filter((lead) => {
                        const matchesSearch =
                          !waitlistSearch ||
                          lead.email?.toLowerCase().includes(waitlistSearch.toLowerCase()) ||
                          lead.name?.toLowerCase().includes(waitlistSearch.toLowerCase()) ||
                          lead.source?.toLowerCase().includes(waitlistSearch.toLowerCase()) ||
                          lead.message?.toLowerCase().includes(waitlistSearch.toLowerCase());

                        const matchesSource =
                          waitlistSourceFilter === 'ALL' ||
                          lead.source?.toLowerCase().includes(waitlistSourceFilter.toLowerCase());

                        return matchesSearch && matchesSource;
                      })
                      .map((lead) => (
                        <tr key={lead.id} className="hover:bg-[#F9FBFA] transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-[#102D37]">
                              {lead.name || 'Anonymous User'}
                            </div>
                            <a
                              href={`mailto:${lead.email}`}
                              className="text-[#08765D] hover:underline flex items-center gap-1 mt-0.5 font-medium"
                            >
                              <Mail className="w-3 h-3" />
                              {lead.email}
                            </a>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#EAF4EF] text-[#08765D] border border-[#bcdbc8] whitespace-nowrap">
                              {lead.source}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 max-w-md">
                            <div className="text-[#52676D] leading-relaxed break-words line-clamp-3">
                              {lead.message || '—'}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-[#52676D] whitespace-nowrap">
                            {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }) : 'Recent'}
                          </td>

                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <a
                                href={`mailto:${lead.email}?subject=Regarding your inquiry on CAJob.in`}
                                title="Reply via Email"
                                className="p-1.5 text-[#08765D] hover:bg-[#EAF4EF] rounded-lg transition-colors"
                              >
                                <Mail className="w-4 h-4" />
                              </a>
                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                title="Remove from view"
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                    {waitlists.filter((lead) => {
                      const matchesSearch =
                        !waitlistSearch ||
                        lead.email?.toLowerCase().includes(waitlistSearch.toLowerCase()) ||
                        lead.name?.toLowerCase().includes(waitlistSearch.toLowerCase()) ||
                        lead.source?.toLowerCase().includes(waitlistSearch.toLowerCase()) ||
                        lead.message?.toLowerCase().includes(waitlistSearch.toLowerCase());

                      const matchesSource =
                        waitlistSourceFilter === 'ALL' ||
                        lead.source?.toLowerCase().includes(waitlistSourceFilter.toLowerCase());

                      return matchesSearch && matchesSource;
                    }).length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-[#52676D]">
                          <Inbox className="w-8 h-8 text-[#98A2B3] mx-auto mb-2" />
                          <p className="font-semibold text-sm">No submissions found</p>
                          <p className="text-xs text-[#8ca89a] mt-0.5">
                            New submissions from forms and waitlists will automatically appear here.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ADMIN ACCESS & DELEGATIONS */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DCE5E0] space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#08765D]">
                  Role-Based Access Control
                </span>
                <h2 className="text-2xl font-extrabold text-[#102D37] mt-1">
                  Administrator Permissions & Delegations
                </h2>
                <p className="text-sm text-[#52676D] mt-1">
                  You can grant or revoke full administrative powers to colleagues and collaborators from this panel.
                </p>
              </div>

              {/* Add New Admin Form */}
              <form onSubmit={handleAddAdmin} className="flex flex-col sm:flex-row gap-3 pt-2">
                <input
                  type="email"
                  required
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="Enter email to grant admin rights (e.g. partner@example.com)"
                  className="flex-1 px-4 py-2.5 bg-[#F5F7F6] rounded-xl text-sm border border-[#DCE5E0] focus:outline-none focus:border-[#08765D]"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#08765D] hover:bg-[#065F4B] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors whitespace-nowrap"
                >
                  Grant Admin Access
                </button>
              </form>

              {/* Authorized Admins List */}
              <div className="pt-4 border-t border-[#F0F4F2] space-y-3">
                <h3 className="text-xs font-bold uppercase text-[#52676D] tracking-wider">
                  Currently Authorized Administrators:
                </h3>
                <div className="space-y-2">
                  {authorizedAdmins.map((email) => {
                    const isPrimary = email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
                    return (
                      <div
                        key={email}
                        className="flex items-center justify-between p-3.5 bg-[#F5F7F6] rounded-xl border border-[#DCE5E0]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#102D37] text-white flex items-center justify-center font-bold text-xs">
                            {email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#102D37]">{email}</div>
                            <div className="text-[10px] text-[#52676D]">
                              {isPrimary ? 'Primary Super Admin (Owner)' : 'Delegated Administrator'}
                            </div>
                          </div>
                        </div>

                        {isPrimary ? (
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                            Protected Owner
                          </span>
                        ) : (
                          <button
                            onClick={() => handleRevokeAdmin(email)}
                            className="px-3 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded-md text-[11px] font-bold transition-colors"
                          >
                            Revoke Access
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Super Admin Password Change Utility */}
              <div className="pt-6 border-t border-[#F0F4F2] space-y-3">
                <h3 className="text-xs font-bold uppercase text-[#52676D] tracking-wider">
                  Security & Password Management (tripathia632@gmail.com)
                </h3>
                <p className="text-xs text-[#52676D]">
                  Update your Super Admin password stored for direct portal login.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="password"
                    id="new-pass-input"
                    placeholder="Enter new admin password"
                    className="px-4 py-2.5 bg-[#F5F7F6] rounded-xl text-sm border border-[#DCE5E0] focus:outline-none focus:border-[#08765D] max-w-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('new-pass-input') as HTMLInputElement;
                      if (input && input.value) {
                        localStorage.setItem('cajob_admin_custom_password', input.value);
                        input.value = '';
                        showToast('Super Admin password successfully updated!');
                      }
                    }}
                    className="px-5 py-2.5 bg-[#102D37] hover:bg-[#174450] text-white font-bold text-xs rounded-xl transition-colors whitespace-nowrap"
                  >
                    Update Password
                  </button>
                </div>
              </div>

              {/* One-Click Backup Export */}
              <div className="pt-6 border-t border-[#F0F4F2] space-y-3">
                <h3 className="text-xs font-bold uppercase text-[#52676D] tracking-wider">
                  Data Portability & 1-Click Backup Export
                </h3>
                <p className="text-xs text-[#52676D]">
                  Download a complete, offline JSON snapshot of all 64 jobs, 50 blogs, 3 resources, and tools.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const dataSnapshot = {
                      exportedAt: new Date().toISOString(),
                      jobs,
                      blogs,
                      resources,
                      tools,
                    };
                    const blob = new Blob([JSON.stringify(dataSnapshot, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `cajob-complete-backup-${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                    showToast('Data snapshot backup exported!');
                  }}
                  className="px-5 py-2.5 bg-[#EAF4EF] text-[#08765D] hover:bg-[#08765D] hover:text-white border border-[#bcdbc8] font-bold text-xs rounded-xl transition-all inline-flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  Export Full System Backup (.JSON)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: POST JOB */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#DCE5E0]">
              <h3 className="text-xl font-bold text-[#102D37]">Post New Opportunity</h3>
              <button onClick={() => setIsJobModalOpen(false)} className="p-1 text-[#52676D] hover:text-[#102D37]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#52676D] mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    placeholder="e.g. CA Industrial Trainee"
                    className="w-full px-3.5 py-2 bg-[#F5F7F6] rounded-xl text-xs border border-[#DCE5E0]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#52676D] mb-1">Employer / Firm *</label>
                  <input
                    type="text"
                    required
                    value={jobForm.employer}
                    onChange={(e) => setJobForm({ ...jobForm, employer: e.target.value })}
                    placeholder="e.g. Citi or Deloitte"
                    className="w-full px-3.5 py-2 bg-[#F5F7F6] rounded-xl text-xs border border-[#DCE5E0]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#52676D] mb-1">Career Stage</label>
                  <select
                    value={jobForm.careerStage}
                    onChange={(e) => setJobForm({ ...jobForm, careerStage: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F7F6] rounded-xl text-xs border border-[#DCE5E0]"
                  >
                    <option value="Articleship">Articleship</option>
                    <option value="Industrial Training">Industrial Training</option>
                    <option value="Qualified CA">Qualified CA</option>
                    <option value="Other Finance Jobs">Other Finance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#52676D] mb-1">City</label>
                  <input
                    type="text"
                    value={jobForm.city}
                    onChange={(e) => setJobForm({ ...jobForm, city: e.target.value })}
                    placeholder="e.g. Mumbai"
                    className="w-full px-3 py-2 bg-[#F5F7F6] rounded-xl text-xs border border-[#DCE5E0]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#52676D] mb-1">Work Mode</label>
                  <select
                    value={jobForm.workMode}
                    onChange={(e) => setJobForm({ ...jobForm, workMode: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#F5F7F6] rounded-xl text-xs border border-[#DCE5E0]"
                  >
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#52676D] mb-1">Experience Level / Slab</label>
                  <select
                    value={jobForm.experienceSlab || ''}
                    onChange={(e) => setJobForm({ ...jobForm, experienceSlab: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#F5F7F6] rounded-xl text-xs border border-[#DCE5E0]"
                  >
                    <option value="">Auto-Detect from Text / Stage</option>
                    <option value="Fresher / Trainee">Fresher / Trainee (0 yrs)</option>
                    <option value="0-2 years">0 – 2 Years</option>
                    <option value="2-5 years">2 – 5 Years</option>
                    <option value="5-8 years">5 – 8 Years</option>
                    <option value="8+ years">8+ Years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#52676D] mb-1">Experience Text / Specifics</label>
                  <input
                    type="text"
                    value={jobForm.experience || ''}
                    onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                    placeholder="e.g. 1-3 years post-qualification"
                    className="w-full px-3.5 py-2 bg-[#F5F7F6] rounded-xl text-xs border border-[#DCE5E0]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#52676D] mb-1">Pay / Stipend</label>
                  <input
                    type="text"
                    value={jobForm.pay}
                    onChange={(e) => setJobForm({ ...jobForm, pay: e.target.value })}
                    placeholder="e.g. ₹20,000 / month"
                    className="w-full px-3.5 py-2 bg-[#F5F7F6] rounded-xl text-xs border border-[#DCE5E0]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#52676D] mb-1">Direct Apply Link</label>
                  <input
                    type="text"
                    value={jobForm.applyUrl}
                    onChange={(e) => setJobForm({ ...jobForm, applyUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 bg-[#F5F7F6] rounded-xl text-xs border border-[#DCE5E0]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#52676D] mb-1">Job Description</label>
                <textarea
                  rows={4}
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  placeholder="Overview, requirements, exam leave policies..."
                  className="w-full px-3.5 py-2 bg-[#F5F7F6] rounded-xl text-xs border border-[#DCE5E0]"
                />
              </div>

              <div className="pt-4 border-t border-[#F0F4F2] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsJobModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#52676D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#08765D] text-white rounded-xl text-xs font-bold"
                >
                  Publish Vacancy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: WRITE BLOG */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#DCE5E0]">
              <h3 className="text-xl font-bold text-[#102D37]">Write New Blog</h3>
              <button onClick={() => setIsBlogModalOpen(false)} className="p-1 text-[#52676D] hover:text-[#102D37]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBlog} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#52676D] mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                  placeholder="e.g. How to evaluate an articleship offer"
                  className="w-full px-3.5 py-2 bg-[#F5F7F6] rounded-xl text-xs border border-[#DCE5E0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#52676D] mb-1">Category</label>
                  <select
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F7F6] rounded-xl text-xs border border-[#DCE5E0]"
                  >
                    <option value="Articleship">Articleship</option>
                    <option value="Interviews">Interviews</option>
                    <option value="CV & Applications">CV & Applications</option>
                    <option value="Industrial Training">Industrial Training</option>
                    <option value="Career Planning">Career Planning</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#52676D] mb-1">Custom Slug</label>
                  <input
                    type="text"
                    value={blogForm.slug}
                    onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                    placeholder="auto-generated from title"
                    className="w-full px-3.5 py-2 bg-[#F5F7F6] rounded-xl text-xs border border-[#DCE5E0]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#52676D] mb-1">Summary / Lead</label>
                <input
                  type="text"
                  value={blogForm.summary}
                  onChange={(e) => setBlogForm({ ...blogForm, summary: e.target.value })}
                  placeholder="Key takeaway in 1-2 sentences"
                  className="w-full px-3.5 py-2 bg-[#F5F7F6] rounded-xl text-xs border border-[#DCE5E0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#52676D] mb-1">Article Body Content</label>
                <textarea
                  rows={8}
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  placeholder="Write complete guide here..."
                  className="w-full px-3.5 py-2 bg-[#F5F7F6] rounded-xl text-xs border border-[#DCE5E0]"
                />
              </div>

              <div className="pt-4 border-t border-[#F0F4F2] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBlogModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#52676D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#08765D] text-white rounded-xl text-xs font-bold"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD RESOURCE */}
      {isResourceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE5E0]">
              <h3 className="text-lg font-bold text-[#102D37]">Add Downloadable Resource</h3>
              <button onClick={() => setIsResourceModalOpen(false)}>
                <X className="w-5 h-5 text-[#52676D]" />
              </button>
            </div>

            <form onSubmit={handleSaveResource} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-[#52676D] mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={resourceForm.title}
                  onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                  placeholder="e.g. Articleship Partner Email Script"
                  className="w-full px-3 py-2 bg-[#F5F7F6] rounded-xl text-xs border border-[#DCE5E0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#52676D] mb-1">Category</label>
                  <select
                    value={resourceForm.category}
                    onChange={(e) => setResourceForm({ ...resourceForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F7F6] rounded-xl text-xs border border-[#DCE5E0]"
                  >
                    <option value="CV & Applications">CV & Applications</option>
                    <option value="Career Planning">Career Planning</option>
                    <option value="Technical Models">Technical Models</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#52676D] mb-1">File Type</label>
                  <select
                    value={resourceForm.fileType}
                    onChange={(e) => setResourceForm({ ...resourceForm, fileType: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F7F6] rounded-xl text-xs border border-[#DCE5E0]"
                  >
                    <option value="PDF">PDF</option>
                    <option value="DOCX">Word (.docx)</option>
                    <option value="Excel">Excel (.xlsx)</option>
                    <option value="Text">Plain Text</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#52676D] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={resourceForm.description}
                  onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                  placeholder="What is inside this file..."
                  className="w-full px-3 py-2 bg-[#F5F7F6] rounded-xl text-xs border border-[#DCE5E0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#52676D] mb-1">File Download URL *</label>
                <input
                  type="url"
                  required
                  value={resourceForm.fileUrl}
                  onChange={(e) => setResourceForm({ ...resourceForm, fileUrl: e.target.value })}
                  placeholder="https://drive.google.com/... or Supabase URL"
                  className="w-full px-3 py-2 bg-[#F5F7F6] rounded-xl text-xs border border-[#DCE5E0]"
                />
              </div>

              <div className="pt-3 border-t border-[#F0F4F2] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsResourceModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#52676D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#08765D] text-white rounded-xl text-xs font-bold"
                >
                  Save Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD TOOL */}
      {isToolModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE5E0]">
              <h3 className="text-lg font-bold text-[#102D37]">Register New Web Tool</h3>
              <button onClick={() => setIsToolModalOpen(false)}>
                <X className="w-5 h-5 text-[#52676D]" />
              </button>
            </div>

            <form onSubmit={handleSaveTool} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-[#52676D] mb-1">Tool Title *</label>
                <input
                  type="text"
                  required
                  value={toolForm.title}
                  onChange={(e) => setToolForm({ ...toolForm, title: e.target.value })}
                  placeholder="e.g. Notice Period Buyout Calculator"
                  className="w-full px-3 py-2 bg-[#F5F7F6] rounded-xl text-xs border border-[#DCE5E0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#52676D] mb-1">URL Slug *</label>
                <input
                  type="text"
                  required
                  value={toolForm.slug}
                  onChange={(e) => setToolForm({ ...toolForm, slug: e.target.value })}
                  placeholder="e.g. notice-period-calculator"
                  className="w-full px-3 py-2 bg-[#F5F7F6] rounded-xl text-xs border border-[#DCE5E0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#52676D] mb-1">Category</label>
                <select
                  value={toolForm.category}
                  onChange={(e) => setToolForm({ ...toolForm, category: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F5F7F6] rounded-xl text-xs border border-[#DCE5E0]"
                >
                  <option value="Calculators">Calculators</option>
                  <option value="Compliance Checker">Compliance Checker</option>
                  <option value="Tax & Finance">Tax & Finance</option>
                  <option value="Resume Tools">Resume Tools</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#F0F4F2] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsToolModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#52676D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#08765D] text-white rounded-xl text-xs font-bold"
                >
                  Save Tool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
