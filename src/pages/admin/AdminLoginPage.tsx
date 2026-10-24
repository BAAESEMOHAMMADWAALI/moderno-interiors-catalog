/**
 * SECURE ADMIN LOGIN PAGE (`/admin/login`)
 * Phase 4 Locked File — Authenticates the shop owner via `signInAdmin` in
 * `adminProductService.ts`. Supports both Supabase Auth and instant local
 * preview login when running without `.env` credentials.
 */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, KeyRound, Lock, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { getAdminSession, signInAdmin } from '../../services/adminProductService';
import { useStoreSettings } from '../../context/StoreSettingsContext';

export const AdminLoginPage: React.FC = () => {
  const { settings } = useStoreSettings();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    void getAdminSession().then((session) => {
      if (session) {
        navigate('/admin/products', { replace: true });
      }
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    const { session, error } = await signInAdmin(email, password);
    setIsSubmitting(false);

    if (error || !session) {
      setErrorMsg(error || 'Authentication failed.');
      return;
    }

    navigate('/admin/products', { replace: true });
  };

  const handleQuickDemoFill = () => {
    setEmail('owner@modernointeriors.in');
    setPassword('admin1234');
    setErrorMsg(null);
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-12 bg-[#FAF8F5]">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#E5DFD3] shadow-xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E6A63] hover:text-[#1E1E1C]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Storefront</span>
          </Link>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F0ECE1] text-[#9C5A3C]">
            <ShieldCheck className="w-3 h-3" />
            Shop Owner Portal
          </span>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold text-[#1E1E1C]">
            {settings.shop_name} — Admin
          </h1>
          <p className="text-xs text-[#6E6A63] leading-relaxed">
            Sign in to manage products across all 16 categories, update per-Sq.Ft. quality rates, view Home Measurement requests, and edit store contact details.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-bold text-[#1E1E1C] mb-1"
            >
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#6E6A63] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@modernointeriors.in"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-xs text-[#1E1E1C] focus:outline-none focus:border-[#1E1E1C]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-bold text-[#1E1E1C] mb-1"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#6E6A63] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-xs text-[#1E1E1C] focus:outline-none focus:border-[#1E1E1C]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-[#1E1E1C] hover:bg-[#9C5A3C] text-white text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-sm"
          >
            <KeyRound className="w-4 h-4" />
            <span>{isSubmitting ? 'Signing In...' : 'Sign In to Admin Panel'}</span>
          </button>
        </form>

        {/* Instant Local Preview Helper */}
        <div className="pt-4 border-t border-[#E5DFD3] flex items-center justify-between gap-2">
          <span className="text-[11px] text-[#6E6A63]">
            Testing locally without Supabase?
          </span>
          <button
            type="button"
            onClick={handleQuickDemoFill}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#9C5A3C] hover:underline"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-Fill Owner Login</span>
          </button>
        </div>
      </div>
    </div>
  );
};
