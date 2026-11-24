import communityData from '@/data/community-channels.json';

export interface CommunityChannel {
  id: string;
  name: string;
  type: string;
  category: string;
  tagline: string;
  url: string;
  badge: string;
  status: string;
  memberCount: string;
  featured: boolean;
}

export const WHATSAPP_FEEDBACK_NUMBER = '+91 94144 64215';
export const WHATSAPP_FEEDBACK_RAW = '919414464215';

export const WHATSAPP_FEEDBACK_URL = `https://wa.me/919414464215?text=${encodeURIComponent(
  'Hi CAJob.in Team, I have a query/feedback regarding the portal:'
)}`;

export const OFFICIAL_WHATSAPP_CHANNEL_URL = 'https://whatsapp.com/channel/0029VbE2GOCEKyZ9add17k29';

export function getCommunityChannels(): CommunityChannel[] {
  return communityData as CommunityChannel[];
}

export function getFeaturedChannel(): CommunityChannel | undefined {
  return (communityData as CommunityChannel[]).find((c) => c.featured);
}
