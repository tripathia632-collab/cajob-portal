export type CareerStage = 'Articleship' | 'Industrial Training' | 'Qualified CA' | 'Other Finance Jobs' | 'Related Finance Jobs';

export type WorkMode = 'On-site' | 'Hybrid' | 'Remote';

export type JobStatus = 'Published' | 'Draft' | 'Closed';

export interface Job {
  id: string;
  title: string;
  employer: string;
  category: string;
  careerStage: CareerStage | string;
  city: string;
  workMode: WorkMode;
  pay?: string;
  experience?: string;
  experienceSlab?: string;
  description: string;
  applyUrl?: string;
  applyEmail?: string;
  postedOn?: string;
  closingDate?: string;
  searchReady?: boolean;
  aboutCompany?: string;
  responsibilities?: string;
  requirements?: string;
  skills?: string;
  employmentType?: string;
  joiningNotice?: string;
  applicationInstructions?: string;
  companyWebsite?: string;
  qualification?: string;
  employerPostedOn?: string;
  lastChecked?: string;
  status: JobStatus;
}

export interface Blog {
  slug: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  author: string;
  publishedOn: string;
  status: 'Published' | 'Draft';
  readTime?: string;
}

export interface Resource {
  id: string;
  title: string;
  category: string;
  fileType: string;
  description: string;
  fileUrl: string;
  publishedOn: string;
  status: 'Published' | 'Draft';
  downloads?: number;
}

export interface WebTool {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  toolType: 'built-in' | 'calculator' | 'checker' | 'embed';
  status: 'Active' | 'Draft';
  componentPath?: string;
}

export type UserRole = 'super_admin' | 'admin' | 'employer' | 'candidate';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
  savedJobs?: string[];
}
