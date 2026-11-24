import { UserProfile, UserRole } from '@/types';

export const SUPER_ADMIN_EMAIL = 'tripathia632@gmail.com';
export const DEFAULT_ADMIN_PASSWORD = 'CAJobAdmin@2026!';

export interface AuthSession {
  user: UserProfile;
  token: string;
  expiresAt: number;
}

// Default initial admin profile
export const INITIAL_ADMIN_PROFILE: UserProfile = {
  id: 'usr-admin-primary',
  email: SUPER_ADMIN_EMAIL,
  fullName: 'Ashish Tripathi (Admin)',
  role: 'super_admin',
  createdAt: '2026-11-23T00:00:00Z',
  savedJobs: [],
};

// Key for local storage
const AUTH_KEY = 'cajob_auth_session';
const ADMIN_LIST_KEY = 'cajob_authorized_admins';

export function getAuthorizedAdmins(): string[] {
  if (typeof window === 'undefined') return [SUPER_ADMIN_EMAIL];
  try {
    const stored = localStorage.getItem(ADMIN_LIST_KEY);
    if (!stored) return [SUPER_ADMIN_EMAIL];
    const list = JSON.parse(stored);
    if (!list.includes(SUPER_ADMIN_EMAIL)) list.unshift(SUPER_ADMIN_EMAIL);
    return list;
  } catch {
    return [SUPER_ADMIN_EMAIL];
  }
}

export function saveAuthorizedAdmins(admins: string[]) {
  if (typeof window === 'undefined') return;
  if (!admins.includes(SUPER_ADMIN_EMAIL)) admins.unshift(SUPER_ADMIN_EMAIL);
  localStorage.setItem(ADMIN_LIST_KEY, JSON.stringify(admins));
}

export function getStoredSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) return null;
    const session: AuthSession = JSON.parse(stored);
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(AUTH_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function saveSession(user: UserProfile): AuthSession {
  const session: AuthSession = {
    user,
    token: 'jwt_' + Math.random().toString(36).substring(2) + Date.now(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    localStorage.setItem('cajob_user_email', user.email);
  }
  return session;
}

export function clearSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem('cajob_user_email');
  }
}

export function isSuperAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
}

export function isAuthorizedAdmin(email?: string | null): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  const admins = getAuthorizedAdmins().map((a) => a.toLowerCase());
  return isSuperAdminEmail(clean) || admins.includes(clean);
}
