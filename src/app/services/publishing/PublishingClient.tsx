'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GlassCard } from '@/components/GlassCard';
import { OrderModal } from '@/components/OrderModal';
import { AppStoreGlyph, GooglePlayGlyph } from '@/components/brand/StoreGlyphs';
import { getTranslation } from '@/lib/i18n/dictionaries';
import { useLanguage } from '@/lib/useLanguage';
import { Rocket } from 'lucide-react';

export function PublishingClient() {
  const [currentLang, setCurrentLang] = useLanguage();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const t = (key: string) => getTranslation(currentLang, key);

  const steps = [
    { n: '01', title: t('pub_s1_title'), desc: t('pub_s1_desc') },
    { n: '02', title: t('pub_s2_title'), desc: t('pub_s2_desc') },
    { n: '03', title: t('pub_s3_title'), desc: t('pub_s3_desc') },
    { n: '04', title: t('pub_s4_title'), desc: t('pub_s4_desc') },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Navbar currentLang={currentLang} onLanguageChange={setCurrentLang} />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-brand-blue text-xs font-medium">
            <Rocket className="w-4 h-4" />
            <span>{t('pub_badge')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900">{t('pub_h1')}</h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{t('pub_sub')}</p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-800 shadow-apple-sm">
              <AppStoreGlyph size={18} /> <span>App Store</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-800 shadow-apple-sm">
              <GooglePlayGlyph size={16} /> <span>Google Play</span>
            </div>
          </div>
          <div className="pt-2">
            <button
              onClick={() => setIsOrderModalOpen(true)}
              className="px-6 py-3 rounded-full bg-brand-blue hover:bg-brand-blueHover text-white font-semibold text-sm shadow-brand-blue transition-colors"
            >
              {t('pub_cta')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <GlassCard key={s.n} className="space-y-3 border-slate-200">
              <div className="text-2xl font-bold text-brand-blue tracking-tight">{s.n}</div>
              <h3 className="text-base font-semibold text-slate-900">{s.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
            </GlassCard>
          ))}
        </div>
      </main>

      <Footer currentLang={currentLang} />

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        currentLang={currentLang}
        initialService="Publishing"
      />
    </div>
  );
}
