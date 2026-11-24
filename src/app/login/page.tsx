'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { SUPER_ADMIN_EMAIL } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Save session in localStorage for prototype/live mock
    const cleanEmail = email.trim().toLowerCase();
    localStorage.setItem('cajob_user_email', cleanEmail);

    setTimeout(() => {
      setLoading(false);
      if (cleanEmail === SUPER_ADMIN_EMAIL.toLowerCase()) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }, 400);
  };

  const handleQuickAdminLogin = () => {
    setEmail(SUPER_ADMIN_EMAIL);
    localStorage.setItem('cajob_user_email', SUPER_ADMIN_EMAIL);
    router.push('/admin');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-[#F5F7F6] py-12 sm:px-6 lg:px-8">
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
          {isSignUp ? 'Create your account' : 'Sign in to your account'}
        </h2>
        <p className="mt-1.5 text-xs text-[#52676D]">
          Access your saved jobs, applications, and personalized career alerts
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-[#DCE5E0] shadow-sm space-y-6">
          {/* Quick Super Admin Bypass Banner for tripathia632@gmail.com */}
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0" />
              <div className="text-[11px] text-emerald-900 leading-tight">
                <strong>Super Admin Access:</strong>
                <div className="text-emerald-700 truncate">{SUPER_ADMIN_EMAIL}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleQuickAdminLogin}
              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[10px] font-bold uppercase transition-colors whitespace-nowrap"
            >
              Enter Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to ' + (email || 'your email'))}
                    className="text-[11px] font-semibold text-[#08765D] hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#52676D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F5F7F6] rounded-xl text-sm border border-[#DCE5E0] focus:outline-none focus:border-[#08765D]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#08765D] hover:bg-[#065F4B] text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Signing in...' : isSignUp ? 'Create Account' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-[#F0F4F2] text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-[#52676D] hover:text-[#102D37]"
            >
              {isSignUp ? (
                <>Already have an account? <span className="font-bold text-[#08765D]">Sign In</span></>
              ) : (
                <>New to CAJob.in? <span className="font-bold text-[#08765D]">Create free candidate account</span></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
