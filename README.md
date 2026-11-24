# CAJob.in — Enterprise Portal

> **Production URL:** [https://www.cajob.in/](https://www.cajob.in/)  
> **Primary Super Administrator:** `tripathia632@gmail.com`  
> **Local Server:** `http://localhost:3000`

---

## 🌟 What Has Been Built

1. **Brand Identity & The Signature 3D Gate Hero**:
   - Official mint/teal doorway vector mark (`/brand/doorway.svg` and `/brand/cajob-logo-dark.svg`).
   - The interactive **3D isometric Gate Doorway** with glowing ambient lighting and **circulating orbit tags** (`Articleship`, `Industrial training`, `CA careers`, `Finance jobs`).
2. **Design System & Layouts (From Friend's 37 Figma Screens)**:
   - Palette: Navy `#102D37`, Emerald Brand `#08765D`, Mint `#EAF4EF`, Background `#F5F7F6`, Line `#DCE5E0`, Slate `#52676D`, Lime `#D9F29B`.
   - Desktop 1440px layout & mobile 390px sliding filter drawer.
3. **Core Public Modules**:
   - `/`: Homepage with hero, brand strip, 4-tier category pathways, featured jobs, 3-step value prop, guidance section, employer CTA, and newsletter capture.
   - `/jobs`: Search, location, career stage, experience, work mode, and bookmarking.
   - `/articleship`: Filtered for CA articleship (fresh registrations and transfers).
   - `/industrial-training`: Filtered for corporate industrial training vacancies.
   - `/ca-jobs`: Filtered for qualified Chartered Accountants.
   - `/finance-jobs`: Filtered for CA Inter, semi-qualified, and financial analysts.
   - `/job/[id]`: Job details with Schema.org `JobPosting` structured data for Google Jobs SEO.
   - `/blog` & `/blog/[slug]`: 50+ editorial career guides.
   - `/resources`: Downloadable templates (CV checklists, application emails, comparison sheets).
   - `/tools`: Web tools hub featuring the interactive *ICAI Articleship Stipend & Scheme Calculator*.
   - `/about`, `/contact`, `/for-employers`, `/courses`, `/privacy`, `/terms`, `/cookie-notice`.
4. **Super Admin CMS (`/admin`)**:
   - Strictly reserved for `tripathia632@gmail.com`.
   - **Jobs Desk**: Post, edit, verify, or delete jobs.
   - **Blogs Desk**: Write and publish career guides.
   - **Free Resources Desk**: Add downloadable files and templates.
   - **Web Tools Desk**: Register new calculators and interactive tools.
   - **Admin Access & Delegations**: Grant or revoke admin privileges to additional email addresses.
5. **Candidate Authentication & Dashboard (`/login`, `/dashboard`)**:
   - Sign in to view saved jobs, application bookmarks, and tools.

---

## 🚀 Quick Start Guide

### 1. Run Locally
```bash
cd cajob-portal
npm install
npm run build
npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 2. Super Admin Access
Visit **[http://localhost:3000/login](http://localhost:3000/login)** or **[http://localhost:3000/admin](http://localhost:3000/admin)**.  
Entering `tripathia632@gmail.com` grants instant Super Admin access.

### 3. Connect Supabase (Optional for Live Cloud DB)
1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in Supabase and run the script in `supabase/schema.sql`.
3. Create a `.env.local` file with:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Run `npm run seed` to insert all 64 jobs, 50 blogs, and 3 resources into your cloud database.

---

## 🌐 Deploy to Vercel (100% Free Tier)
1. Push this folder to a GitHub repository.
2. In [Vercel](https://vercel.com), import the repository.
3. In Project Settings -> Domains, add `cajob.in` and `www.cajob.in`.
4. Your DNS at Hostinger / Cloudflare will automatically route to Vercel with free SSL!
