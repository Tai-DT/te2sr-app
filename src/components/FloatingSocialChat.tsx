'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Send, ExternalLink } from 'lucide-react';

export const FloatingSocialChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Default editable links
  const socialLinks = {
    zalo: process.env.NEXT_PUBLIC_ZALO_URL || 'https://zalo.me/0386830040',
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_URL || 'https://wa.me/84386830040',
    messenger: process.env.NEXT_PUBLIC_MESSENGER_URL || 'https://www.facebook.com/profile.php?id=61592140385376',
    x: process.env.NEXT_PUBLIC_X_URL || 'https://x.com/_te2sr',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Quick Social Menu */}
      {isOpen && (
        <div className="mb-3 w-64 bg-surface-base/95 backdrop-blur-2xl border border-neon-blue/40 rounded-2xl p-4 shadow-2xl space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-neon-blue" />
              <span>Hỗ Trợ Nhanh 24/7</span>
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-surface-low"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed">
            Chọn kênh liên hệ hỗ trợ trực tiếp từ chuyên viên TE2SR:
          </p>

          <div className="space-y-2 pt-1">
            {/* Zalo Vietnam */}
            <a
              href={socialLinks.zalo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-400 text-xs font-semibold transition-all group"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold text-[10px]">
                  Z
                </span>
                <span>Chat qua Zalo (Việt Nam)</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* WhatsApp Global */}
            <a
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 text-xs font-semibold transition-all group"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px]">
                  WA
                </span>
                <span>WhatsApp (Global)</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* X (Twitter) */}
            <a
              href={socialLinks.x}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 border border-slate-500/40 text-slate-200 text-xs font-semibold transition-all group"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-slate-900 text-white border border-white/20 flex items-center justify-center font-bold text-[10px]">
                  𝕏
                </span>
                <span>X (Twitter) @_te2sr</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* Facebook Messenger */}
            <a
              href={socialLinks.messenger}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-400 text-xs font-semibold transition-all group"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-purple-500 text-white flex items-center justify-center font-bold text-[10px]">
                  FB
                </span>
                <span>FB Messenger</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      )}

      {/* Floating Toggle Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-13 h-13 p-3.5 rounded-full bg-neon-gradient text-white shadow-neon-blue hover:shadow-neon-pink hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
        title="Trò chuyện hỗ trợ"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6 animate-pulse" />
        )}
      </button>
    </div>
  );
};
