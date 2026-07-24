'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GlassCard } from '@/components/GlassCard';
import { OrderModal } from '@/components/OrderModal';
import { useLanguage } from '@/lib/i18n/language-context';
import { Rocket } from 'lucide-react';

export default function PublishingServicePage() {
  const { t } = useLanguage();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const steps = [
    { n: '01', title: t('svcp_step1_title'), desc: t('svcp_step1_desc') },
    { n: '02', title: t('svcp_step2_title'), desc: t('svcp_step2_desc') },
    { n: '03', title: t('svcp_step3_title'), desc: t('svcp_step3_desc') },
    { n: '04', title: t('svcp_step4_title'), desc: t('svcp_step4_desc') },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-brand-blue text-xs font-extrabold">
            <Rocket className="w-4 h-4" />
            <span>{t('svcp_badge')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 leading-tight">
            {t('svcp_h1')}
          </h1>
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
            {t('svcp_intro')}
          </p>
          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-brand-blue hover:bg-blue-600 font-extrabold text-white text-sm shadow-brand-blue hover:scale-[1.02] transition-all"
          >
            {t('svcp_cta')}
          </button>
        </div>

        {/* Workflow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step) => (
            <GlassCard key={step.n} glow="blue" className="space-y-3">
              <div className="text-brand-blue font-extrabold text-2xl font-display">{step.n}</div>
              <h3 className="font-extrabold text-slate-900 text-base">{step.title}</h3>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">{step.desc}</p>
            </GlassCard>
          ))}
        </div>

        {/* Pricing hint */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center shadow-apple-sm">
          {[
            { title: 'Google Play', price: '$50', note: t('svcp_price_googleplay_note') },
            { title: t('svcp_price_bothstores_title'), price: '$100', note: 'Google Play + iOS App Store' },
            { title: t('svcp_price_enterprise_title'), price: t('svcp_price_enterprise_value'), note: t('svcp_price_enterprise_note') },
          ].map((p) => (
            <div key={p.title} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-apple-sm">
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-600">{p.title}</p>
              <p className="text-3xl font-extrabold font-display text-slate-900 mt-1">{p.price}</p>
              <p className="text-[11px] text-slate-600 font-semibold mt-1">{p.note}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />

      <OrderModal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} initialService="Publishing" />
    </div>
  );
}
