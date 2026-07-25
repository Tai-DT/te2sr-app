'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GlassCard } from '@/components/GlassCard';
import { OrderModal } from '@/components/OrderModal';
import { getTranslation } from '@/lib/i18n/dictionaries';
import { useLanguage } from '@/lib/useLanguage';
import { Star, TrendingUp, Globe } from 'lucide-react';

export function PromotionClient() {
  const [currentLang, setCurrentLang] = useLanguage();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const t = (key: string) => getTranslation(currentLang, key);

  const features = [
    { icon: <TrendingUp className="w-5 h-5 text-brand-blue" />, title: t('promo_f1_title'), desc: t('promo_f1_desc') },
    { icon: <Star className="w-5 h-5 text-amber-500 fill-amber-500" />, title: t('promo_f2_title'), desc: t('promo_f2_desc') },
    { icon: <Globe className="w-5 h-5 text-brand-blue" />, title: t('promo_f3_title'), desc: t('promo_f3_desc') },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Navbar currentLang={currentLang} onLanguageChange={setCurrentLang} />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-xs font-medium">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{t('promo_badge')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900">{t('promo_h1')}</h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{t('promo_sub')}</p>
          <div className="pt-2">
            <button
              onClick={() => setIsOrderModalOpen(true)}
              className="px-6 py-3 rounded-full bg-brand-blue hover:bg-brand-blueHover text-white font-semibold text-sm shadow-brand-blue transition-colors"
            >
              {t('promo_cta')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <GlassCard key={i} className="space-y-3 border-slate-200">
              <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center">{f.icon}</div>
              <h3 className="text-base font-semibold text-slate-900">{f.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
            </GlassCard>
          ))}
        </div>
      </main>

      <Footer currentLang={currentLang} />

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        currentLang={currentLang}
        initialService="Promotion_5Star"
      />
    </div>
  );
}
