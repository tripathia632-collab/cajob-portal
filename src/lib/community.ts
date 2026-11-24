import communityData from '@/data/community-channels.json';

export interface CommunityChannel {
  id: string;
  name: string;
  type: string;
  category: string;
  audience?: string;
  tagline: string;
  description?: string;
  url: string;
  badge: string;
  status: 'Active' | 'Coming Soon';
  memberCount: string;
  featured: boolean;
}

/**
 * DIRECT WHATSAPP FEEDBACK & CONTACT LINE
 * For direct message, feedback, job postings, and questions.
 * Kept separate from WhatsApp Community broadcast channels.
 */
export const WHATSAPP_FEEDBACK_NUMBER = '+91 94144 64215';
export const WHATSAPP_FEEDBACK_RAW = '919414464215';
export const WHATSAPP_FEEDBACK_URL = `https://wa.me/919414464215?text=${encodeURIComponent(
  'Hi CAJob.in, I have a query/feedback:'
)}`;

/**
 * OFFICIAL WHATSAPP COMMUNITY & BROADCAST CHANNEL
 * For real-time finance jobs, articleship updates, and community alerts.
 */
export const OFFICIAL_WHATSAPP_CHANNEL_URL = 'https://whatsapp.com/channel/0029VbE2GOCEKyZ9add17k29';

export function getCommunityChannels(): CommunityChannel[] {
  return communityData as CommunityChannel[];
}

export function getFeaturedChannel(): CommunityChannel | undefined {
  return (communityData as CommunityChannel[]).find((c) => c.featured);
}

export function getActiveChannels(): CommunityChannel[] {
  return (communityData as CommunityChannel[]).filter((c) => c.status === 'Active');
}

export function getUpcomingChannels(): CommunityChannel[] {
  return (communityData as CommunityChannel[]).filter((c) => c.status !== 'Active');
}
