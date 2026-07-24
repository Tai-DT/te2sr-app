'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { api, ApiError } from '@/lib/api-client';
import { KeyRound, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export const ChangePasswordCard: React.FC = () => {
  const { user } = useAuth();
  const hasPassword = user?.authProvider === 'password';

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (newPassword.length < 6) { setMessage({ type: 'err', text: 'Mật khẩu mới tối thiểu 6 ký tự.' }); return; }
    if (newPassword !== confirm) { setMessage({ type: 'err', text: 'Xác nhận mật khẩu không khớp.' }); return; }
    setSubmitting(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      setMessage({ type: 'ok', text: hasPassword ? 'Đã đổi mật khẩu thành công.' : 'Đã đặt mật khẩu — giờ bạn có thể đăng nhập bằng email.' });
      setCurrentPassword(''); setNewPassword(''); setConfirm('');
    } catch (err) {
      setMessage({ type: 'err', text: err instanceof ApiError ? err.message : 'Đổi mật khẩu thất bại.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-300 shadow-apple-sm p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
          <KeyRound className="w-4 h-4 text-brand-blue" />
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-slate-900">{hasPassword ? 'Đổi Mật Khẩu' : 'Đặt Mật Khẩu Đăng Nhập'}</h3>
          <p className="text-[11px] text-slate-600 font-semibold">
            {hasPassword ? 'Cập nhật mật khẩu tài khoản của bạn.' : 'Tài khoản Google — đặt thêm mật khẩu để đăng nhập bằng email.'}
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-3">
        {hasPassword && (
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Mật khẩu hiện tại"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-500 focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
          />
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Mật khẩu mới (≥ 6 ký tự)"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-500 focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
          />
          <input
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Xác nhận mật khẩu mới"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-500 focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
          />
        </div>

        {message && (
          <div className={`flex items-start gap-2 p-2.5 rounded-xl text-[11px] font-semibold border ${
            message.type === 'ok' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {message.type === 'ok' ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
            <span>{message.text}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white text-xs font-extrabold shadow-apple-sm transition-all flex items-center gap-2 disabled:opacity-60"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
          <span>{hasPassword ? 'Đổi Mật Khẩu' : 'Đặt Mật Khẩu'}</span>
        </button>
      </form>
    </div>
  );
};
