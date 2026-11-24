import { MetadataRoute } from 'next';
import initialJobs from '@/data/initial-jobs.json';
import initialBlogs from '@/data/initial-blogs.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.cajob.in';

  // Static routes
  const staticRoutes = [
    '',
    '/jobs',
    '/articleship',
    '/industrial-training',
    '/ca-jobs',
    '/finance-jobs',
    '/blog',
    '/resources',
    '/tools',
    '/tools/fixed-asset-register',
    '/tools/articleship-stipend-calculator',
    '/tools/articleship-transfer-checker',
    '/tools/ca-inhand-salary-estimator',
    '/community',
    '/about',
    '/contact',
    '/for-employers',
    '/courses',
    '/privacy',
    '/terms',
    '/cookie-notice',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Jobs dynamic routes
  const jobRoutes = initialJobs
    .filter((j) => j.status === 'Published')
    .map((job) => ({
      url: `${baseUrl}/job/${job.id}`,
      lastModified: new Date(job.postedOn || '2026-11-23'),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

  // Blog dynamic routes
  const blogRoutes = initialBlogs
    .filter((b) => b.status === 'Published')
    .map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: new Date(blog.publishedOn || '2026-11-23'),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

  return [...staticRoutes, ...jobRoutes, ...blogRoutes];
}
