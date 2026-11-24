import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getBlogBySlug, getBlogs, getJobs } from '@/lib/supabase';
import { JobCard } from '@/components/JobCard';
import { ChevronRight, Clock, ArrowLeft, ArrowUpRight, Share2, BookOpen } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Metadata } from 'next';

interface BlogArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) {
    return { title: 'Article Not Found | CAJob.in' };
  }
  return {
    title: `${blog.title} | CAJob.in Career Guides`,
    description: blog.summary,
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  // Related guides & related jobs
  const allBlogs = await getBlogs();
  const relatedBlogs = allBlogs
    .filter((b) => b.slug !== blog.slug && b.category === blog.category)
    .slice(0, 3);

  const allJobs = await getJobs();
  const relatedJobs = allJobs.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F6]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-[#52676D] mb-6">
          <Link href="/" className="hover:text-[#102D37]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/blog" className="hover:text-[#102D37]">Career guides</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#102D37] font-semibold truncate max-w-xs">{blog.title}</span>
        </nav>

        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#08765D] hover:underline mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to all guides
        </Link>

        {/* Article Header Card */}
        <article className="bg-white rounded-3xl border border-[#DCE5E0] p-6 sm:p-10 shadow-xs mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 text-xs font-bold uppercase rounded-md bg-[#EAF4EF] text-[#08765D]">
              {blog.category}
            </span>
            <span className="text-xs text-[#52676D] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              5 min read
            </span>
            <span className="text-xs text-[#52676D]">·</span>
            <span className="text-xs text-[#52676D]">Published {formatDate(blog.publishedOn)}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#102D37] tracking-tight leading-tight mb-6">
            {blog.title}
          </h1>

          {blog.summary && (
            <div className="text-base sm:text-lg text-[#52676D] font-medium leading-relaxed pb-6 border-b border-[#F0F4F2] mb-8">
              {blog.summary}
            </div>
          )}

          {/* Author Card */}
          <div className="flex items-center gap-3 mb-8 p-3 bg-[#F5F7F6] rounded-xl">
            <div className="w-10 h-10 rounded-full bg-[#102D37] text-white flex items-center justify-center font-bold text-sm">
              CA
            </div>
            <div>
              <div className="text-xs font-bold text-[#102D37]">{blog.author || 'CAJob.in Editorial'}</div>
              <div className="text-[11px] text-[#52676D]">Research & CA Career Mentorship</div>
            </div>
          </div>

          {/* Article Body */}
          <div className="prose prose-slate max-w-none text-[#102D37] text-sm sm:text-base leading-relaxed space-y-6">
            {blog.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="whitespace-pre-line text-[#334e55] leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </article>

        {/* Relevant Jobs */}
        {relatedJobs.length > 0 && (
          <div className="mt-12 pt-10 border-t border-[#DCE5E0]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#102D37]">Relevant Job Openings</h2>
              <Link href="/jobs" className="text-xs font-semibold text-[#08765D] hover:underline flex items-center gap-1">
                View all <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedJobs.map((j) => (
                <JobCard key={j.id} job={j} />
              ))}
            </div>
          </div>
        )}

        {/* Related Guides */}
        {relatedBlogs.length > 0 && (
          <div className="mt-12 pt-10 border-t border-[#DCE5E0]">
            <h2 className="text-xl font-bold text-[#102D37] mb-6">More in {blog.category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((b) => (
                <Link
                  key={b.slug}
                  href={`/blog/${b.slug}`}
                  className="p-5 bg-white rounded-2xl border border-[#DCE5E0] hover:border-[#08765D] transition-colors"
                >
                  <span className="text-[10px] font-bold uppercase text-[#08765D] block mb-1">
                    {b.category}
                  </span>
                  <h3 className="text-sm font-bold text-[#102D37] line-clamp-2 mb-2">
                    {b.title}
                  </h3>
                  <span className="text-xs text-[#08765D] font-semibold flex items-center gap-1">
                    Read guide <ArrowUpRight className="w-3 h-3" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Back Navigation */}
        <div className="mt-10 pt-6 border-t border-[#DCE5E0]">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#102D37] hover:text-[#08765D] bg-white hover:bg-[#EAF4EF] border border-[#DCE5E0] hover:border-[#08765D]/40 rounded-xl transition-all shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all career guides
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
