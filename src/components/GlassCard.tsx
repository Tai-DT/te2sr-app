'use client';

import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'blue' | 'magenta' | 'none';
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glow = 'none',
  onClick,
}) => {
  let glowClasses = 'hover:border-slate-300 hover:shadow-apple-md';
  if (glow === 'blue') {
    glowClasses = 'hover:border-brand-blue/50 hover:shadow-brand-blue';
  }

  return (
    <div
      onClick={onClick}
      className={`bg-white border border-slate-200/90 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 shadow-apple-sm ${glowClasses} ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      } ${className}`}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
};
