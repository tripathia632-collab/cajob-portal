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
 * 1-ON-1 DIRECT WHATSAPP FEEDBACK & DESK LINE
 * Used exclusively for direct private messaging, bug reports, job postings, and user support.
 * DO NOT combine with WhatsApp Broadcast Channels.
 */
export const WHATSAPP_FEEDBACK_NUMBER = '+91 94144 64215';
export const WHATSAPP_FEEDBACK_RAW = '919414464215';
export const WHATSAPP_FEEDBACK_URL = `https://wa.me/919414464215?text=${encodeURIComponent(
  'Hi CAJob.in Support Desk, I have a query/feedback regarding the portal:'
)}`;

/**
 * OFFICIAL BROADCAST WHATSAPP CHANNEL
 * One-way broadcast channel for real-time finance jobs and alerts.
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
