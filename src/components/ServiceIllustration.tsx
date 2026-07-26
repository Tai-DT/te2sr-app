'use client';

import React from 'react';

export type IllustrationType = 'Testing' | 'Publishing' | 'Promotion' | 'Analyzer' | 'Enterprise' | 'WebTesting' | 'WebDesign' | 'AppDevelopment' | 'AppSEO' | 'WebSEO' | 'PageManagement';

/**
 * Lightweight inline-SVG illustrations for service cards & pricing tiers.
 * Brand-colored, theme-consistent, no external assets.
 */
export const ServiceIllustration: React.FC<{ type: IllustrationType; className?: string }> = ({ type, className = '' }) => {
  const common = { viewBox: '0 0 320 160', className: `w-full h-auto ${className}`, xmlns: 'http://www.w3.org/2000/svg' } as const;

  if (type === 'Testing') {
    return (
      <svg {...common} role="img" aria-label="App testing illustration">
        <defs>
          <linearGradient id="tg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#EAF3FF" /><stop offset="1" stopColor="#D6E9FF" />
          </linearGradient>
        </defs>
        <rect width="320" height="160" rx="16" fill="url(#tg)" />
        <rect x="118" y="26" width="84" height="112" rx="14" fill="#fff" stroke="#0071E3" strokeWidth="2" />
        <rect x="130" y="42" width="60" height="8" rx="4" fill="#CFE3FF" />
        <rect x="130" y="58" width="44" height="8" rx="4" fill="#E5EEFB" />
        <circle cx="160" cy="98" r="20" fill="#0071E3" />
        <path d="M151 98l6 6 12-13" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="66" cy="60" r="16" fill="#fff" stroke="#10B981" strokeWidth="2" />
        <path d="M59 60l4.5 4.5 9-9.5" stroke="#10B981" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="256" cy="104" r="16" fill="#fff" stroke="#F59E0B" strokeWidth="2" />
        <path d="M256 97v9M256 110.5v.5" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'Publishing') {
    return (
      <svg {...common} role="img" aria-label="Store publishing illustration">
        <defs>
          <linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#EAF3FF" /><stop offset="1" stopColor="#DCE9FF" />
          </linearGradient>
        </defs>
        <rect width="320" height="160" rx="16" fill="url(#pg)" />
        <path d="M160 30c14 12 22 30 22 52 0 14-8 24-22 30-14-6-22-16-22-30 0-22 8-40 22-52z" fill="#0071E3" />
        <circle cx="160" cy="78" r="9" fill="#fff" />
        <path d="M143 118l-10 16 20-6M177 118l10 16-20-6" fill="#2997FF" />
        <g stroke="#0071E3" strokeWidth="2" opacity="0.5">
          <path d="M96 44l6-6M224 44l-6-6M104 96l-8 2M216 96l8 2" strokeLinecap="round" />
        </g>
        <rect x="44" y="120" width="52" height="24" rx="6" fill="#fff" stroke="#0071E3" strokeWidth="1.5" />
        <text x="70" y="136" fontSize="11" fontWeight="800" fill="#0071E3" textAnchor="middle">iOS</text>
        <rect x="224" y="120" width="52" height="24" rx="6" fill="#fff" stroke="#10B981" strokeWidth="1.5" />
        <text x="250" y="136" fontSize="10" fontWeight="800" fill="#0E9F6E" textAnchor="middle">Play</text>
      </svg>
    );
  }

  if (type === 'Promotion') {
    return (
      <svg {...common} role="img" aria-label="5-star promotion illustration">
        <defs>
          <linearGradient id="prg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFF7E6" /><stop offset="1" stopColor="#FFEFC7" />
          </linearGradient>
        </defs>
        <rect width="320" height="160" rx="16" fill="url(#prg)" />
        {[70, 112, 154, 196, 238].map((x, i) => (
          <path key={x} transform={`translate(${x},${i === 2 ? 44 : 58}) scale(${i === 2 ? 1.15 : 0.9})`}
            d="M14 0l4.3 8.7 9.7 1.4-7 6.8 1.7 9.6L14 22l-8.6 4.5L7 16.9 0 10.1l9.7-1.4z" fill="#F59E0B" />
        ))}
        <rect x="70" y="104" width="180" height="10" rx="5" fill="#F59E0B" opacity="0.25" />
        <rect x="70" y="104" width="150" height="10" rx="5" fill="#F59E0B" />
        <path d="M64 128l30-14 26 10 30-20 26 12 30-16" stroke="#0071E3" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === 'Enterprise') {
    return (
      <svg {...common} role="img" aria-label="Enterprise illustration">
        <defs>
          <linearGradient id="eg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F1F5F9" /><stop offset="1" stopColor="#E2E8F0" />
          </linearGradient>
        </defs>
        <rect width="320" height="160" rx="16" fill="url(#eg)" />
        <rect x="96" y="46" width="128" height="88" rx="10" fill="#fff" stroke="#1D1D1F" strokeWidth="2" />
        {[112, 140, 168, 196].map((x) => [66, 90].map((y) => <rect key={`${x}-${y}`} x={x} y={y} width="14" height="14" rx="3" fill="#CBD5E1" />))}
        <rect x="148" y="118" width="24" height="16" rx="3" fill="#0071E3" />
        <circle cx="160" cy="32" r="10" fill="#0071E3" />
        <path d="M156 32l3 3 6-6" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === 'WebDesign') {
    return (
      <svg {...common} role="img" aria-label="Website design illustration">
        <defs>
          <linearGradient id="wd" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#E8FBF4" /><stop offset="1" stopColor="#D2F2E6" />
          </linearGradient>
        </defs>
        <rect width="320" height="160" rx="16" fill="url(#wd)" />
        {/* cửa sổ trình duyệt */}
        <rect x="62" y="26" width="196" height="108" rx="12" fill="#fff" stroke="#10B981" strokeWidth="2" />
        <path d="M62 44h196" stroke="#10B981" strokeWidth="2" />
        <circle cx="76" cy="35" r="3.5" fill="#EF4444" />
        <circle cx="88" cy="35" r="3.5" fill="#F59E0B" />
        <circle cx="100" cy="35" r="3.5" fill="#10B981" />
        {/* bố cục trang */}
        <rect x="74" y="56" width="60" height="42" rx="6" fill="#10B981" opacity="0.18" />
        <rect x="142" y="56" width="104" height="9" rx="4.5" fill="#D6F5E8" />
        <rect x="142" y="71" width="80" height="9" rx="4.5" fill="#E4F7EF" />
        <rect x="142" y="88" width="46" height="12" rx="6" fill="#10B981" />
        <rect x="74" y="108" width="172" height="8" rx="4" fill="#EAF8F2" />
        {/* con trỏ */}
        <path d="M214 104l22 9-9 3.5-3.5 9z" fill="#0F172A" />
      </svg>
    );
  }

  if (type === 'WebTesting') {
    return (
      <svg {...common} role="img" aria-label="Website testing illustration">
        <defs>
          <linearGradient id="wt" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFF4E6" /><stop offset="1" stopColor="#FFE7C7" />
          </linearGradient>
        </defs>
        <rect width="320" height="160" rx="16" fill="url(#wt)" />
        {/* cửa sổ trình duyệt đang được soi */}
        <rect x="46" y="24" width="168" height="112" rx="12" fill="#fff" stroke="#EA580C" strokeWidth="2" />
        <path d="M46 42h168" stroke="#EA580C" strokeWidth="2" />
        <circle cx="60" cy="33" r="3.5" fill="#EF4444" />
        <circle cx="72" cy="33" r="3.5" fill="#F59E0B" />
        <circle cx="84" cy="33" r="3.5" fill="#22C55E" />
        {/* danh sách kiểm: 2 mục đạt, 1 mục lỗi */}
        <circle cx="66" cy="60" r="7" fill="#22C55E" />
        <path d="M62.5 60l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="80" y="56" width="112" height="8" rx="4" fill="#FFE7C7" />
        <circle cx="66" cy="84" r="7" fill="#22C55E" />
        <path d="M62.5 84l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="80" y="80" width="88" height="8" rx="4" fill="#FFE7C7" />
        <circle cx="66" cy="108" r="7" fill="#EF4444" />
        <path d="M63.5 105.5l5 5M68.5 105.5l-5 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        <rect x="80" y="104" width="70" height="8" rx="4" fill="#FEE2E2" />
        {/* kính lúp soi lỗi */}
        <circle cx="238" cy="74" r="30" fill="#fff" stroke="#EA580C" strokeWidth="4" />
        <path d="M259 96l16 16" stroke="#EA580C" strokeWidth="6" strokeLinecap="round" />
        {/* dấu lỗi trong kính lúp */}
        <path d="M238 60v18" stroke="#EF4444" strokeWidth="5" strokeLinecap="round" />
        <circle cx="238" cy="88" r="3" fill="#EF4444" />
      </svg>
    );
  }

  if (type === 'AppDevelopment') {
    return (
      <svg {...common} role="img" aria-label="Mobile app development illustration">
        <defs>
          <linearGradient id="ad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#EEF2FF" /><stop offset="1" stopColor="#DCE3FF" />
          </linearGradient>
        </defs>
        <rect width="320" height="160" rx="16" fill="url(#ad)" />
        {/* điện thoại */}
        <rect x="126" y="22" width="68" height="116" rx="14" fill="#fff" stroke="#4F46E5" strokeWidth="2" />
        <rect x="150" y="29" width="20" height="4" rx="2" fill="#C7D2FE" />
        <rect x="136" y="44" width="48" height="26" rx="6" fill="#4F46E5" opacity="0.14" />
        <rect x="136" y="76" width="30" height="7" rx="3.5" fill="#DCE3FF" />
        <rect x="136" y="88" width="48" height="7" rx="3.5" fill="#E8ECFF" />
        <rect x="136" y="104" width="48" height="16" rx="8" fill="#4F46E5" />
        {/* dấu ngoặc code hai bên */}
        <path d="M96 58l-18 22 18 22" stroke="#4F46E5" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M224 58l18 22-18 22" stroke="#4F46E5" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === 'AppSEO') {
    return (
      <svg {...common} role="img" aria-label="App Store optimization illustration">
        <defs>
          <linearGradient id="asx" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFF4E6" /><stop offset="1" stopColor="#FFE6C7" />
          </linearGradient>
        </defs>
        <rect width="320" height="160" rx="16" fill="url(#asx)" />
        {/* bảng xếp hạng: 3 hàng, hàng đầu nổi bật */}
        <rect x="52" y="34" width="150" height="26" rx="8" fill="#F59E0B" />
        <text x="64" y="52" fontFamily="Arial" fontSize="14" fontWeight="bold" fill="#fff">1</text>
        <rect x="80" y="41" width="80" height="12" rx="6" fill="#fff" opacity="0.85" />
        <rect x="52" y="68" width="150" height="24" rx="8" fill="#fff" stroke="#F59E0B" strokeWidth="1.5" />
        <text x="64" y="85" fontFamily="Arial" fontSize="13" fontWeight="bold" fill="#B45309">2</text>
        <rect x="80" y="74" width="62" height="11" rx="5.5" fill="#FFE6C7" />
        <rect x="52" y="100" width="150" height="24" rx="8" fill="#fff" stroke="#FCD9A6" strokeWidth="1.5" />
        <text x="64" y="117" fontFamily="Arial" fontSize="13" fontWeight="bold" fill="#C08A3E">3</text>
        <rect x="80" y="106" width="48" height="11" rx="5.5" fill="#FFF0DC" />
        {/* mũi tên tăng hạng */}
        <path d="M232 112l0-46" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
        <path d="M218 80l14-16 14 16" stroke="#F59E0B" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="232" cy="126" r="5" fill="#F59E0B" />
      </svg>
    );
  }

  if (type === 'WebSEO') {
    return (
      <svg {...common} role="img" aria-label="Website SEO illustration">
        <defs>
          <linearGradient id="wsx" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#E9F7FF" /><stop offset="1" stopColor="#D2ECFB" />
          </linearGradient>
        </defs>
        <rect width="320" height="160" rx="16" fill="url(#wsx)" />
        {/* thanh tìm kiếm */}
        <rect x="60" y="28" width="200" height="28" rx="14" fill="#fff" stroke="#0284C7" strokeWidth="2" />
        <circle cx="80" cy="42" r="7" fill="none" stroke="#0284C7" strokeWidth="2.5" />
        <line x1="85" y1="47" x2="91" y2="53" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="100" y="37" width="96" height="10" rx="5" fill="#D2ECFB" />
        {/* kết quả tìm kiếm, kết quả đầu được làm nổi */}
        <rect x="60" y="68" width="200" height="30" rx="8" fill="#fff" stroke="#0284C7" strokeWidth="2" />
        <rect x="72" y="76" width="92" height="8" rx="4" fill="#0284C7" />
        <rect x="72" y="88" width="140" height="6" rx="3" fill="#DCEEFA" />
        <rect x="60" y="106" width="200" height="14" rx="6" fill="#fff" opacity="0.7" />
        <rect x="60" y="126" width="160" height="14" rx="6" fill="#fff" opacity="0.5" />
        {/* huy hiệu #1 */}
        <circle cx="256" cy="83" r="17" fill="#0284C7" />
        <text x="256" y="89" textAnchor="middle" fontFamily="Arial" fontSize="15" fontWeight="bold" fill="#fff">#1</text>
      </svg>
    );
  }

  if (type === 'PageManagement') {
    return (
      <svg {...common} role="img" aria-label="Social page management illustration">
        <defs>
          <linearGradient id="pmx" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F3EEFF" /><stop offset="1" stopColor="#E4DAFF" />
          </linearGradient>
        </defs>
        <rect width="320" height="160" rx="16" fill="url(#pmx)" />
        {/* khung bài đăng */}
        <rect x="70" y="26" width="180" height="108" rx="12" fill="#fff" stroke="#7C3AED" strokeWidth="2" />
        <circle cx="92" cy="48" r="11" fill="#7C3AED" opacity="0.25" />
        <rect x="110" y="42" width="66" height="8" rx="4" fill="#E4DAFF" />
        <rect x="110" y="54" width="42" height="6" rx="3" fill="#EFE9FC" />
        <rect x="86" y="70" width="148" height="34" rx="8" fill="#7C3AED" opacity="0.12" />
        {/* tương tác: tim, bình luận, chia sẻ */}
        <path d="M96 120c-6-5-11-8-11-13a6 6 0 0 1 11-3 6 6 0 0 1 11 3c0 5-5 8-11 13z" fill="#EC4899" />
        <path d="M132 108h26a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5h-14l-7 6v-6h-5a5 5 0 0 1-5-5v-8a5 5 0 0 1 5-5z" fill="#7C3AED" opacity="0.55" />
        <path d="M196 110l18 8-18 8v-5h-12v-6h12z" fill="#7C3AED" opacity="0.55" />
      </svg>
    );
  }

  // Analyzer
  return (
    <svg {...common} role="img" aria-label="AI design analyzer illustration">
      <defs>
        <linearGradient id="ag" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F5F0FF" /><stop offset="1" stopColor="#E9DEFF" />
        </linearGradient>
      </defs>
      <rect width="320" height="160" rx="16" fill="url(#ag)" />
      <rect x="92" y="30" width="136" height="100" rx="12" fill="#fff" stroke="#7C3AED" strokeWidth="2" />
      <rect x="106" y="44" width="108" height="10" rx="5" fill="#E9DEFF" />
      <rect x="106" y="62" width="70" height="10" rx="5" fill="#EDE7FA" />
      <rect x="106" y="86" width="48" height="30" rx="6" fill="#7C3AED" opacity="0.15" />
      <rect x="162" y="86" width="52" height="30" rx="6" fill="#7C3AED" opacity="0.25" />
      <circle cx="214" cy="118" r="24" fill="#fff" stroke="#7C3AED" strokeWidth="3" />
      <line x1="231" y1="135" x2="246" y2="150" stroke="#7C3AED" strokeWidth="5" strokeLinecap="round" />
      <path d="M206 118l5 5 11-12" stroke="#7C3AED" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
