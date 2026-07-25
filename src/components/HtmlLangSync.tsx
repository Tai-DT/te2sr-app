'use client';

import { useEffect } from 'react';
import type { LanguageCode } from '@/lib/i18n/dictionaries';

const LOCALE: Record<LanguageCode, string> = {
  vi: 'vi',
  en: 'en',
  ja: 'ja',
  ko: 'ko',
  fr: 'fr',
  de: 'de',
  es: 'es',
  zh: 'zh-Hans',
};

/**
 * Giữ <html lang> khớp với ngôn ngữ người dùng đang chọn.
 * Quan trọng cho screen reader (phát âm đúng) và cho công cụ tìm kiếm.
 */
export function HtmlLangSync({ lang }: { lang: LanguageCode }) {
  useEffect(() => {
    document.documentElement.lang = LOCALE[lang] || 'vi';
  }, [lang]);
  return null;
}
