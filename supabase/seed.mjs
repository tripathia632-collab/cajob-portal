// Script to seed all 64 jobs, 50 blogs, and 3 resources into live Supabase database
// Usage: node supabase/seed.mjs
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('🚀 Seeding data to Supabase:', supabaseUrl);

  // 1. Jobs
  const jobsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/initial-jobs.json'), 'utf-8'));
  console.log(`Inserting ${jobsData.length} jobs...`);
  const formattedJobs = jobsData.map((j) => ({
    id: j.id,
    title: j.title,
    employer: j.employer,
    category: j.category,
    career_stage: j.careerStage,
    city: j.city,
    work_mode: j.workMode,
    pay: j.pay,
    experience: j.experience,
    description: j.description,
    apply_url: j.applyUrl,
    posted_on: j.postedOn,
    status: j.status,
  }));
  const { error: jobsErr } = await supabase.from('jobs').upsert(formattedJobs);
  if (jobsErr) console.error('Jobs error:', jobsErr);
  else console.log('✅ Jobs seeded successfully.');

  // 2. Blogs
  const blogsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/initial-blogs.json'), 'utf-8'));
  console.log(`Inserting ${blogsData.length} blogs...`);
  const { error: blogsErr } = await supabase.from('blogs').upsert(blogsData);
  if (blogsErr) console.error('Blogs error:', blogsErr);
  else console.log('✅ Blogs seeded successfully.');

  // 3. Resources
  const resourcesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/initial-resources.json'), 'utf-8'));
  console.log(`Inserting ${resourcesData.length} resources...`);
  const formattedResources = resourcesData.map((r) => ({
    id: r.id,
    title: r.title,
    category: r.category,
    file_type: r.fileType,
    description: r.description,
    file_url: r.fileUrl,
    published_on: r.publishedOn,
    status: r.status,
  }));
  const { error: resErr } = await supabase.from('resources').upsert(formattedResources);
  if (resErr) console.error('Resources error:', resErr);
  else console.log('✅ Resources seeded successfully.');

  console.log('🎉 Seeding complete!');
}

seed().catch(console.error);
