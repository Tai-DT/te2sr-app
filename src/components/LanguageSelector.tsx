'use client';

import React, { useState, useRef, useEffect } from 'react';
import { LANGUAGES } from '@/lib/i18n/dictionaries';
import { useLanguage } from '@/lib/i18n/language-context';
import { Globe, ChevronDown, Check } from 'lucide-react';

export const LanguageSelector: React.FC = () => {
  const { lang: currentLang, setLang: onLanguageChange } = useLanguage();
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
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:border-brand-blue/50 hover:bg-white transition-all text-xs md:text-sm font-bold text-slate-700 shadow-apple-sm"
        title="Select Language"
      >
        <Globe className="w-4 h-4 text-brand-blue" />
        <span className="text-base">{selected.flag}</span>
        <span className="hidden sm:inline">{selected.nativeName}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-blue' : 'text-slate-400'}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 py-2 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-xl shadow-apple-lg z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-1.5 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase border-b border-slate-100 mb-1">
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
                      ? 'bg-brand-blue/10 text-brand-blue font-extrabold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-brand-blue" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
