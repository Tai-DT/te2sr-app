'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GlassCard } from '@/components/GlassCard';
import { OrderModal } from '@/components/OrderModal';
import { AppStoreGlyph, GooglePlayGlyph } from '@/components/brand/StoreGlyphs';
import { getTranslation } from '@/lib/i18n/dictionaries';
import { useLanguage } from '@/lib/useLanguage';
import { PACKAGES, DEFAULT_PACKAGE_SLUG, type PackageSlug } from '@/lib/packages';
import { formatUsd } from '@/lib/payment';
import {
  Rocket,
  ShieldCheck,
  CheckCircle,
  TestTube,
  Star,
  Zap,
  ArrowRight,
  TrendingUp,
  CreditCard,
  PhoneCall,
} from 'lucide-react';

function StatCounter({ value, label, suffix = '', color = 'text-brand-blue' }: { value: number; label: string; suffix?: string; color?: string }) {
  return (
    <div className="text-center p-5">
      <div className={`text-3xl sm:text-4xl font-bold tracking-tight ${color}`}>
        {value.toLocaleString('en-US')}{suffix}
      </div>
      <div className="text-xs text-slate-500 font-medium mt-1.5">{label}</div>
    </div>
  );
}

export function HomeClient() {
  const [currentLang, setCurrentLang] = useLanguage();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [initialService, setInitialService] = useState<
    'Testing' | 'Publishing' | 'Promotion_5Star' | 'DesignAnalyzer'
  >('Testing');
  const [initialPackage, setInitialPackage] = useState<PackageSlug>(DEFAULT_PACKAGE_SLUG);

  const t = (key: string) => getTranslation(currentLang, key);

  const openServiceModal = (service: 'Testing' | 'Publishing' | 'Promotion_5Star' | 'DesignAnalyzer') => {
    setInitialService(service);
    setInitialPackage(DEFAULT_PACKAGE_SLUG);
    setIsOrderModalOpen(true);
  };

  const openPackageModal = (slug: PackageSlug) => {
    setInitialService('Publishing');
    setInitialPackage(slug);
    setIsOrderModalOpen(true);
  };

  const services = [
    {
      service: 'Testing' as const,
      icon: <TestTube className="w-5 h-5 text-brand-blue" />,
      iconBg: 'bg-blue-50',
      title: t('svc1_title'),
      desc: t('svc1_desc'),
      features: [t('svc1_f1'), t('svc1_f2'), t('svc1_f3'), t('svc1_f4')],
      cta: t('svc1_cta'),
    },
    {
      service: 'Publishing' as const,
      icon: <Rocket className="w-5 h-5 text-brand-blue" />,
      iconBg: 'bg-blue-50',
      title: t('svc2_title'),
      desc: t('svc2_desc'),
      features: [t('svc2_f1'), t('svc2_f2'), t('svc2_f3'), t('svc2_f4')],
      cta: t('svc2_cta'),
    },
    {
      service: 'Promotion_5Star' as const,
      icon: <Star className="w-5 h-5 text-amber-500" />,
      iconBg: 'bg-amber-50',
      title: t('svc3_title'),
      desc: t('svc3_desc'),
      features: [t('svc3_f1'), t('svc3_f2'), t('svc3_f3'), t('svc3_f4')],
      cta: t('svc3_cta'),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-brand-blue selection:text-white">
      <Navbar currentLang={currentLang} onLanguageChange={setCurrentLang} />

      <main className="flex-1">
        {/* ─── HERO ─── */}
        <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-7">
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                <span>{t('hero_pay_chip')}</span>
              </div>
            </div>

            <div className="space-y-5">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tightest text-slate-900 leading-[1.05]">
                {t('hero_title_1')}<br />
                <span className="text-brand-blue">{t('hero_title_2')}</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                {t('hero_sub')}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{t('hero_upload_label')}</span>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-800 shadow-apple-sm">
                <AppStoreGlyph size={18} />
                <span>App Store</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-800 shadow-apple-sm">
                <GooglePlayGlyph size={16} />
                <span>Google Play</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => openServiceModal('Publishing')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-brand-blue hover:bg-brand-blueHover text-white font-semibold text-sm transition-colors shadow-brand-blue flex items-center justify-center gap-2"
              >
                <Rocket className="w-4 h-4" />
                <span>{t('hero_cta_publish')}</span>
              </button>
              <button
                onClick={() => openServiceModal('Testing')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white border border-slate-300 hover:border-slate-400 text-slate-900 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <TestTube className="w-4 h-4 text-brand-blue" />
                <span>{t('hero_cta_test')}</span>
              </button>
            </div>

            <div className="pt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
              {[
                { icon: ShieldCheck, text: t('hero_trust_secure') },
                { icon: Zap, text: t('hero_trust_fast') },
                { icon: TrendingUp, text: t('hero_trust_global') },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <item.icon className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="relative z-10 max-w-3xl mx-auto mt-14 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-apple-md overflow-hidden">
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-200">
                <StatCounter value={200} suffix="+" label={t('stat_apps')} color="text-brand-blue" />
                <StatCounter value={2000} suffix="+" label={t('stat_reviews')} color="text-slate-900" />
                <StatCounter value={90} suffix="%" label={t('stat_approval')} color="text-emerald-600" />
                <StatCounter value={8} suffix="+" label={t('stat_langs')} color="text-slate-900" />
              </div>
            </div>
          </div>
        </section>

        {/* ─── SERVICES ─── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="text-xs text-brand-blue font-semibold uppercase tracking-widest">
              {t('services_eyebrow')}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              {t('services_title')}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {t('services_intro')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((svc, i) => (
              <GlassCard key={i} glow="none" className="flex flex-col justify-between h-full group border-slate-200">
                <div className="space-y-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${svc.iconBg} transition-transform group-hover:scale-105`}>
                    {svc.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{svc.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{svc.desc}</p>
                  <ul className="space-y-2.5 pt-1">
                    {svc.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-6">
                  <button
                    onClick={() => openServiceModal(svc.service)}
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-brand-blue text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <span>{svc.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* ─── PRICING (4 gói, render từ src/lib/packages.ts) ─── */}
        <section id="bang-gia" className="bg-slate-50 border-y border-slate-200 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="text-xs text-brand-blue font-semibold uppercase tracking-widest">
                {t('pricing_eyebrow')}
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                {t('pricing_title')}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {t('pricing_intro')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 items-stretch">
              {PACKAGES.map((pkg) => {
                const featured = !!pkg.featured;
                return (
                  <div
                    key={pkg.slug}
                    className={`relative bg-white rounded-2xl p-6 flex flex-col justify-between gap-5 ${
                      featured
                        ? 'border-2 border-brand-blue shadow-apple-lg'
                        : 'border border-slate-200 shadow-apple-sm'
                    }`}
                  >
                    {featured && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-3 py-1 rounded-full bg-brand-blue text-white text-[11px] font-semibold tracking-wide whitespace-nowrap">
                          {t('price_both_badge')}
                        </span>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 min-h-[20px]">
                          {(pkg.platform === 'Both' || pkg.platform === 'iOS') && <AppStoreGlyph size={17} />}
                          {(pkg.platform === 'Both' || pkg.platform === 'Android') && <GooglePlayGlyph size={15} />}
                          <p
                            className={`text-[11px] font-semibold uppercase tracking-widest ${
                              featured ? 'text-brand-blue' : 'text-slate-500'
                            }`}
                          >
                            {t(pkg.labelKey)}
                          </p>
                        </div>

                        <div className="flex items-baseline gap-1.5">
                          <span className="text-4xl font-bold tracking-tight text-slate-900">
                            {pkg.priceUsd !== null ? formatUsd(pkg.priceUsd) : t('price_ent_value')}
                          </span>
                          <span className="text-xs text-slate-500">{t(pkg.unitKey)}</span>
                        </div>

                        {pkg.priceUsd !== null ? (
                          <div className="space-y-1">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-medium">
                              <CreditCard className="w-3.5 h-3.5" aria-hidden />
                              <span>
                                2 đợt: {formatUsd(pkg.priceUsd / 2)} + {formatUsd(pkg.priceUsd / 2)}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-snug">
                              Đợt 1 {t(pkg.depositTriggerKey)} · đợt 2 {t('pay_when_live')}
                            </p>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-[11px] font-medium">
                            <PhoneCall className="w-3.5 h-3.5" aria-hidden />
                            <span>{t('price_ent_note')}</span>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-slate-100" />

                      <ul className="space-y-2.5 text-[13px] text-slate-700">
                        {pkg.featureKeys.map((k) => (
                          <li key={k} className="flex items-start gap-2">
                            <CheckCircle
                              className={`w-4 h-4 shrink-0 mt-0.5 ${
                                featured ? 'text-brand-blue' : 'text-emerald-500'
                              }`}
                              aria-hidden
                            />
                            <span>{t(k)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => openPackageModal(pkg.slug)}
                        className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors ${
                          featured
                            ? 'bg-brand-blue hover:bg-brand-blueHover text-white shadow-brand-blue'
                            : 'bg-slate-900 hover:bg-brand-blue text-white'
                        }`}
                      >
                        {t(pkg.btnKey)}
                      </button>
                      <Link
                        href={`/goi/${pkg.slug}`}
                        className="block text-center text-xs text-slate-500 hover:text-brand-blue transition-colors"
                      >
                        Xem chi tiết gói →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer currentLang={currentLang} />

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        currentLang={currentLang}
        initialService={initialService}
        initialPackage={initialPackage}
      />
    </div>
  );
}
