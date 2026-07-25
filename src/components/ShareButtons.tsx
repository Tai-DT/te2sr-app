'use client';

import React, { useState } from 'react';
import { Link2, Check, Share2 } from 'lucide-react';

interface ShareButtonsProps {
  /** Đường dẫn tuyệt đối của trang cần chia sẻ. */
  url: string;
  /** Tiêu đề kèm theo khi chia sẻ. */
  title: string;
  className?: string;
}

const CHANNELS = [
  {
    id: 'facebook',
    label: 'Facebook',
    color: '#1877F2',
    href: (u: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`,
    icon: (
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
    ),
  },
  {
    id: 'x',
    label: 'X',
    color: '#000000',
    href: (u: string, t: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`,
    icon: (
      <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.46l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41z" />
    ),
  },
  {
    id: 'telegram',
    label: 'Telegram',
    color: '#26A5E4',
    href: (u: string, t: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`,
    icon: (
      <path d="M11.94 24c6.6 0 11.95-5.37 11.95-12S18.54 0 11.94 0 0 5.37 0 12s5.35 12 11.94 12zm5.5-17.5-1.98 9.36c-.15.67-.55.83-1.1.52l-3.06-2.27-1.48 1.43c-.16.16-.3.3-.62.3l.22-3.14 5.72-5.18c.25-.22-.05-.34-.39-.13l-7.07 4.46-3.04-.95c-.66-.21-.67-.66.14-.98l11.9-4.6c.55-.2 1.03.13.86.98z" />
    ),
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    color: '#25D366',
    href: (u: string, t: string) => `https://wa.me/?text=${encodeURIComponent(`${t} ${u}`)}`,
    icon: (
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.48s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35zM12.04 21.8h-.01a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.72.97 1-3.62-.24-.37a9.79 9.79 0 0 1-1.5-5.23c0-5.4 4.4-9.8 9.83-9.8 2.62 0 5.09 1.03 6.94 2.88a9.76 9.76 0 0 1 2.88 6.94c0 5.4-4.41 9.81-9.82 9.81zM20.5 3.49A11.75 11.75 0 0 0 12.04 0C5.53 0 .23 5.3.23 11.81c0 2.08.55 4.11 1.58 5.9L.13 24l6.44-1.69a11.76 11.76 0 0 0 5.47 1.36h.01c6.5 0 11.8-5.3 11.8-11.81a11.74 11.74 0 0 0-3.35-8.37z" />
    ),
  },
];

export const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title, className = '' }) => {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const nativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* user cancelled */
      }
    } else {
      copyLink();
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-xs font-medium text-slate-500 mr-1">Chia sẻ gói này:</span>

      {CHANNELS.map((c) => (
        <a
          key={c.id}
          href={c.href(url, title)}
          target="_blank"
          rel="noopener noreferrer"
          title={`Chia sẻ qua ${c.label}`}
          aria-label={`Chia sẻ qua ${c.label}`}
          className="w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 flex items-center justify-center transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill={c.color} aria-hidden focusable={false}>
            {c.icon}
          </svg>
        </a>
      ))}

      <button
        type="button"
        onClick={copyLink}
        className="h-9 px-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-xs font-medium text-slate-700 inline-flex items-center gap-1.5 transition-colors"
        aria-label="Sao chép liên kết"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden />
        ) : (
          <Link2 className="w-3.5 h-3.5" aria-hidden />
        )}
        <span>{copied ? 'Đã sao chép' : 'Sao chép link'}</span>
      </button>

      <button
        type="button"
        onClick={nativeShare}
        className="sm:hidden h-9 px-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 inline-flex items-center gap-1.5 transition-colors"
        aria-label="Chia sẻ"
      >
        <Share2 className="w-3.5 h-3.5" aria-hidden />
        <span>Chia sẻ</span>
      </button>
    </div>
  );
};
