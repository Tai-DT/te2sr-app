'use client';

import React, { useState } from 'react';
import { MessageCircle, X, ExternalLink } from 'lucide-react';
import { SOCIAL_LINKS as socialLinks } from '@/lib/social';

export const FloatingSocialChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const channels = [
    { key: 'zalo', href: socialLinks.zalo, label: 'Chat qua Zalo (Việt Nam)', badge: 'Z', badgeClass: 'bg-blue-500', wrap: 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700' },
    { key: 'whatsapp', href: socialLinks.whatsapp, label: 'WhatsApp (Global)', badge: 'WA', badgeClass: 'bg-emerald-500', wrap: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700' },
    { key: 'x', href: socialLinks.x, label: 'X (Twitter) @_te2sr', badge: '𝕏', badgeClass: 'bg-slate-900', wrap: 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800' },
    { key: 'messenger', href: socialLinks.messenger, label: 'FB Messenger', badge: 'FB', badgeClass: 'bg-violet-500', wrap: 'bg-violet-50 hover:bg-violet-100 border-violet-200 text-violet-700' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-3 w-64 bg-white border border-slate-200 rounded-2xl p-4 shadow-apple-lg space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-brand-blue" />
              <span>Hỗ Trợ Nhanh 24/7</span>
            </span>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100">
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
            Chọn kênh liên hệ hỗ trợ trực tiếp từ chuyên viên TE2SR:
          </p>

          <div className="space-y-2 pt-1">
            {channels.map((ch) => (
              <a
                key={ch.key}
                href={ch.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all group ${ch.wrap}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-lg text-white flex items-center justify-center font-bold text-[10px] ${ch.badgeClass}`}>{ch.badge}</span>
                  <span>{ch.label}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-brand-blue text-white shadow-brand-blue hover:bg-blue-600 hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
        title="Trò chuyện hỗ trợ"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
};
