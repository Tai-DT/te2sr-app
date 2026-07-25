'use client';

import React, { useState } from 'react';
import { MessageCircle, X, ExternalLink } from 'lucide-react';

export const FloatingSocialChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const socialLinks = {
    zalo: process.env.NEXT_PUBLIC_ZALO_URL || 'https://zalo.me/0386830040',
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_URL || 'https://wa.me/84386830040',
    messenger: process.env.NEXT_PUBLIC_MESSENGER_URL || 'https://www.facebook.com/profile.php?id=61592140385376',
    x: process.env.NEXT_PUBLIC_X_URL || 'https://x.com/_te2sr',
  };

  const channels = [
    { href: socialLinks.zalo, label: 'Chat qua Zalo (Việt Nam)', badge: 'Z', color: 'bg-blue-500' },
    { href: socialLinks.whatsapp, label: 'WhatsApp (Global)', badge: 'WA', color: 'bg-emerald-500' },
    { href: socialLinks.x, label: 'X (Twitter) @_te2sr', badge: '𝕏', color: 'bg-slate-900' },
    { href: socialLinks.messenger, label: 'Facebook Messenger', badge: 'M', color: 'bg-indigo-500' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded panel */}
      {isOpen && (
        <div className="mb-3 w-72 bg-white border border-slate-200 rounded-2xl p-4 shadow-apple-lg space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-brand-blue" />
              <span>Hỗ trợ nhanh 24/7</span>
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Chọn kênh liên hệ trực tiếp với chuyên viên TE2SR:
          </p>

          <div className="space-y-2">
            {channels.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-sm font-medium text-slate-700 transition-colors group"
              >
                <span className="flex items-center gap-2.5">
                  <span className={`w-6 h-6 rounded-lg ${c.color} text-white flex items-center justify-center font-bold text-[10px]`}>
                    {c.badge}
                  </span>
                  <span>{c.label}</span>
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-brand-blue hover:bg-brand-blueHover text-white shadow-brand-blue hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
        title="Trò chuyện hỗ trợ"
        aria-label="Mở hỗ trợ nhanh"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
};
