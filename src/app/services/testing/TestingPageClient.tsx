'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GlassCard } from '@/components/GlassCard';
import { AppStoreGlyph, GooglePlayGlyph } from '@/components/brand/StoreGlyphs';
import { OrderModal } from '@/components/OrderModal';
import { useLanguage } from '@/lib/i18n/language-context';
import { TestTube, Smartphone, Cpu, Bug, ShieldCheck } from 'lucide-react';

export default function TestingPageClient() {
  const { t } = useLanguage();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-brand-blue text-xs font-extrabold">
            <TestTube className="w-4 h-4" />
            <span>{t('svct_badge')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 leading-tight">
            {t('svct_h1')}
          </h1>
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
            {t('svct_intro')}
          </p>
          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-brand-blue hover:bg-blue-600 font-extrabold text-white text-sm shadow-brand-blue hover:scale-[1.02] transition-all"
          >
            {t('svct_cta')}
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Smartphone, title: t('svct_feature1_title'), desc: t('svct_feature1_desc') },
            { icon: Cpu, title: t('svct_feature2_title'), desc: t('svct_feature2_desc') },
            { icon: Bug, title: t('svct_feature3_title'), desc: t('svct_feature3_desc') },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <GlassCard key={i} glow="blue" className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-brand-blue flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">{f.title}</h3>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{f.desc}</p>
              </GlassCard>
            );
          })}
        </div>

        {/* Device Matrix */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-apple-md space-y-6">
          <h2 className="text-xl font-extrabold font-display text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-blue" />
            <span>{t('svct_device_matrix_heading')}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {([
              { os: 'ios' as const, label: 'iOS · iPadOS', devices: [
                'iPhone 15 Pro Max (iOS 17)',
                'iPhone 14 & 13 mini (iOS 16)',
                'iPad Pro 12.9" (iPadOS 17)',
                'iPhone SE (iOS 16)',
              ]},
              { os: 'android' as const, label: 'Android', devices: [
                'Samsung Galaxy S24 Ultra',
                'Google Pixel 9 Pro (Android 15)',
                'Xiaomi 14 Ultra (HyperOS)',
                'Oppo Find X7 & foldables',
              ]},
            ]).map((group) => (
              <div key={group.os} className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  {group.os === 'ios' ? <AppStoreGlyph size={18} /> : <GooglePlayGlyph size={16} />}
                  <span>{group.label}</span>
                </div>
                <ul className="space-y-2">
                  {group.devices.map((d) => (
                    <li key={d} className="text-xs text-slate-700 font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      <OrderModal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} initialService="Testing" />
    </div>
  );
}
