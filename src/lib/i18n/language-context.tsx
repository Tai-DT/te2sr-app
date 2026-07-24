'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { LanguageCode, LANGUAGES, getTranslation } from './dictionaries';

const STORAGE_KEY = 'te2sr_lang';
const SUPPORTED = LANGUAGES.map((l) => l.code);

/** Detect the visitor's preferred language from the browser. */
function detectBrowserLang(): LanguageCode {
  if (typeof navigator === 'undefined') return 'vi';
  const candidates = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
  for (const raw of candidates) {
    if (!raw) continue;
    const code = raw.toLowerCase().split('-')[0] as LanguageCode;
    if (SUPPORTED.includes(code)) return code;
  }
  return 'vi';
}

interface LanguageContextType {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  t: (key: string) => string;
  /** True once we've resolved the saved/detected language on the client. */
  ready: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Deterministic initial value for SSR/static export; refined on the client.
  const [lang, setLangState] = useState<LanguageCode>('vi');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let resolved: LanguageCode | null = null;
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
      if (saved && SUPPORTED.includes(saved)) resolved = saved;
    } catch { /* ignore */ }
    if (!resolved) resolved = detectBrowserLang(); // 🌍 auto-detect customer language
    setLangState(resolved);
    if (typeof document !== 'undefined') document.documentElement.lang = resolved;
    setReady(true);
  }, []);

  const setLang = useCallback((next: LanguageCode) => {
    setLangState(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* ignore */ }
    if (typeof document !== 'undefined') document.documentElement.lang = next;
  }, []);

  const t = useCallback((key: string) => getTranslation(lang, key), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, ready }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
};
