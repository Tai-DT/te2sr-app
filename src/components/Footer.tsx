'use client';

import React from 'react';
import Link from 'next/link';
import { LANGUAGES } from '@/lib/i18n/dictionaries';
import { useLanguage } from '@/lib/i18n/language-context';
import { ShieldCheck, Globe, Star, TestTube, Rocket } from 'lucide-react';
import { Logo } from './brand/Logo';
import { FloatingSocialChat } from './FloatingSocialChat';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200 text-slate-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Col 1 */}
        <div className="space-y-4 md:col-span-1">
          <Link href="/" className="inline-block" aria-label="TE2SR">
            <Logo variant="full" className="items-start" />
          </Link>
          <p className="text-xs text-slate-500 leading-relaxed">
            {t('hero_subtitle')}
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>{t('footer_approval_pledge')}</span>
          </div>
        </div>

        {/* Col 2: Services */}
        <div>
          <h4 className="text-slate-900 text-xs font-bold uppercase tracking-wider mb-4">
            Services
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link href="/services/testing" className="hover:text-brand-blue transition-colors flex items-center gap-2">
                <TestTube className="w-3.5 h-3.5 text-brand-blue" />
                <span>iOS TestFlight & Android QA</span>
              </Link>
            </li>
            <li>
              <Link href="/services/publishing" className="hover:text-brand-blue transition-colors flex items-center gap-2">
                <Rocket className="w-3.5 h-3.5 text-brand-blue" />
                <span>App Store & Google Play Publishing</span>
              </Link>
            </li>
            <li>
              <Link href="/services/promotion" className="hover:text-brand-blue transition-colors flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-brand-blue" />
                <span>ASO Download Boost & 5★ Reviews</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Languages supported */}
        <div>
          <h4 className="text-slate-900 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-blue" />
            <span>Global Coverage</span>
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

        {/* Col 4: Platform & Admin */}
        <div>
          <h4 className="text-slate-900 text-xs font-bold uppercase tracking-wider mb-4">
            Management
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/admin" className="text-brand-blue hover:underline font-bold">
                Admin Management Portal
              </Link>
            </li>
            <li>
              <span className="text-slate-500">{t('footer_support_channels')}</span>
            </li>
            <li>
              <span className="text-slate-500">{t('footer_payment_terms')}</span>
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
