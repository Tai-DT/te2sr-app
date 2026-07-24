'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import { X, Lock, Mail, User as UserIcon, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

function loadGsiScript(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve();
    if ((window as any).google?.accounts?.id) return resolve();
    const existing = document.getElementById('google-gsi-script') as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
}

export const AuthModal: React.FC = () => {
  const { login, register, loginWithGoogle, isAuthModalOpen, closeAuthModal } = useAuth();
  const isOpen = isAuthModalOpen;
  const onClose = closeAuthModal;
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const googleBtnRef = useRef<HTMLDivElement>(null);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  // Render the official Google Identity button when the modal is open.
  useEffect(() => {
    if (!isOpen || !googleClientId) return;
    let cancelled = false;
    loadGsiScript().then(() => {
      if (cancelled) return;
      const g = (window as any).google;
      if (!g?.accounts?.id || !googleBtnRef.current) return;
      g.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response: { credential?: string }) => {
          if (!response.credential) return;
          setSubmitting(true);
          setError('');
          const res = await loginWithGoogle(response.credential);
          if (!res.ok) setError(res.error || 'Đăng nhập Google thất bại.');
          setSubmitting(false);
        },
      });
      googleBtnRef.current.innerHTML = '';
      g.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'outline',
        size: 'large',
        width: 320,
        text: isRegister ? 'signup_with' : 'signin_with',
        shape: 'pill',
      });
    });
    return () => { cancelled = true; };
  }, [isOpen, isRegister, googleClientId, loginWithGoogle]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (isRegister && !name.trim()) { setError('Vui lòng nhập họ tên.'); return; }
    if (password.length < 6) { setError('Mật khẩu tối thiểu 6 ký tự.'); return; }
    setSubmitting(true);
    const res = isRegister ? await register(name.trim(), email, password) : await login(email, password);
    if (!res.ok) setError(res.error || 'Có lỗi xảy ra.');
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop animate-fadeIn">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-apple-lg space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 border border-brand-blue/20 text-brand-blue flex items-center justify-center mx-auto shadow-apple-sm">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold font-display text-slate-900">
            {isRegister ? 'Đăng Ký Tài Khoản' : 'Đăng Nhập'}
          </h2>
          <p className="text-xs text-slate-500">
            Theo dõi tiến độ duyệt app, chat trực tiếp & xem báo cáo kiểm thử.
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Google button (official GSI) */}
        {googleClientId ? (
          <div className="flex justify-center min-h-[44px]">
            <div ref={googleBtnRef} />
          </div>
        ) : (
          <div className="text-center text-[11px] text-slate-400 font-medium">
            (Cấu hình NEXT_PUBLIC_GOOGLE_CLIENT_ID để bật đăng nhập Google)
          </div>
        )}

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[10px] text-slate-400 font-bold uppercase">Hoặc dùng email</span>
          <div className="border-t border-slate-200 w-full" />
        </div>

        {/* Email / password form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Họ và Tên</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dev@yourcompany.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-brand-blue text-white text-xs font-bold shadow-brand-blue hover:bg-blue-600 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:hover:scale-100"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>{isRegister ? 'Tạo Tài Khoản' : 'Đăng Nhập'}</span>
            {!submitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Switch */}
        <div className="text-center">
          <button
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            className="text-xs text-slate-500 hover:text-brand-blue transition-colors font-medium"
          >
            {isRegister ? 'Đã có tài khoản? Đăng nhập ngay' : 'Chưa có tài khoản? Đăng ký tại đây'}
          </button>
        </div>
      </div>
    </div>
  );
};
