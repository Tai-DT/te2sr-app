'use client';

import React from 'react';
import {
  inlineDark,
  inlineLight,
  stackedDark,
  stackedLight,
  wordmarkDark,
  wordmarkLight,
  type Mark,
} from './marks.generated';

/**
 * TE2SR brand logo — vector dựng tay, không phụ thuộc font.
 * Nguồn duy nhất: scripts/brand/{glyphs,lockups}.js → marks.generated.ts
 * (chạy `node scripts/brand/build.js` để sinh lại cùng lúc với logo/favicon/OG).
 *
 *  variant="full"     → lockup xếp dọc: TE2SR + [App Store · TESTER · Google Play]
 *  variant="compact"  → lockup ngang cho navbar
 *  variant="wordmark" → chỉ chữ TE2SR
 */
type LogoVariant = 'full' | 'compact' | 'wordmark';

const MARKS: Record<LogoVariant, { light: Mark; dark: Mark; height: number }> = {
  full: { light: stackedLight, dark: stackedDark, height: 64 },
  compact: { light: inlineLight, dark: inlineDark, height: 26 },
  wordmark: { light: wordmarkLight, dark: wordmarkDark, height: 26 },
};

export function Logo({
  variant = 'compact',
  className = '',
  onDark = false,
  height,
  title = 'TE2SR',
}: {
  variant?: LogoVariant;
  className?: string;
  onDark?: boolean;
  /** Chiều cao hiển thị (px). Bề ngang tự co theo tỉ lệ. */
  height?: number;
  title?: string;
}) {
  // Mỗi lần dựng dùng một hậu tố id riêng để nhiều logo trên cùng trang
  // không giẫm lên gradient/mask của nhau.
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const { light, dark, height: defaultHeight } = MARKS[variant];
  const mark = onDark ? dark : light;
  const h = height ?? defaultHeight;

  return (
    <svg
      className={className}
      viewBox={`0 0 ${mark.w} ${mark.h}`}
      height={h}
      width={(mark.w / mark.h) * h}
      role="img"
      aria-label={title}
      focusable="false"
      dangerouslySetInnerHTML={{ __html: mark.markup.replace(/__ID__/g, uid) }}
    />
  );
}
