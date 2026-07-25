'use client';

import React from 'react';
import Link from 'next/link';
import { getTranslation, LanguageCode, LANGUAGES } from '@/lib/i18n/dictionaries';
import { ShieldCheck, Globe, Star, TestTube, Rocket, Building2, BookOpen } from 'lucide-react';
import { PACKAGES } from '@/lib/packages';
import { AppStoreGlyph, GooglePlayGlyph } from './brand/StoreGlyphs';
import { Logo } from './brand/Logo';
import { FloatingSocialChat } from './FloatingSocialChat';

interface FooterProps {
  currentLang: LanguageCode;
}

export const Footer: React.FC<FooterProps> = ({ currentLang }) => {
  const t = (key: string) => getTranslation(currentLang, key);

  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200 text-slate-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Col 1 */}
        <div className="space-y-4 md:col-span-1">
          <Link href="/" className="inline-block" aria-label="TE2SR">
            <Logo variant="full" className="items-start" />
          </Link>
          <p className="text-xs text-slate-500 leading-relaxed">
            {t('footer_tagline')}
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>{t('footer_guarantee')}</span>
          </div>
        </div>

        {/* Col 2: Services */}
        <div>
          <h4 className="text-slate-900 text-xs font-semibold uppercase tracking-wider mb-4">
            {t('footer_col_services')}
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link href="/services/testing" className="hover:text-brand-blue transition-colors flex items-center gap-2">
                <TestTube className="w-3.5 h-3.5 text-brand-blue" />
                <span>{t('footer_link_testing')}</span>
              </Link>
            </li>
            <li>
              <Link href="/services/publishing" className="hover:text-brand-blue transition-colors flex items-center gap-2">
                <Rocket className="w-3.5 h-3.5 text-brand-blue" />
                <span>{t('footer_link_publishing')}</span>
              </Link>
            </li>
            <li>
              <Link href="/services/promotion" className="hover:text-brand-blue transition-colors flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-brand-blue" />
                <span>{t('footer_link_promotion')}</span>
              </Link>
            </li>
            <li>
              <Link href="/google-play-closed-testing" className="hover:text-brand-blue transition-colors flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-brand-blue" />
                <span>Hướng dẫn closed testing 12 testers</span>
              </Link>
            </li>
          </ul>

          {/* Gói dịch vụ — trang riêng, dễ chia sẻ & tốt cho SEO */}
          <h4 className="text-slate-900 text-xs font-semibold uppercase tracking-wider mt-6 mb-3">
            {t('footer_col_packages')}
          </h4>
          <ul className="space-y-2.5 text-xs">
            {PACKAGES.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/goi/${p.slug}`}
                  className="hover:text-brand-blue transition-colors flex items-center gap-2"
                >
                  {p.platform === 'Android' ? (
                    <GooglePlayGlyph size={13} />
                  ) : p.platform === 'Both' ? (
                    <AppStoreGlyph size={13} />
                  ) : (
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>
                    {p.slug === 'google-play'
                      ? 'Gói Google Play — $50'
                      : p.slug === 'ca-2-store'
                      ? 'Gói cả 2 Store — $100'
                      : 'Gói doanh nghiệp'}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Languages supported */}
        <div>
          <h4 className="text-slate-900 text-xs font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-blue" />
            <span>{t('footer_col_langs')}</span>
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {LANGUAGES.map((lang) => (
              <div key={lang.code} className="flex items-center gap-2 text-slate-600 font-medium">
                <span>{lang.flag}</span>
                <span>{lang.nativeName}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Col 4: Support */}
        <div>
          <h4 className="text-slate-900 text-xs font-semibold uppercase tracking-wider mb-4">
            {t('footer_col_support')}
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link href="/admin" className="text-brand-blue hover:underline font-medium">
                {t('footer_support_portal')}
              </Link>
            </li>
            <li>
              <span className="text-slate-500">{t('footer_support_channels')}</span>
            </li>
            <li>
              <span className="text-slate-500">{t('footer_support_payment')}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>{t('footer_copy')}</p>
        <p className="mt-2 sm:mt-0 text-[11px] text-slate-400">
          TE2SR · Testing → Store Release
        </p>
      </div>

      {/* Floating Social Chat Widget */}
      <FloatingSocialChat />
    </footer>
  );
};
