'use client';

import { useState, useEffect, useCallback } from 'react';
import { LanguageCode } from './i18n/dictionaries';

const STORAGE_KEY = 'te2sr_lang';
const VALID: LanguageCode[] = ['vi', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'zh'];

/**
 * Language state that persists across page navigations (localStorage).
 * Initial render is 'vi' (matches SSR); the saved choice is applied after mount
 * to avoid hydration mismatches.
 */
export function useLanguage(): [LanguageCode, (lang: LanguageCode) => void] {
  const [lang, setLang] = useState<LanguageCode>('vi');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
      if (saved && VALID.includes(saved)) setLang(saved);
    } catch {
      /* ignore */
    }
  }, []);

  const change = useCallback((next: LanguageCode) => {
    setLang(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  return [lang, change];
}
