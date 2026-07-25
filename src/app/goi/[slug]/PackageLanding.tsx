'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { OrderModal } from '@/components/OrderModal';
import { ShareButtons } from '@/components/ShareButtons';
import { AppStoreGlyph, GooglePlayGlyph } from '@/components/brand/StoreGlyphs';
import { getTranslation } from '@/lib/i18n/dictionaries';
import { useLanguage } from '@/lib/useLanguage';
import { getPackage, type PackageSlug } from '@/lib/packages';
import { PACKAGE_FAQS } from '@/lib/faq';
import { formatUsd } from '@/lib/payment';
import { CheckCircle, ChevronRight, ShieldCheck, CreditCard, Clock } from 'lucide-react';


export function PackageLanding({ slug, shareUrl }: { slug: PackageSlug; shareUrl: string }) {
  const [currentLang, setCurrentLang] = useLanguage();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const t = (key: string) => getTranslation(currentLang, key);

  const pkg = getPackage(slug)!;
  const faqs = PACKAGE_FAQS[slug];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Navbar currentLang={currentLang} onLanguageChange={setCurrentLang} />

      <main className="flex-1">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <ol className="flex items-center gap-1.5 text-xs text-slate-500">
            <li>
              <Link href="/" className="hover:text-brand-blue transition-colors">
                Trang chủ
              </Link>
            </li>
            <ChevronRight className="w-3 h-3" aria-hidden />
            <li className="text-slate-900 font-medium">{pkg.seo.h1}</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 space-y-6">
          <div className="flex items-center gap-2">
            {(pkg.platform === 'Both' || pkg.platform === 'iOS') && <AppStoreGlyph size={22} />}
            {(pkg.platform === 'Both' || pkg.platform === 'Android') && <GooglePlayGlyph size={20} />}
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-blue">
              {t(pkg.labelKey)}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900">
            {pkg.seo.h1}
          </h1>

          <p className="text-base text-slate-600 leading-relaxed max-w-2xl">{pkg.seo.intro}</p>

          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-5xl font-bold tracking-tight text-slate-900">
              {pkg.priceUsd !== null ? formatUsd(pkg.priceUsd) : 'Liên hệ'}
            </span>
            <span className="text-sm text-slate-500">{t(pkg.unitKey)}</span>
            {pkg.priceUsd !== null && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-medium">
                <CreditCard className="w-3.5 h-3.5" aria-hidden />
                <span>
                  2 đợt: {formatUsd(pkg.priceUsd / 2)} + {formatUsd(pkg.priceUsd / 2)}
                </span>
              </span>
            )}
          </div>

          {pkg.priceUsd !== null && (
            <p className="text-sm text-slate-600">
              <strong className="text-slate-900">Đợt 1 ({formatUsd(pkg.priceUsd / 2)})</strong>{' '}
              {t(pkg.depositTriggerKey)} · <strong className="text-slate-900">đợt 2 ({formatUsd(pkg.priceUsd / 2)})</strong>{' '}
              {t('pay_when_live')}.
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setIsOrderModalOpen(true)}
              className="px-7 py-3.5 rounded-full bg-brand-blue hover:bg-brand-blueHover text-white font-semibold text-sm shadow-brand-blue transition-colors"
            >
              {t(pkg.btnKey)}
            </button>
            <Link
              href="/#bang-gia"
              className="px-7 py-3.5 rounded-full bg-white border border-slate-300 hover:border-slate-400 text-slate-900 font-semibold text-sm text-center transition-colors"
            >
              So sánh các gói
            </Link>
          </div>

          <ShareButtons url={shareUrl} title={pkg.seo.h1} className="pt-2" />
        </section>

        {/* What's included */}
        <section className="bg-slate-50 border-y border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Gói này bao gồm</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pkg.featureKeys.map((k) => (
                <li
                  key={k}
                  className="flex items-start gap-2.5 text-sm text-slate-700 bg-white border border-slate-200 rounded-xl px-4 py-3"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" aria-hidden />
                  <span>{t(k)}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" aria-hidden />
                Hoàn tiền 100% nếu không đạt cam kết
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand-blue" aria-hidden />
                Phản hồi trong 24 giờ
              </span>
            </div>
          </div>
        </section>

        {/* FAQ — also feeds the FAQPage structured data */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Câu hỏi thường gặp</h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-xl border border-slate-200 bg-white px-4 py-3.5 open:bg-slate-50 transition-colors"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between gap-3 text-sm font-semibold text-slate-900">
                  <span>{f.q}</span>
                  <ChevronRight
                    className="w-4 h-4 text-slate-400 shrink-0 transition-transform group-open:rotate-90"
                    aria-hidden
                  />
                </summary>
                <p className="text-sm text-slate-600 leading-relaxed mt-2.5">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="border-t border-slate-200 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Sẵn sàng đưa app lên Store?
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              Gửi yêu cầu ngay, kỹ sư TE2SR phản hồi trong 24 giờ. Bạn chỉ thanh toán đợt đầu khi
              đã có đủ 12 testers chạy thật.
            </p>
            <button
              onClick={() => setIsOrderModalOpen(true)}
              className="px-7 py-3.5 rounded-full bg-brand-blue hover:bg-brand-blueHover text-white font-semibold text-sm shadow-brand-blue transition-colors"
            >
              {t(pkg.btnKey)}
            </button>
          </div>
        </section>
      </main>

      <Footer currentLang={currentLang} />

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        currentLang={currentLang}
        initialService={pkg.service}
        initialPackage={pkg.slug}
      />
    </div>
  );
}
