-- CAJob.in Database Schema for Supabase (PostgreSQL)
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. PROFILES & USER ROLES
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  role text default 'candidate' check (role in ('super_admin', 'admin', 'employer', 'candidate')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Automatic Super Admin trigger for tripathia632@gmail.com
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    case when lower(new.email) = 'tripathia632@gmail.com' then 'super_admin' else 'candidate' end
  )
  on conflict (id) do update set
    role = case when lower(new.email) = 'tripathia632@gmail.com' then 'super_admin' else profiles.role end;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger on user creation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. JOBS TABLE
create table if not exists public.jobs (
  id text primary key,
  title text not null,
  employer text not null,
  category text default 'Finance',
  career_stage text not null default 'Qualified CA',
  city text default 'India',
  work_mode text default 'On-site',
  pay text,
  experience text,
  description text,
  responsibilities text,
  requirements text,
  skills text,
  apply_url text,
  apply_email text,
  posted_on text,
  closing_date text,
  search_ready boolean default true,
  about_company text,
  employment_type text default 'Full-time',
  joining_notice text,
  application_instructions text,
  company_website text,
  qualification text,
  employer_posted_on text,
  last_checked text,
  status text default 'Published' check (status in ('Published', 'Draft', 'Closed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexing for fast search & filtering
create index if not exists idx_jobs_category on public.jobs(category);
create index if not exists idx_jobs_career_stage on public.jobs(career_stage);
create index if not exists idx_jobs_city on public.jobs(city);
create index if not exists idx_jobs_status on public.jobs(status);

-- 3. BLOGS & GUIDES TABLE
create table if not exists public.blogs (
  slug text primary key,
  title text not null,
  category text not null,
  summary text,
  content text not null,
  author text default 'CAJob.in Editorial',
  published_on text,
  status text default 'Published' check (status in ('Published', 'Draft')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_blogs_category on public.blogs(category);

-- 4. RESOURCES TABLE
create table if not exists public.resources (
  id text primary key,
  title text not null,
  category text not null,
  file_type text default 'PDF',
  description text,
  file_url text not null,
  published_on text,
  downloads int default 0,
  status text default 'Published',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. WEB TOOLS TABLE
create table if not exists public.web_tools (
  id text primary key,
  slug text unique not null,
  title text not null,
  category text not null,
  description text,
  tool_type text default 'built-in',
  status text default 'Active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. SAVED JOBS (CANDIDATE BOOKMARKS)
create table if not exists public.saved_jobs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  job_id text references public.jobs(id) on delete cascade not null,
  saved_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, job_id)
);

-- ROW LEVEL SECURITY (RLS) POLICIES
alter table public.jobs enable row level security;
alter table public.blogs enable row level security;
alter table public.resources enable row level security;
alter table public.web_tools enable row level security;
alter table public.profiles enable row level security;
alter table public.saved_jobs enable row level security;

-- Public can read published content
create policy "Public can view published jobs" on public.jobs for select using (status = 'Published');
create policy "Public can view published blogs" on public.blogs for select using (status = 'Published');
create policy "Public can view published resources" on public.resources for select using (status = 'Published');
create policy "Public can view active web tools" on public.web_tools for select using (status = 'Active');

-- Super Admin has full write access (tripathia632@gmail.com)
create policy "Admins have full access to jobs" on public.jobs for all using (
  auth.jwt()->>'email' = 'tripathia632@gmail.com' or
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'admin'))
);

create policy "Admins have full access to blogs" on public.blogs for all using (
  auth.jwt()->>'email' = 'tripathia632@gmail.com' or
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'admin'))
);

create policy "Admins have full access to resources" on public.resources for all using (
  auth.jwt()->>'email' = 'tripathia632@gmail.com' or
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'admin'))
);

create policy "Admins have full access to web tools" on public.web_tools for all using (
  auth.jwt()->>'email' = 'tripathia632@gmail.com' or
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'admin'))
);
