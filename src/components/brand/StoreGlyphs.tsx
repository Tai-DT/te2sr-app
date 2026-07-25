'use client';

import React, { useId } from 'react';

/**
 * Official Apple App Store icon (accurate geometry + gradient).
 * Source geometry: Apple App Store iOS icon.
 */
export function AppStoreGlyph({ size = 20, className = '' }: { size?: number; className?: string }) {
  const raw = useId();
  const id = `as-${raw.replace(/:/g, '')}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 800 800"
      className={className}
      aria-hidden
      focusable={false}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#18BFFB" />
          <stop offset="1" stopColor="#2072F3" />
        </linearGradient>
      </defs>
      <rect width="800" height="800" rx="180" fill={`url(#${id})`} />
      <path
        fill="#fff"
        d="M396.6,183.8l16.2-28c10-17.5,32.3-23.4,49.8-13.4s23.4,32.3,13.4,49.8L319.9,462.4h112.9c36.6,0,57.1,43,41.2,72.8H143c-20.2,0-36.4-16.2-36.4-36.4c0-20.2,16.2-36.4,36.4-36.4h92.8l118.8-205.9l-37.1-64.4c-10-17.5-4.1-39.6,13.4-49.8c17.5-10,39.6-4.1,49.8,13.4L396.6,183.8L396.6,183.8z M256.2,572.7l-35,60.7c-10,17.5-32.3,23.4-49.8,13.4S148,614.5,158,597l26-45C213.4,542.9,237.3,549.9,256.2,572.7L256.2,572.7z M557.6,462.6h94.7c20.2,0,36.4,16.2,36.4,36.4c0,20.2-16.2,36.4-36.4,36.4h-52.6l35.5,61.6c10,17.5,4.1,39.6-13.4,49.8c-17.5,10-39.6,4.1-49.8-13.4c-59.8-103.7-104.7-181.3-134.5-233c-30.5-52.6-8.7-105.4,12.8-123.3C474.2,318.1,509.9,380,557.6,462.6L557.6,462.6z"
      />
    </svg>
  );
}

/**
 * Official Google Play "play triangle" mark (accurate 4-facet geometry + colours).
 * Native aspect ratio ~0.906 (width/height) — preserved.
 */
export function GooglePlayGlyph({ size = 20, className = '' }: { size?: number; className?: string }) {
  const width = Math.round(size * 0.906);
  return (
    <svg
      width={width}
      height={size}
      viewBox="12.5 9 32 35.3"
      className={className}
      aria-hidden
      focusable={false}
    >
      <path
        fill="#eb3131"
        d="m27.622 25.899-14.194 15.066c5.34e-4 0.0031 0.0016 0.0057 0.0021 0.0089 0.43532 1.636 1.9296 2.8406 3.703 2.8406 0.70892 0 1.3745-0.19166 1.9453-0.52812l0.04533-0.02656 15.978-9.22-7.479-8.141"
      />
      <path
        fill="#f6b60b"
        d="m41.983 23.334-0.0136-0.0093-6.8982-3.999-7.7717 6.9156 7.7987 7.7977 6.8618-3.9592c1.203-0.64945 2.0197-1.9177 2.0197-3.3802 0-1.452-0.80571-2.7139-1.9968-3.3655"
      />
      <path
        fill="#5778c5"
        d="m13.426 12.37c-0.08533 0.31466-0.13018 0.64425-0.13018 0.98651v26.623c0 0.34162 0.04432 0.67233 0.13072 0.98587l14.684-14.681-14.684-13.914"
      />
      <path
        fill="#3bad49"
        d="m27.727 26.668 7.3473-7.3451-15.96-9.2534c-0.58012-0.34746-1.2572-0.54799-1.9817-0.54799-1.7734 0-3.2697 1.2068-3.7051 2.8447-5.34e-4 0.0016-5.34e-4 0.0027-5.34e-4 0.0041l14.3 14.298"
      />
    </svg>
  );
}

/** Apple wordmark logo (monochrome apple silhouette) — for "Download on the App Store" style contexts. */
export function AppleGlyph({ size = 20, className = '', color = 'currentColor' }: { size?: number; className?: string; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill={color} aria-hidden focusable={false}>
      <path d="M17.05 12.04c-.03-2.77 2.26-4.1 2.36-4.16-1.29-1.88-3.29-2.14-4-2.17-1.7-.17-3.32.99-4.18.99-.86 0-2.19-.97-3.6-.94-1.85.03-3.56 1.08-4.51 2.73-1.92 3.34-.49 8.28 1.38 10.99.91 1.33 2 2.82 3.42 2.76 1.37-.05 1.89-.89 3.55-.89 1.65 0 2.12.89 3.57.86 1.47-.03 2.41-1.35 3.31-2.68 1.04-1.53 1.47-3.01 1.5-3.09-.03-.02-2.88-1.11-2.91-4.4zM14.28 4.52c.76-.92 1.27-2.19 1.13-3.46-1.09.04-2.42.73-3.2 1.64-.7.81-1.31 2.11-1.15 3.35 1.22.09 2.46-.62 3.22-1.53z" />
    </svg>
  );
}
