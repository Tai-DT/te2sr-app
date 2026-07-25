'use client';

import React, { useState, useEffect } from 'react';
import { getTranslation, LanguageCode } from '@/lib/i18n/dictionaries';
import { PaymentPanel } from './PaymentPanel';
import { firstInstalmentUsd, getPackage, PACKAGES, DEFAULT_PACKAGE_SLUG, type PackageSlug } from '@/lib/packages';
import { formatUsd } from '@/lib/payment';
import { orderFallbackLinks } from '@/lib/contact';
import { X, CheckCircle2, Send, Rocket, TestTube, Star, BadgeDollarSign, Users, Copy, Check, CreditCard, Link2, AlertCircle } from 'lucide-react';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: LanguageCode;
  initialService?: 'Testing' | 'Publishing' | 'Promotion_5Star' | 'DesignAnalyzer';
  /** Gói đăng tải chọn sẵn (dùng khi mở từ trang /goi/<slug>). */
  initialPackage?: PackageSlug;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  initialService = 'Testing',
  initialPackage = DEFAULT_PACKAGE_SLUG,
}) => {
  const [appName, setAppName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [packageSlug, setPackageSlug] = useState<PackageSlug>(initialPackage);
  const [serviceType, setServiceType] = useState<
    'Testing' | 'Publishing' | 'Promotion_5Star' | 'DesignAnalyzer'
  >(initialService);
  const [targetCountries, setTargetCountries] = useState('Vietnam, USA, Japan');
  const [testingUrl, setTestingUrl] = useState('');
  const [details, setDetails] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedOrder, setSubmittedOrder] = useState<any>(null);
  const [copiedGroup, setCopiedGroup] = useState(false);
  const [copiedFallback, setCopiedFallback] = useState(false);

  const googleGroupEmail = 'te2sr@googlegroups.com';
  const selectedPackage = getPackage(packageSlug)!;
  const platform = selectedPackage.platform;
  const fallback = orderFallbackLinks({
    appName,
    clientEmail,
    platform,
    serviceType,
    targetCountries,
    testingUrl,
    details,
  });

  const t = (key: string) => getTranslation(currentLang, key);

  // Sync the chosen service/package into state each time the modal opens
  // (the modal is mounted while closed, so useState only seeds once).
  useEffect(() => {
    if (isOpen) {
      setServiceType(initialService);
      setPackageSlug(initialPackage);
    }
  }, [isOpen, initialService, initialPackage]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyGroup = () => {
    navigator.clipboard.writeText(googleGroupEmail);
    setCopiedGroup(true);
    setTimeout(() => setCopiedGroup(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // chống double-submit
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${apiUrl}/api/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appName,
          clientEmail,
          platform,
          packageSlug,
          serviceType,
          targetCountries: targetCountries.split(',').map((s) => s.trim()).filter(Boolean),
          testingUrl,
          details,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success && data.order) {
        setSubmittedOrder(data.order);
      } else {
        setSubmitError(
          data?.error ||
            'Không gửi được yêu cầu. Vui lòng thử lại hoặc nhắn trực tiếp qua khung chat (Zalo / WhatsApp / Messenger).'
        );
      }
    } catch (err) {
      console.error(err);
      setSubmitError(
        'Không kết nối được máy chủ. Kiểm tra kết nối mạng hoặc nhắn trực tiếp qua khung chat để được hỗ trợ ngay.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmittedOrder(null);
    setAppName('');
    setClientEmail('');
    setTestingUrl('');
    setDetails('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop animate-fadeIn"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="TE2SR"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white border border-slate-300 rounded-3xl p-6 md:p-8 shadow-apple-lg overflow-hidden max-h-[90vh] overflow-y-auto"
      >

        {/* Close Button */}
        <button
          onClick={resetForm}
          aria-label="Đóng"
          className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5" aria-hidden />
        </button>

        {submittedOrder ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 border border-emerald-300 rounded-full flex items-center justify-center mx-auto shadow-apple-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 font-display">
                Đã Gửi Yêu Cầu Thành Công!
              </h3>
              <p className="text-xs text-slate-700 font-semibold mt-1">
                Mã đơn hàng của bạn: <span className="font-mono font-semibold text-brand-blue">{submittedOrder.id}</span>
              </p>
            </div>

            {/* 2-Step Payment Schedule Notice */}
            <div className="p-4 bg-blue-50 border border-blue-300 rounded-2xl text-left space-y-2 shadow-apple-sm">
              <div className="flex items-center gap-2 text-brand-blue font-semibold text-xs">
                <CreditCard className="w-4 h-4 text-brand-blue shrink-0" />
                <span>Quy Trình Thanh Toán 2 Đợt (50% - 50%)</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-900 font-semibold">
                <li className="flex items-start gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-blue-200 text-brand-blue font-semibold text-[10px]">Đợt 1 (50%)</span>
                  <span>Thanh toán 50% {t(selectedPackage.depositTriggerKey)}.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-800 font-semibold text-[10px]">Đợt 2 (50%)</span>
                  <span>Thanh toán 50% còn lại {t('pay_when_live')}.</span>
                </li>
              </ul>
            </div>

            {/* Google Play Tester Group Notice */}
            {(submittedOrder.platform === 'Android' || submittedOrder.platform === 'Both') && (
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-left space-y-2 shadow-apple-sm">
                <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs">
                  <Users className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Hướng Dẫn Kích Hoạt 12 Testers (14 Ngày)</span>
                </div>
                <p className="text-[11px] text-slate-800 leading-relaxed font-semibold">
                  1. Thêm email Google Group vào mục <strong>Closed Testing (Kiểm thử kín)</strong> trong Google Play Console:
                </p>
                <div className="flex items-center justify-between gap-2 flex-wrap p-2.5 bg-white border border-amber-300 rounded-xl">
                  <span className="font-mono text-xs font-semibold text-brand-blue select-all truncate min-w-0">{googleGroupEmail}</span>
                  <button
                    onClick={handleCopyGroup}
                    className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                  >
                    {copiedGroup ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedGroup ? 'Đã sao chép' : 'Sao chép Email'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-800 leading-relaxed font-semibold pt-1">
                  2. Vui lòng gửi <strong>Link Kiểm Thử (Opt-in URL)</strong> trong khung chat với Admin để đội ngũ testers TE2SR tiến hành cài đặt ngay!
                </p>
              </div>
            )}

            {/* 100% Money-Back Confirmation Badge */}
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-semibold flex items-center justify-center gap-2 shadow-apple-sm">
              <BadgeDollarSign className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Cam kết HOÀN TIỀN 100% nếu không đáp ứng đúng yêu cầu dịch vụ.</span>
            </div>

            {/* Payment — amounts & details come from src/lib/payment.ts */}
            <PaymentPanel
              orderId={submittedOrder.id}
              amountUsd={firstInstalmentUsd(selectedPackage)}
              totalUsd={selectedPackage.priceUsd}
            />

            <button
              onClick={resetForm}
              className="w-full py-3 rounded-xl bg-brand-blue text-white font-semibold text-xs shadow-brand-blue hover:bg-brand-blueHover transition-all"
            >
              Hoàn Tất & Xem Tiến Độ
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-xl font-semibold text-slate-900 font-display flex items-center gap-2">
                <Rocket className="w-5 h-5 text-brand-blue" />
                <span>Đăng Ký Dịch Vụ TE2SR</span>
              </h3>
              <p className="text-xs text-slate-800 font-medium">
                Thanh toán 2 đợt 50% – 50%: đợt 1 {t(selectedPackage.depositTriggerKey)}, đợt 2 {t('pay_when_live')}.
              </p>
            </div>

            {/* Service Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-900">Chọn Dịch Vụ Muốn Đăng Ký</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setServiceType('Testing')}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all ${
                    serviceType === 'Testing'
                      ? 'bg-brand-blue text-white border-brand-blue shadow-apple-sm'
                      : 'bg-slate-50 border-slate-300 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <TestTube className="w-4 h-4 shrink-0" />
                  <span>Kiểm Thử QA</span>
                </button>

                <button
                  type="button"
                  onClick={() => setServiceType('Publishing')}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all ${
                    serviceType === 'Publishing'
                      ? 'bg-brand-blue text-white border-brand-blue shadow-apple-sm'
                      : 'bg-slate-50 border-slate-300 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <Rocket className="w-4 h-4 shrink-0" />
                  <span>Đăng Tải Store</span>
                </button>

                <button
                  type="button"
                  onClick={() => setServiceType('Promotion_5Star')}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all ${
                    serviceType === 'Promotion_5Star'
                      ? 'bg-brand-blue text-white border-brand-blue shadow-apple-sm'
                      : 'bg-slate-50 border-slate-300 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <Star className="w-4 h-4 shrink-0" />
                  <span>Tăng 5★ Boost</span>
                </button>
              </div>
            </div>

            {/* App Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-900 block mb-1">Tên App / Dự Án</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: CryptoPulse App"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-blue focus:bg-white focus-visible:ring-2 focus-visible:ring-brand-blue/30 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-900 block mb-1">Email Liên Hệ</label>
                <input
                  type="email"
                  required
                  placeholder="developer@company.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-blue focus:bg-white focus-visible:ring-2 focus-visible:ring-brand-blue/30 transition-all"
                />
              </div>
            </div>

            {/* Testing Link Field */}
            <div>
              <label className="text-xs font-semibold text-slate-900 block mb-1 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-brand-blue" />
                <span>Link Kiểm Thử (Google Play / TestFlight Opt-in URL)</span>
              </label>
              <input
                type="url"
                placeholder="https://play.google.com/apps/testing/com.yourcompany.app"
                value={testingUrl}
                onChange={(e) => setTestingUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-blue focus:bg-white focus-visible:ring-2 focus-visible:ring-brand-blue/30 transition-all"
              />
              <p className="text-[10px] text-slate-600 font-medium mt-1">
                Dán link tham gia kiểm thử kín để kỹ sư TE2SR vào test & tính 14 ngày ngay.
              </p>
            </div>

            {/* Package / Platform Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-900 block mb-1">Chọn Gói Đăng Tải</label>
                <select
                  value={packageSlug}
                  onChange={(e: any) => setPackageSlug(e.target.value as PackageSlug)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-blue focus:bg-white focus-visible:ring-2 focus-visible:ring-brand-blue/30 transition-all"
                >
                  {PACKAGES.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.selectLabel}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-900 block mb-1">Quốc Gia Mục Tiêu</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Việt Nam, Mỹ, Nhật Bản"
                  value={targetCountries}
                  onChange={(e) => setTargetCountries(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-blue focus:bg-white focus-visible:ring-2 focus-visible:ring-brand-blue/30 transition-all"
                />
              </div>
            </div>

            {/* Price summary — customer sees exactly what they will pay */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-2 text-left">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-blue-800 font-semibold text-[11px]">
                  <CreditCard className="w-3.5 h-3.5 shrink-0" aria-hidden />
                  <span>Tổng chi phí gói đã chọn</span>
                </span>
                <span className="text-lg font-bold tracking-tight text-slate-900">
                  {selectedPackage.priceUsd !== null ? formatUsd(selectedPackage.priceUsd) : 'Liên hệ'}
                </span>
              </div>
              {selectedPackage.priceUsd !== null && (
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="px-1.5 py-0.5 rounded bg-blue-200 text-blue-800 font-semibold">
                    Đợt 1: {formatUsd(selectedPackage.priceUsd / 2)}
                  </span>
                  <span className="text-slate-600">{t(selectedPackage.depositTriggerKey)}</span>
                </div>
              )}
              {selectedPackage.priceUsd !== null && (
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-800 font-semibold">
                    Đợt 2: {formatUsd(selectedPackage.priceUsd / 2)}
                  </span>
                  <span className="text-slate-600">{t('pay_when_live')}</span>
                </div>
              )}
            </div>

            {/* Google Play Testers Notice inside Form */}
            {(platform === 'Android' || platform === 'Both') && (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl space-y-1 text-left">
                <div className="flex items-center gap-1.5 text-amber-900 font-semibold text-[11px]">
                  <Users className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Google Play Closed Testing Group (12 Testers / 14 Ngày):</span>
                </div>
                <p className="text-[10px] text-slate-800 font-medium">
                  Thêm Google Group <strong className="font-mono text-brand-blue font-bold">te2sr@googlegroups.com</strong> vào Google Play Console và gửi Link Kiểm Thử để kỹ sư TE2SR tham gia test.
                </p>
              </div>
            )}

            {/* Details */}
            <div>
              <label className="text-xs font-semibold text-slate-900 block mb-1">Ghi Chú Hoặc Yêu Cầu Đặc Biệt</label>
              <textarea
                rows={2}
                placeholder="Mô tả mục tiêu..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-blue focus:bg-white focus-visible:ring-2 focus-visible:ring-brand-blue/30 transition-all"
              />
            </div>

            {submitError && (
              <div role="alert" className="p-3 rounded-xl bg-red-50 border border-red-200 space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" aria-hidden />
                  <p className="text-[11px] text-red-800 leading-relaxed font-medium">{submitError}</p>
                </div>

                {/* Dự phòng: gửi thẳng qua chat/email, kèm sẵn thông tin đơn — không mất khách */}
                <div className="flex flex-wrap gap-2 pl-6">
                  <a
                    href={fallback.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-colors"
                  >
                    Gửi qua WhatsApp
                  </a>
                  <a
                    href={fallback.zalo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold transition-colors"
                  >
                    Nhắn Zalo
                  </a>
                  <a
                    href={fallback.email}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-[11px] font-semibold transition-colors"
                  >
                    Gửi email
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(fallback.raw);
                      setCopiedFallback(true);
                      setTimeout(() => setCopiedFallback(false), 2000);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-[11px] font-semibold transition-colors"
                  >
                    {copiedFallback ? 'Đã chép nội dung' : 'Chép nội dung đơn'}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-brand-blue font-semibold text-white text-sm shadow-brand-blue hover:bg-brand-blueHover transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" aria-hidden />
              <span>{isSubmitting ? 'Đang gửi…' : 'Gửi Yêu Cầu Ngay'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
