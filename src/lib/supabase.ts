import { createClient } from '@supabase/supabase-js';
import initialJobs from '@/data/initial-jobs.json';
import initialBlogs from '@/data/initial-blogs.json';
import initialResources from '@/data/initial-resources.json';
import { Job, Blog, Resource } from '@/types';

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
}): Promise<Job[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('jobs').select('*');
      if (filter?.status) {
        query = query.eq('status', filter.status);
      } else {
        query = query.eq('status', 'Published');
      }
      if (filter?.careerStage) {
        query = query.ilike('career_stage', `%${filter.careerStage}%`);
      }
      if (filter?.category) {
        query = query.ilike('category', `%${filter.category}%`);
      }
      if (filter?.city) {
        query = query.ilike('city', `%${filter.city}%`);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map(mapJobFromDb);
      }
    } catch {
      // Fallback on error
    }
  }

  // Fallback to local data
  let list = inMemoryJobs;
  if (filter?.status) {
    list = list.filter((j) => j.status === filter.status);
  } else {
    // default published
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

  return list;
}

export async function getJobById(id: string): Promise<Job | null> {
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

  const found = inMemoryJobs.find((j) => j.id === id);
  return found || null;
}

export async function createOrUpdateJob(job: Job): Promise<Job> {
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
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (!error) return true;
  }

  inMemoryJobs = inMemoryJobs.filter((j) => j.id !== id);
  return true;
}

export async function getBlogs(): Promise<Blog[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'Published')
        .order('published_on', { ascending: false });
      if (!error && data && data.length > 0) return data.map(mapBlogFromDb);
    } catch {
      // Fallback
    }
  }

  return inMemoryBlogs.filter((b) => b.status === 'Published');
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
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

  const found = inMemoryBlogs.find((b) => b.slug === slug);
  return found || null;
}

export async function createOrUpdateBlog(blog: Blog): Promise<Blog> {
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
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('status', 'Published')
        .order('publishedOn', { ascending: false });
      if (!error && data && data.length > 0) return data as Resource[];
    } catch {
      // Fallback
    }
  }

  return inMemoryResources.filter((r) => r.status === 'Published');
}

export async function createOrUpdateResource(res: Resource): Promise<Resource> {
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
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('blogs').delete().eq('slug', slug);
    if (!error) return true;
  }
  inMemoryBlogs = inMemoryBlogs.filter((b) => b.slug !== slug);
  return true;
}

export async function deleteResource(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('resources').delete().eq('id', id);
    if (!error) return true;
  }
  inMemoryResources = inMemoryResources.filter((r) => r.id !== id);
  return true;
}
