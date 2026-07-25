'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GlassCard } from '@/components/GlassCard';
import { OrderModal } from '@/components/OrderModal';
import { ServiceIllustration } from '@/components/ServiceIllustration';
import { useLanguage } from '@/lib/i18n/language-context';
import type { ServiceType } from '@/lib/types';
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
  Globe,
  Code2,
  MessageSquare,
} from 'lucide-react';

function StatCounter({ value, label, suffix = '', color = 'text-brand-blue' }: { value: number; label: string; suffix?: string; color?: string }) {
  return (
    <div className="text-center p-4">
      <div className={`text-3xl sm:text-4xl font-extrabold font-display ${color}`}>
        {value.toLocaleString('en-US')}{suffix}
      </div>
      <div className="text-xs text-slate-700 font-extrabold mt-1">{label}</div>
    </div>
  );
}

export default function HomePage() {
  const { t } = useLanguage();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [initialService, setInitialService] = useState<ServiceType>('Testing');

  const openServiceModal = (service: ServiceType) => {
    setInitialService(service);
    setIsOrderModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-brand-blue selection:text-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        {/* ════════════════════════════
            HERO SECTION
        ════════════════════════════ */}
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
            {/* Top Payment & Guarantee Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-brand-blue text-xs font-extrabold shadow-apple-sm">
                <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
                <span>{t('hero_pay_badge')}</span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-4 max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-display tracking-tight text-slate-900 leading-[1.1]">
                {t('hero_line1')} <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-blue-600">
                  {t('hero_line2')}
                </span>
              </h1>

              <p className="text-base sm:text-xl text-slate-800 max-w-2xl mx-auto font-medium leading-relaxed">
                {t('hero_sub2')}
              </p>
            </div>

            {/* Key Value Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-extrabold flex items-center gap-2 shadow-apple-sm">
                <CreditCard className="w-4 h-4 text-brand-blue" />
                <span>{t('home_pay_split_badge')}</span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-extrabold flex items-center gap-2 shadow-apple-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>{t('home_refund_commitment')}</span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-extrabold flex items-center gap-2 shadow-apple-sm">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>{t('home_no_scam_apps')}</span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => openServiceModal('Publishing')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-blue hover:bg-blue-600 text-white font-extrabold text-sm transition-all shadow-brand-blue hover:scale-[1.02] flex items-center justify-center gap-2.5"
              >
                <Rocket className="w-4 h-4" />
                <span>{t('cta_publish_now')}</span>
              </button>

              <button
                onClick={() => openServiceModal('Testing')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-100 border border-slate-300 hover:bg-slate-200 text-slate-900 font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-apple-sm"
              >
                <TestTube className="w-4 h-4 text-brand-blue" />
                <span>{t('cta_test_now')}</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-700 font-extrabold">
              {[
                { icon: ShieldCheck, text: t('home_trust_secure_dev') },
                { icon: Zap, text: t('home_trust_24h') },
                { icon: TrendingUp, text: t('home_trust_50_countries') },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200">
                  <item.icon className="w-4 h-4 text-brand-blue" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Stats Bar ─── */}
          <div className="relative z-10 max-w-4xl mx-auto mt-16">
            <div className="bg-white rounded-2xl border border-slate-300 shadow-apple-md overflow-hidden">
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-200">
                <StatCounter value={200} suffix="+" label={t('home_stat_apps_approved')} color="text-brand-blue" />
                <StatCounter value={2000} suffix="+" label={t('home_stat_reviews_gifted')} color="text-slate-900" />
                <StatCounter value={90} suffix="%" label={t('home_stat_approval_rate')} color="text-emerald-600" />
                <StatCounter value={8} suffix="+" label={t('home_stat_languages')} color="text-amber-600" />
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════
            CORE SERVICES GRID
        ════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-block px-4 py-1.5 rounded-full bg-slate-100 border border-slate-300 text-xs text-slate-900 font-extrabold uppercase tracking-wider">
              {t('home_services_chip')}
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900">
              {t('services_title')}
            </h2>
            <p className="text-sm sm:text-base text-slate-800 max-w-xl mx-auto font-medium">
              {t('home_services_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                service: 'Testing' as const,
                illustration: 'Testing' as const,
                icon: <TestTube className="w-6 h-6 text-brand-blue" />,
                iconBg: 'bg-blue-50 border-blue-200',
                title: t('svc_testing_title'),
                desc: t('svc_testing_desc'),
                features: [t('home_svc_testing_feat1'), t('home_svc_testing_feat2'), t('home_svc_testing_feat3'), t('home_svc_testing_feat4')],
                cta: t('home_svc_testing_cta'),
                glow: 'blue' as const,
              },
              {
                service: 'Publishing' as const,
                illustration: 'Publishing' as const,
                icon: <Rocket className="w-6 h-6 text-slate-900" />,
                iconBg: 'bg-slate-100 border-slate-300',
                title: t('svc_publishing_title'),
                desc: t('svc_publishing_desc'),
                features: [t('home_svc_publishing_feat1'), t('home_svc_publishing_feat2'), t('home_svc_publishing_feat3'), t('home_svc_publishing_feat4')],
                cta: t('home_svc_publishing_cta'),
                glow: 'blue' as const,
              },
              {
                service: 'Promotion_5Star' as const,
                illustration: 'Promotion' as const,
                icon: <Star className="w-6 h-6 text-amber-500" />,
                iconBg: 'bg-amber-50 border-amber-200',
                title: t('home_svc_promo_title'),
                desc: t('home_svc_promo_desc'),
                features: [t('home_svc_promo_feat1'), t('home_svc_promo_feat2'), t('home_svc_promo_feat3'), t('home_svc_promo_feat4')],
                cta: t('home_svc_promo_cta'),
                glow: 'magenta' as const,
              },
              {
                service: 'WebDesign' as const,
                illustration: 'WebDesign' as const,
                icon: <Globe className="w-6 h-6 text-emerald-600" />,
                iconBg: 'bg-emerald-50 border-emerald-200',
                title: t('home_svc_web_title'),
                desc: t('home_svc_web_desc'),
                features: [t('home_svc_web_feat1'), t('home_svc_web_feat2'), t('home_svc_web_feat3'), t('home_svc_web_feat4')],
                cta: t('home_svc_web_cta'),
                glow: 'blue' as const,
                quoteOnly: true,
              },
              {
                service: 'AppDevelopment' as const,
                illustration: 'AppDevelopment' as const,
                icon: <Code2 className="w-6 h-6 text-indigo-600" />,
                iconBg: 'bg-indigo-50 border-indigo-200',
                title: t('home_svc_app_title'),
                desc: t('home_svc_app_desc'),
                features: [t('home_svc_app_feat1'), t('home_svc_app_feat2'), t('home_svc_app_feat3'), t('home_svc_app_feat4')],
                cta: t('home_svc_app_cta'),
                glow: 'blue' as const,
                quoteOnly: true,
              },
            ].map((svc, i) => (
              <GlassCard key={i} glow={svc.glow} className="flex flex-col justify-between h-full group card-shine border-slate-300">
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-apple-sm">
                    <ServiceIllustration type={svc.illustration} />
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${svc.iconBg} shrink-0 shadow-apple-sm`}>
                      {svc.icon}
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900 font-display leading-tight">{svc.title}</h3>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">{svc.desc}</p>
                  {(svc as any).quoteOnly && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-700">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                      {t('svc_quote_on_request')}
                    </span>
                  )}
                  <ul className="space-y-2.5 pt-2">
                    {svc.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-xs text-slate-900 font-bold">
                        <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-6">
                  <button
                    onClick={() => openServiceModal(svc.service)}
                    className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-brand-blue text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-apple-sm"
                  >
                    <span>{svc.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* ════════════════════════════
            PRICING SECTION ($50 / $100 / ENTERPRISE LIÊN HỆ)
        ════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-slate-50 border-y border-slate-200 space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white border border-slate-300 text-xs text-slate-900 font-extrabold uppercase tracking-wider shadow-apple-sm">
              {t('home_pricing_chip')}
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900">
              {t('pricing_heading')}
            </h2>
            <p className="text-sm sm:text-base text-slate-800 max-w-xl mx-auto font-medium">
              {t('pricing_subheading')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Starter ($50 - Google Play) */}
            <div className="bg-white rounded-2xl border border-slate-300 p-7 flex flex-col justify-between space-y-6 shadow-apple-sm card-shine">
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="overflow-hidden rounded-xl border border-slate-200 mb-2.5"><ServiceIllustration type="Publishing" /></div>
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-700">{t('home_price_gplay_label')}</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-5xl font-extrabold font-display text-slate-900">$50</span>
                    <span className="text-xs text-slate-700 font-bold">{t('home_price_gplay_unit')}</span>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-brand-blue text-[11px] font-extrabold">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>{t('home_price_gplay_split')}</span>
                  </div>
                </div>
                <div className="border-t border-slate-200" />
                <ul className="space-y-3 text-xs text-slate-900 font-bold">
                  {[
                    t('home_price_gplay_feat1'),
                    t('home_price_gplay_feat2'),
                    t('home_price_gift_10_reviews'),
                    t('home_price_gplay_feat4'),
                    t('home_price_secure_account'),
                    t('home_price_refund_fail'),
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => openServiceModal('Publishing')}
                className="w-full py-3.5 rounded-xl bg-slate-100 border border-slate-300 text-slate-900 font-extrabold text-xs hover:border-brand-blue hover:bg-white transition-all"
              >
                {t('home_price_gplay_btn')}
              </button>
            </div>

            {/* Standard ($100 - Featured Cả 2 Store) */}
            <div className="relative bg-white rounded-2xl border-2 border-brand-blue p-7 flex flex-col justify-between space-y-6 shadow-apple-md card-shine">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 rounded-full bg-brand-blue text-white text-[11px] font-extrabold tracking-wider shadow-brand-blue whitespace-nowrap">
                  {t('home_price_popular')}
                </span>
              </div>
              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <div className="overflow-hidden rounded-xl border border-blue-200 mb-2.5"><ServiceIllustration type="Testing" /></div>
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-brand-blue">{t('home_price_both_label')}</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-6xl font-extrabold font-display text-slate-900">$100</span>
                    <span className="text-xs text-slate-700 font-bold">{t('home_price_both_unit')}</span>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-brand-blue text-[11px] font-extrabold">
                    <CreditCard className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                    <span>{t('home_price_both_split')}</span>
                  </div>
                </div>
                <div className="border-t border-slate-200" />
                <ul className="space-y-3 text-xs text-slate-900 font-bold">
                  {[
                    t('home_price_both_feat1'),
                    t('home_price_both_feat2'),
                    t('home_price_both_feat3'),
                    t('home_price_both_feat4'),
                    t('home_price_gift_10_reviews'),
                    t('home_price_secure_dev'),
                    t('home_refund_commitment'),
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => openServiceModal('Publishing')}
                className="w-full py-3.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-extrabold text-sm shadow-brand-blue hover:scale-[1.02] transition-all"
              >
                {t('home_price_both_btn')}
              </button>
            </div>

            {/* Enterprise (LIÊN HỆ) */}
            <div className="bg-white rounded-2xl border border-slate-300 p-7 flex flex-col justify-between space-y-6 shadow-apple-sm card-shine">
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="overflow-hidden rounded-xl border border-slate-200 mb-2.5"><ServiceIllustration type="Enterprise" /></div>
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-900">{t('home_price_ent_label')}</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-extrabold font-display text-slate-900">{t('home_price_ent_contact')}</span>
                    <span className="text-xs text-slate-700 font-bold">{t('home_price_ent_unit')}</span>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-extrabold">
                    <PhoneCall className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>{t('home_price_ent_consult')}</span>
                  </div>
                </div>
                <div className="border-t border-slate-200" />
                <ul className="space-y-3 text-xs text-slate-900 font-bold">
                  {[
                    t('home_price_ent_feat1'),
                    t('home_price_ent_feat2'),
                    t('home_price_ent_feat3'),
                    t('home_price_ent_feat4'),
                    t('home_price_ent_feat5'),
                    t('home_price_ent_feat6'),
                    t('home_price_secure_dev'),
                    t('home_price_ent_feat8'),
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-slate-900 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => openServiceModal('Publishing')}
                className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-brand-blue text-white font-extrabold text-xs transition-all shadow-apple-sm"
              >
                {t('home_price_ent_btn')}
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        initialService={initialService}
      />
    </div>
  );
}
