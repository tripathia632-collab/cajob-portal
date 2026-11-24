'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Eye, EyeOff, KeyRound } from 'lucide-react';
import {
  SUPER_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
  INITIAL_ADMIN_PROFILE,
  saveSession,
  getStoredSession,
  isAuthorizedAdmin,
} from '@/lib/auth';
import { UserProfile } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Prefill check
  useEffect(() => {
    const session = getStoredSession();
    if (session) {
      if (isAuthorizedAdmin(session.user.email)) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    // 1. Admin Login check
    if (cleanEmail === SUPER_ADMIN_EMAIL.toLowerCase()) {
      const storedAdminPass = typeof window !== 'undefined'
        ? localStorage.getItem('cajob_admin_custom_password') || DEFAULT_ADMIN_PASSWORD
        : DEFAULT_ADMIN_PASSWORD;

      if (password !== storedAdminPass) {
        setLoading(false);
        setErrorMsg('Invalid password for Super Administrator. Default password is: ' + DEFAULT_ADMIN_PASSWORD);
        return;
      }

      // Success Super Admin Login
      saveSession(INITIAL_ADMIN_PROFILE);
      setSuccessMsg('Authenticated as Super Administrator. Redirecting to CMS...');
      setTimeout(() => {
        router.push('/admin');
      }, 500);
      return;
    }

    // 2. Candidate / Employer login
    if (isSignUp) {
      if (!fullName) {
        setLoading(false);
        setErrorMsg('Please enter your full name');
        return;
      }
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        email: cleanEmail,
        fullName,
        role: 'candidate',
        createdAt: new Date().toISOString(),
        savedJobs: [],
      };
      saveSession(newUser);
      setSuccessMsg('Account created successfully! Redirecting...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
      return;
    }

    // Normal sign in
    const user: UserProfile = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      fullName: cleanEmail.split('@')[0],
      role: isAuthorizedAdmin(cleanEmail) ? 'admin' : 'candidate',
      createdAt: new Date().toISOString(),
      savedJobs: [],
    };
    saveSession(user);
    setSuccessMsg('Signed in successfully! Redirecting...');
    setTimeout(() => {
      if (isAuthorizedAdmin(cleanEmail)) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }, 500);
  };

  const handleFillAdmin = () => {
    setEmail(SUPER_ADMIN_EMAIL);
    const pass = typeof window !== 'undefined'
      ? localStorage.getItem('cajob_admin_custom_password') || DEFAULT_ADMIN_PASSWORD
      : DEFAULT_ADMIN_PASSWORD;
    setPassword(pass);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-[#F5F7F6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-3">
          <Image
            src="/brand/doorway.svg"
            alt="CAJob.in"
            width={40}
            height={48}
            className="object-contain"
          />
          <span className="font-extrabold text-3xl tracking-tight text-[#102D37]">
            cajob<span className="text-[#08765D]">.in</span>
          </span>
        </Link>
        <h2 className="mt-4 text-2xl font-extrabold text-[#102D37] tracking-tight">
          {isSignUp ? 'Create your account' : 'Sign in to CAJob.in'}
        </h2>
        <p className="mt-1.5 text-xs text-[#52676D]">
          {isSignUp
            ? 'Save job vacancies, track applications and access free resources'
            : 'Access your candidate dashboard or manage administrator tools'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-[#DCE5E0] shadow-sm space-y-6">
          {/* Super Admin Quick Helper Banner */}
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-[#EAF4EF] rounded-2xl border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Super Admin Access
              </div>
              <button
                type="button"
                onClick={handleFillAdmin}
                className="text-[11px] font-bold text-emerald-800 bg-emerald-200/60 hover:bg-emerald-200 px-2.5 py-1 rounded-md transition-colors"
              >
                Auto-fill credentials
              </button>
            </div>
            <div className="text-[11px] text-emerald-900/80 font-mono space-y-0.5">
              <div>Email: <strong>{SUPER_ADMIN_EMAIL}</strong></div>
              <div>Password: <strong>{DEFAULT_ADMIN_PASSWORD}</strong></div>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-800 rounded-xl text-xs font-semibold border border-red-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-bold uppercase text-[#52676D] mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ashish Tripathi"
                  className="w-full px-4 py-2.5 bg-[#F5F7F6] rounded-xl text-sm border border-[#DCE5E0] focus:outline-none focus:border-[#08765D]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase text-[#52676D] mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#52676D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. tripathia632@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F5F7F6] rounded-xl text-sm border border-[#DCE5E0] focus:outline-none focus:border-[#08765D]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase text-[#52676D]">
                  Password
                </label>
                {!isSignUp && (
                  <span className="text-[11px] text-[#52676D]">
                    Protected login
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#52676D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#F5F7F6] rounded-xl text-sm border border-[#DCE5E0] focus:outline-none focus:border-[#08765D]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52676D] hover:text-[#102D37]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#08765D] hover:bg-[#065F4B] text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : isSignUp ? 'Create Free Account' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-[#F0F4F2] text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg(null);
              }}
              className="text-xs text-[#52676D] hover:text-[#102D37]"
            >
              {isSignUp ? (
                <>Already have an account? <span className="font-bold text-[#08765D]">Sign In</span></>
              ) : (
                <>New candidate? <span className="font-bold text-[#08765D]">Create free candidate profile</span></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
