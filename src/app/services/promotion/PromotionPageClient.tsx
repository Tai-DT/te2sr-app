'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GlassCard } from '@/components/GlassCard';
import { OrderModal } from '@/components/OrderModal';
import { useLanguage } from '@/lib/i18n/language-context';
import { Star, TrendingUp, Globe } from 'lucide-react';

export default function PromotionPageClient() {
  const { t } = useLanguage();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const features = [
    { icon: TrendingUp, title: t('svcr_feature1_title'), desc: t('svcr_feature1_desc') },
    { icon: Star, title: t('svcr_feature2_title'), desc: t('svcr_feature2_desc') },
    { icon: Globe, title: t('svcr_feature3_title'), desc: t('svcr_feature3_desc') },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-extrabold">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{t('svcr_badge')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 leading-tight">
            {t('svcr_h1')}
          </h1>
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
            {t('svcr_intro')}
          </p>
          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 font-extrabold text-white text-sm shadow-apple-md hover:scale-[1.02] transition-all"
          >
            {t('svcr_cta')}
          </button>
        </div>

        {/* Campaign Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <GlassCard key={i} className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
                  <Icon className={`w-6 h-6 ${f.icon === Star ? 'fill-amber-500' : ''}`} />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">{f.title}</h3>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{f.desc}</p>
              </GlassCard>
            );
          })}
        </div>

        {/* Bonus note */}
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 text-center shadow-apple-sm">
          <p className="text-sm font-extrabold text-amber-900">{t('svcr_bonus_line1')}</p>
          <p className="text-xs text-amber-800 font-semibold mt-1">{t('svcr_bonus_line2')}</p>
        </div>
      </main>

      <Footer />

      <OrderModal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} initialService="Promotion_5Star" />
    </div>
  );
}
