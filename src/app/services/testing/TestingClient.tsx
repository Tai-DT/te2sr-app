'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GlassCard } from '@/components/GlassCard';
import { OrderModal } from '@/components/OrderModal';
import { AppStoreGlyph, GooglePlayGlyph } from '@/components/brand/StoreGlyphs';
import { getTranslation } from '@/lib/i18n/dictionaries';
import { useLanguage } from '@/lib/useLanguage';
import { TestTube, Smartphone, Cpu, Bug, ShieldCheck } from 'lucide-react';

const IOS_DEVICES = [
  'iPhone 15 Pro Max (iOS 17)',
  'iPhone 14 & 13 mini (iOS 16)',
  'iPad Pro 12.9" (iPadOS 17)',
  'iPhone SE (iOS 16)',
];
const ANDROID_DEVICES = [
  'Samsung Galaxy S24 Ultra',
  'Google Pixel 9 Pro (Android 15)',
  'Xiaomi 14 Ultra (HyperOS)',
  'Oppo Find X7 & foldables',
];

export function TestingClient() {
  const [currentLang, setCurrentLang] = useLanguage();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const t = (key: string) => getTranslation(currentLang, key);

  const features = [
    { icon: <Smartphone className="w-5 h-5 text-brand-blue" />, title: t('tst_f1_title'), desc: t('tst_f1_desc') },
    { icon: <Cpu className="w-5 h-5 text-brand-blue" />, title: t('tst_f2_title'), desc: t('tst_f2_desc') },
    { icon: <Bug className="w-5 h-5 text-brand-blue" />, title: t('tst_f3_title'), desc: t('tst_f3_desc') },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Navbar currentLang={currentLang} onLanguageChange={setCurrentLang} />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-brand-blue text-xs font-medium">
            <TestTube className="w-4 h-4" />
            <span>{t('tst_badge')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900">{t('tst_h1')}</h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{t('tst_sub')}</p>
          <div className="pt-2">
            <button
              onClick={() => setIsOrderModalOpen(true)}
              className="px-6 py-3 rounded-full bg-brand-blue hover:bg-brand-blueHover text-white font-semibold text-sm shadow-brand-blue transition-colors"
            >
              {t('tst_cta')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <GlassCard key={i} className="space-y-3 border-slate-200">
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">{f.icon}</div>
              <h3 className="text-base font-semibold text-slate-900">{f.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
            </GlassCard>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 space-y-6">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-blue" />
            <span>{t('tst_devices_title')}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <AppStoreGlyph size={18} /> <span>iOS · iPadOS</span>
              </div>
              <ul className="space-y-2">
                {IOS_DEVICES.map((d) => (
                  <li key={d} className="text-sm text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-2">{d}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <GooglePlayGlyph size={16} /> <span>Android</span>
              </div>
              <ul className="space-y-2">
                {ANDROID_DEVICES.map((d) => (
                  <li key={d} className="text-sm text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-2">{d}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer currentLang={currentLang} />

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        currentLang={currentLang}
        initialService="Testing"
      />
    </div>
  );
}
