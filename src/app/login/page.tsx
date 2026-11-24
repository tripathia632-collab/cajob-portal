'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, ArrowRight, ArrowLeft, AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import {
  SUPER_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
  INITIAL_ADMIN_PROFILE,
  saveSession,
  getStoredSession,
  isAuthorizedAdmin,
} from '@/lib/auth';
import { UserProfile } from '@/types';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // If already authenticated, redirect
  useEffect(() => {
    const session = getStoredSession();
    if (session) {
      if (isAuthorizedAdmin(session.user.email)) {
        router.push(redirectTarget || '/admin');
      } else {
        router.push(redirectTarget || '/dashboard');
      }
    }
  }, [router, redirectTarget]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    // 1. Super Administrator Login
    if (cleanEmail === SUPER_ADMIN_EMAIL.toLowerCase()) {
      const storedAdminPass = typeof window !== 'undefined'
        ? localStorage.getItem('cajob_admin_custom_password') || DEFAULT_ADMIN_PASSWORD
        : DEFAULT_ADMIN_PASSWORD;

      if (password !== storedAdminPass) {
        setLoading(false);
        setErrorMsg('Invalid credentials. Please verify your email and password.');
        return;
      }

      // Success Super Admin Login
      saveSession(INITIAL_ADMIN_PROFILE);
      setSuccessMsg('Authenticated as Super Administrator. Loading CMS...');
      setTimeout(() => {
        router.push(redirectTarget || '/admin');
      }, 500);
      return;
    }

    // 2. Candidate Sign up
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
      setSuccessMsg('Account created successfully. Redirecting...');
      setTimeout(() => {
        router.push(redirectTarget || '/dashboard');
      }, 500);
      return;
    }

    // 3. Normal Sign in
    if (!password) {
      setLoading(false);
      setErrorMsg('Please enter your password.');
      return;
    }

    const user: UserProfile = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      fullName: cleanEmail.split('@')[0],
      role: isAuthorizedAdmin(cleanEmail) ? 'admin' : 'candidate',
      createdAt: new Date().toISOString(),
      savedJobs: [],
    };
    saveSession(user);
    setSuccessMsg('Signed in successfully. Redirecting...');
    setTimeout(() => {
      if (isAuthorizedAdmin(cleanEmail)) {
        router.push(redirectTarget || '/admin');
      } else {
        router.push(redirectTarget || '/dashboard');
      }
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-[#F5F7F6] py-12 px-4 sm:px-6 lg:px-8">
      {/* Top back navigation */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#52676D] hover:text-[#08765D] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to cajob.in
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* User's Exact Doorway Logo */}
        <Link href="/" className="inline-flex items-center gap-2.5">
          <Image
            src="/brand/doorway-icon.png"
            alt="cajob.in"
            width={36}
            height={48}
            className="object-contain"
            priority
          />
          <span className="font-extrabold text-3xl tracking-tight text-[#102D37]">
            cajob<span className="text-[#08765D]">.in</span>
          </span>
        </Link>
        <h2 className="mt-4 text-2xl font-extrabold text-[#102D37] tracking-tight">
          {isSignUp ? 'Create candidate account' : 'Sign in to CAJob.in'}
        </h2>
        <p className="mt-1.5 text-xs text-[#52676D]">
          {isSignUp
            ? 'Save job vacancies, track applications and access free resources'
            : 'Access candidate dashboard and saved vacancies'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-[#DCE5E0] shadow-sm space-y-6">
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
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 bg-[#F5F7F6] text-[#102D37] rounded-xl text-sm border border-transparent focus:border-[#08765D] focus:bg-white focus:outline-none transition-all placeholder:text-[#52676D]/60"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase text-[#52676D] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#52676D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#F5F7F6] text-[#102D37] rounded-xl text-sm border border-transparent focus:border-[#08765D] focus:bg-white focus:outline-none transition-all placeholder:text-[#52676D]/60"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#52676D] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#52676D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#F5F7F6] text-[#102D37] rounded-xl text-sm border border-transparent focus:border-[#08765D] focus:bg-white focus:outline-none transition-all"
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
              className="w-full py-3 px-4 bg-[#08765D] hover:bg-[#065F4B] text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : isSignUp ? 'Create account' : 'Sign in'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-[#DCE5E0] text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg(null);
              }}
              className="text-xs font-semibold text-[#08765D] hover:underline"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account yet? Create one"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7F6]">
        <div className="w-8 h-8 border-3 border-[#08765D] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

