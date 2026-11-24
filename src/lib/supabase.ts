import { createClient } from '@supabase/supabase-js';
import initialJobs from '@/data/initial-jobs.json';
import initialBlogs from '@/data/initial-blogs.json';
import initialResources from '@/data/initial-resources.json';
import { Job, Blog, Resource } from '@/types';
import { matchesExperienceSlab } from '@/lib/utils';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const SUPER_ADMIN_EMAIL = 'tripathia632@gmail.com';

export function isUserAdmin(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
}

// In-memory / initial data fallback layer for zero-friction launch
let inMemoryJobs: Job[] = [...(initialJobs as unknown as Job[])];
let inMemoryBlogs: Blog[] = [...(initialBlogs as unknown as Blog[])];
let inMemoryResources: Resource[] = [...(initialResources as unknown as Resource[])];

// In-memory TTL cache to eliminate redundant network roundtrips and ensure <50ms response times
let cachedJobs: { data: Job[]; timestamp: number } | null = null;
let cachedBlogs: { data: Blog[]; timestamp: number } | null = null;
let cachedResources: { data: Resource[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL

export function invalidateCache() {
  cachedJobs = null;
  cachedBlogs = null;
  cachedResources = null;
}

function mapJobFromDb(row: any): Job {
  return {
    id: row.id,
    title: row.title,
    employer: row.employer,
    category: row.category,
    careerStage: row.career_stage || row.careerStage,
    city: row.city,
    workMode: row.work_mode || row.workMode,
    pay: row.pay,
    experience: row.experience,
    experienceSlab: row.experience_slab || row.experienceSlab,
    description: row.description,
    applyUrl: row.apply_url || row.applyUrl,
    postedOn: row.posted_on || row.postedOn,
    status: row.status,
    responsibilities: row.responsibilities,
    requirements: row.requirements,
    skills: row.skills,
    aboutCompany: row.about_company,
  };
}

function mapBlogFromDb(row: any): Blog {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    summary: row.summary,
    content: row.content,
    author: row.author,
    publishedOn: row.published_on || row.publishedOn,
    status: row.status,
  };
}

export async function getJobs(filter?: {
  category?: string;
  careerStage?: string;
  city?: string;
  search?: string;
  status?: string;
  experience?: string;
}): Promise<Job[]> {
  const isDefaultPublishedQuery = !filter || (!filter.status || filter.status === 'Published');
  const now = Date.now();

  let publishedJobs: Job[] | null = null;
  if (isDefaultPublishedQuery && cachedJobs && (now - cachedJobs.timestamp < CACHE_TTL_MS)) {
    publishedJobs = cachedJobs.data;
  } else if (isDefaultPublishedQuery) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('status', 'Published')
          .order('posted_on', { ascending: false });
        if (!error && data && data.length > 0) {
          publishedJobs = data.map(mapJobFromDb);
          cachedJobs = { data: publishedJobs, timestamp: now };
        }
      } catch {
        // Fallback on error
      }
    }
    if (!publishedJobs) {
      publishedJobs = inMemoryJobs.filter((j) => j.status === 'Published');
      cachedJobs = { data: publishedJobs, timestamp: now };
    }
  }

  // Base list
  let list = publishedJobs || inMemoryJobs;

  if (filter?.status) {
    list = list.filter((j) => j.status === filter.status);
  } else if (!publishedJobs) {
    list = list.filter((j) => j.status === 'Published');
  }

  if (filter?.careerStage) {
    const stage = filter.careerStage.toLowerCase();
    list = list.filter(
      (j) =>
        j.careerStage?.toLowerCase().includes(stage) ||
        j.category?.toLowerCase().includes(stage)
    );
  }

  if (filter?.category) {
    const cat = filter.category.toLowerCase();
    list = list.filter((j) => j.category?.toLowerCase().includes(cat));
  }

  if (filter?.city) {
    const city = filter.city.toLowerCase();
    list = list.filter((j) => j.city?.toLowerCase().includes(city));
  }

  if (filter?.search) {
    const q = filter.search.toLowerCase();
    list = list.filter(
      (j) =>
        j.title?.toLowerCase().includes(q) ||
        j.employer?.toLowerCase().includes(q) ||
        j.category?.toLowerCase().includes(q) ||
        j.skills?.toLowerCase().includes(q) ||
        j.description?.toLowerCase().includes(q)
    );
  }

  if (filter?.experience) {
    list = list.filter((j) => matchesExperienceSlab(j, filter.experience!));
  }

  return list;
}

export async function getJobById(id: string): Promise<Job | null> {
  // 1. Instant cache check (<0.1ms)
  if (cachedJobs?.data) {
    const found = cachedJobs.data.find((j) => j.id === id);
    if (found) return found;
  }

  // 2. Check in inMemoryJobs
  const foundInMemory = inMemoryJobs.find((j) => j.id === id);
  if (foundInMemory) return foundInMemory;

  // 3. Fallback to direct DB query if missing from memory
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();
      if (!error && data) return mapJobFromDb(data);
    } catch {
      // Fallback
    }
  }

  return null;
}

export async function createOrUpdateJob(job: Job): Promise<Job> {
  cachedJobs = null; // Invalidate cache immediately
  if (isSupabaseConfigured && supabase) {
    const dbRow = {
      id: job.id,
      title: job.title,
      employer: job.employer,
      category: job.category,
      career_stage: job.careerStage,
      city: job.city,
      work_mode: job.workMode,
      pay: job.pay,
      experience: job.experience,
      experience_slab: job.experienceSlab || null,
      description: job.description,
      responsibilities: job.responsibilities,
      requirements: job.requirements,
      skills: job.skills,
      apply_url: job.applyUrl,
      posted_on: job.postedOn,
      status: job.status,
    };
    const { data, error } = await supabase.from('jobs').upsert(dbRow).select().single();
    if (!error && data) return mapJobFromDb(data);
  }

  // Update in memory
  const idx = inMemoryJobs.findIndex((j) => j.id === job.id);
  if (idx >= 0) {
    inMemoryJobs[idx] = job;
  } else {
    inMemoryJobs.unshift(job);
  }
  return job;
}

export async function deleteJob(id: string): Promise<boolean> {
  cachedJobs = null; // Invalidate cache immediately
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (!error) return true;
  }

  inMemoryJobs = inMemoryJobs.filter((j) => j.id !== id);
  return true;
}

export async function getBlogs(): Promise<Blog[]> {
  const now = Date.now();
  if (cachedBlogs && (now - cachedBlogs.timestamp < CACHE_TTL_MS)) {
    return cachedBlogs.data;
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'Published')
        .order('published_on', { ascending: false });
      if (!error && data && data.length > 0) {
        const blogs = data.map(mapBlogFromDb);
        cachedBlogs = { data: blogs, timestamp: now };
        return blogs;
      }
    } catch {
      // Fallback
    }
  }

  const fallback = inMemoryBlogs.filter((b) => b.status === 'Published');
  cachedBlogs = { data: fallback, timestamp: now };
  return fallback;
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  // 1. Instant cache check (<0.1ms)
  if (cachedBlogs?.data) {
    const found = cachedBlogs.data.find((b) => b.slug === slug);
    if (found) return found;
  }

  // 2. Check in inMemoryBlogs
  const foundInMemory = inMemoryBlogs.find((b) => b.slug === slug);
  if (foundInMemory) return foundInMemory;

  // 3. Fallback to direct DB query if missing from memory
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .single();
      if (!error && data) return mapBlogFromDb(data);
    } catch {
      // Fallback
    }
  }

  return null;
}

export async function createOrUpdateBlog(blog: Blog): Promise<Blog> {
  cachedBlogs = null; // Invalidate cache immediately
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('blogs').upsert(blog).select().single();
    if (!error && data) return data as Blog;
  }

  const idx = inMemoryBlogs.findIndex((b) => b.slug === blog.slug);
  if (idx >= 0) {
    inMemoryBlogs[idx] = blog;
  } else {
    inMemoryBlogs.unshift(blog);
  }
  return blog;
}

export async function getResources(): Promise<Resource[]> {
  const now = Date.now();
  if (cachedResources && (now - cachedResources.timestamp < CACHE_TTL_MS)) {
    return cachedResources.data;
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('status', 'Published')
        .order('publishedOn', { ascending: false });
      if (!error && data && data.length > 0) {
        cachedResources = { data: data as Resource[], timestamp: now };
        return data as Resource[];
      }
    } catch {
      // Fallback
    }
  }

  const fallback = inMemoryResources.filter((r) => r.status === 'Published');
  cachedResources = { data: fallback, timestamp: now };
  return fallback;
}

export async function createOrUpdateResource(res: Resource): Promise<Resource> {
  cachedResources = null; // Invalidate cache immediately
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('resources').upsert(res).select().single();
    if (!error && data) return data as Resource;
  }

  const idx = inMemoryResources.findIndex((r) => r.id === res.id);
  if (idx >= 0) {
    inMemoryResources[idx] = res;
  } else {
    inMemoryResources.unshift(res);
  }
  return res;
}

export async function deleteBlog(slug: string): Promise<boolean> {
  cachedBlogs = null; // Invalidate cache immediately
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('blogs').delete().eq('slug', slug);
    if (!error) return true;
  }
  inMemoryBlogs = inMemoryBlogs.filter((b) => b.slug !== slug);
  return true;
}

export async function deleteResource(id: string): Promise<boolean> {
  cachedResources = null; // Invalidate cache immediately
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('resources').delete().eq('id', id);
    if (!error) return true;
  }
  inMemoryResources = inMemoryResources.filter((r) => r.id !== id);
  return true;
}
