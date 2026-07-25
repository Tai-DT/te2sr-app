'use client';

import React from 'react';
import { AppStoreGlyph, GooglePlayGlyph } from './StoreGlyphs';

/**
 * TE2SR brand logo — crisp vector recreation of the original mark.
 * "TE2SR" gradient wordmark + [App Store · TESTER · Google Play] store row.
 *
 *  variant="full"    → stacked lockup (footer / hero)
 *  variant="compact" → single-line lockup (navbar)
 *  variant="wordmark"→ wordmark only
 */
type LogoVariant = 'full' | 'compact' | 'wordmark';

function Wordmark({ size, onDark = false }: { size: number; onDark?: boolean }) {
  const gradient = onDark
    ? 'linear-gradient(95deg,#7FB0FF 0%,#4D8BFF 34%,#63A0FF 52%,#A88CFF 78%,#D7DEFF 100%)'
    : 'linear-gradient(95deg,#0A2A6B 0%,#1E6BEB 34%,#2E8BFF 52%,#6D3BF5 78%,#141C46 100%)';
  return (
    <span
      style={{
        fontFamily: 'var(--font-montserrat), Inter, system-ui, sans-serif',
        fontWeight: 900,
        fontStyle: 'italic',
        letterSpacing: '-0.015em',
        lineHeight: 0.9,
        fontSize: size,
        backgroundImage: gradient,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        whiteSpace: 'nowrap',
        display: 'inline-block',
      }}
    >
      TE2SR
    </span>
  );
}

export function Logo({
  variant = 'compact',
  className = '',
  onDark = false,
  wordmarkSize,
}: {
  variant?: LogoVariant;
  className?: string;
  onDark?: boolean;
  wordmarkSize?: number;
}) {
  if (variant === 'wordmark') {
    return (
      <span className={className}>
        <Wordmark size={wordmarkSize ?? 26} onDark={onDark} />
      </span>
    );
  }

  if (variant === 'full') {
    return (
      <span className={`inline-flex flex-col items-center gap-2.5 ${className}`}>
        <Wordmark size={wordmarkSize ?? 46} onDark={onDark} />
        <span className="flex items-center gap-2.5">
          <AppStoreGlyph size={22} />
          <span className={`h-px w-6 ${onDark ? 'bg-slate-600' : 'bg-slate-300'}`} />
          <span
            className={`text-[13px] font-extrabold tracking-[0.32em] pl-[0.32em] ${onDark ? 'text-slate-200' : 'text-slate-700'}`}
            style={{ fontFamily: 'var(--font-montserrat), Inter, sans-serif' }}
          >
            TESTER
          </span>
          <span className={`h-px w-6 ${onDark ? 'bg-slate-600' : 'bg-slate-300'}`} />
          <GooglePlayGlyph size={22} />
        </span>
      </span>
    );
  }

  // compact
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Wordmark size={wordmarkSize ?? 25} onDark={onDark} />
      <AppStoreGlyph size={17} />
      <GooglePlayGlyph size={17} />
    </span>
  );
}
