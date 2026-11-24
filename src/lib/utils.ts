import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string): string {
  if (!dateString) return 'Recently';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function timeAgo(dateString?: string): string {
  if (!dateString) return 'Posted recently';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'Posted today';
    if (diffDays === 1) return 'Posted 1 day ago';
    if (diffDays < 30) return `Posted ${diffDays} days ago`;
    return formatDate(dateString);
  } catch {
    return dateString;
  }
}

export const EXPERIENCE_SLABS = [
  { id: '', label: 'All Experience', short: 'All Exp' },
  { id: 'fresher', label: 'Fresher / Trainee', short: 'Fresher' },
  { id: '0-2', label: '0 – 2 Years', short: '0–2 yrs' },
  { id: '2-5', label: '2 – 5 Years', short: '2–5 yrs' },
  { id: '5-8', label: '5 – 8 Years', short: '5–8 yrs' },
  { id: '8+', label: '8+ Years', short: '8+ yrs' },
] as const;

export function parseJobExperienceRange(job: {
  experience?: string;
  careerStage?: string;
  category?: string;
  experienceSlab?: string;
}) {
  if (job.experienceSlab) {
    const s = job.experienceSlab.toLowerCase();
    if (s.includes('fresh')) return { min: 0, max: 0, isTrainee: true };
    if (s.includes('0-2') || s.includes('0 - 2')) return { min: 0, max: 2, isTrainee: false };
    if (s.includes('2-5') || s.includes('2 - 5')) return { min: 2, max: 5, isTrainee: false };
    if (s.includes('5-8') || s.includes('5 - 8')) return { min: 5, max: 8, isTrainee: false };
    if (s.includes('8')) return { min: 8, max: 99, isTrainee: false };
  }

  const exp = (job.experience || '').toLowerCase().trim();
  const stage = (job.careerStage || job.category || '').toLowerCase();

  const isTrainee =
    stage.includes('article') ||
    stage.includes('industrial') ||
    /\b(article|articleship|trainee|intern|internship|inter)\b/.test(exp) ||
    /\b(article|articleship|trainee|intern|internship|inter)\b/.test(stage);

  if (isTrainee) {
    return { min: 0, max: 1, isTrainee: true };
  }

  if (/\b(fresher|freshers|fresh)\b/.test(exp)) {
    return { min: 0, max: 0, isTrainee: true };
  }

  const numbers = exp.match(/\d+/g);
  if (numbers && numbers.length >= 2) {
    return { min: parseInt(numbers[0], 10), max: parseInt(numbers[1], 10), isTrainee: false };
  }
  if (numbers && numbers.length === 1) {
    const num = parseInt(numbers[0], 10);
    if (exp.includes('+')) {
      return { min: num, max: 99, isTrainee: false };
    }
    return { min: num, max: num, isTrainee: false };
  }

  return { min: 0, max: 2, isTrainee: false };
}

export function matchesExperienceSlab(
  job: { experience?: string; careerStage?: string; category?: string; experienceSlab?: string },
  slab: string
): boolean {
  if (!slab) return true;
  const { min, max, isTrainee } = parseJobExperienceRange(job);

  if (slab === 'fresher') {
    return isTrainee || min === 0;
  }
  if (slab === '0-2') {
    return isTrainee || (min <= 1 && max <= 3) || (min <= 2 && max <= 2);
  }
  if (slab === '2-5') {
    return (min >= 2 && min <= 5) || (max >= 3 && min <= 3 && max <= 6);
  }
  if (slab === '5-8') {
    return (min >= 5 && min <= 8) || (min >= 4 && max >= 6 && max <= 8);
  }
  if (slab === '8+') {
    return max >= 8 || min >= 8;
  }
  return true;
}

export function getExperienceDisplayLabel(job: {
  experience?: string;
  careerStage?: string;
  category?: string;
  experienceSlab?: string;
}): string {
  if (job.experience) return job.experience;
  if (job.experienceSlab) return job.experienceSlab;
  const { min, max, isTrainee } = parseJobExperienceRange(job);
  if (isTrainee) return 'Articleship / Fresher';
  if (max >= 8) return '8+ years';
  if (min >= 5) return '5-8 years';
  if (min >= 2) return '2-5 years';
  return '0-2 years';
}
