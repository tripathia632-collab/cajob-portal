import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getBlogs } from '@/lib/supabase';
import { BookOpen, ArrowUpRight, Calendar, User, Clock, ArrowLeft } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blogs & Practical Advice | CAJob.in',
  description: '50+ comprehensive blogs for CA articleship, industrial training, interview frameworks, and finance skills.',
};


export default async function BlogPage() {
  const blogs = await getBlogs();

  // Categories
  const categories = Array.from(new Set(blogs.map((b) => b.category)));

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F6]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb & Home Link */}
        <nav className="flex items-center gap-2 text-xs text-[#52676D] mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-semibold text-[#52676D] hover:text-[#08765D] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
          <span className="text-[#DCE5E0]">/</span>
          <span className="text-[#102D37] font-semibold">Blogs</span>
        </nav>

        {/* Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold tracking-widest uppercase text-[#08765D]">
            CA Career Blogs
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#102D37] tracking-tight mt-2">
            Blogs &amp; practical insights
          </h1>
          <p className="text-sm sm:text-base text-[#52676D] mt-3">
            Hand-curated frameworks, firm selection checklists, and interview preparation for CA students and finance professionals.
          </p>
        </div>

        {/* Featured Article (First article) */}
        {blogs.length > 0 && (
          <div className="mb-12">
            <Link
              href={`/blog/${blogs[0].slug}`}
              className="group block bg-white rounded-3xl border border-[#DCE5E0] hover:border-[#08765D]/60 p-8 sm:p-10 shadow-xs card-hover-effect"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 text-xs font-bold uppercase rounded-md bg-[#EAF4EF] text-[#08765D]">
                      Featured Blog · {blogs[0].category}
                    </span>
                    <span className="text-xs text-[#52676D] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      5 min read
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102D37] group-hover:text-[#08765D] transition-colors leading-tight">
                    {blogs[0].title}
                  </h2>
                  <p className="text-sm sm:text-base text-[#52676D] leading-relaxed">
                    {blogs[0].summary}
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#08765D]">
                    <span>Read full blog</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                <div className="lg:col-span-4 bg-gradient-to-br from-[#102D37] to-[#174450] rounded-2xl p-6 text-white flex flex-col justify-between h-48 sm:h-56">
                  <div className="text-xs font-semibold text-[#a7e9d4]">CAJob.in Editorial</div>
                  <div className="text-lg font-bold text-white/90">
                    &ldquo;Clear thinking leads to better career choices.&rdquo;
                  </div>
                  <div className="text-xs text-[#8ca89a]">{formatDate(blogs[0].publishedOn)}</div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.slice(1).map((blog) => (
            <Link
              key={blog.slug}
              href={`/blog/${blog.slug}`}
              className="group bg-white rounded-2xl border border-[#DCE5E0] hover:border-[#08765D]/60 p-6 shadow-xs card-hover-effect flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-[#EAF4EF] text-[#08765D]">
                    {blog.category}
                  </span>
                  <span className="text-xs text-[#52676D]">5 min read</span>
                </div>
                <h3 className="text-lg font-bold text-[#102D37] group-hover:text-[#08765D] transition-colors tracking-tight line-clamp-2 mb-2">
                  {blog.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#52676D] line-clamp-3 leading-relaxed mb-4">
                  {blog.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-[#F0F4F2] flex items-center justify-between text-xs">
                <span className="text-[#52676D]">{formatDate(blog.publishedOn)}</span>
                <span className="font-bold text-[#08765D] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Read blog <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
