'use client';

import React, { useState, useRef, useEffect } from 'react';
import { LANGUAGES, LanguageCode } from '@/lib/i18n/dictionaries';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageSelectorProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLang,
  onLanguageChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-low/80 border border-white/10 hover:border-neon-blue/50 hover:bg-surface-card transition-all text-xs md:text-sm font-medium text-slate-200"
        title="Select Language"
      >
        <Globe className="w-4 h-4 text-neon-blue animate-pulse" />
        <span className="text-base">{selected.flag}</span>
        <span className="hidden sm:inline">{selected.nativeName}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-neon-blue' : 'text-slate-400'}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 py-2 bg-surface-base/95 backdrop-blur-xl border border-neon-blue/30 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-1.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase border-b border-white/5 mb-1">
            Global Languages (8)
          </div>
          <div className="max-h-64 overflow-y-auto">
            {LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLang;
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                    isSelected
                      ? 'bg-neon-blue/15 text-neon-blue font-semibold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-neon-blue" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
