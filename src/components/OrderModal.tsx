'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/language-context';
import { api, ApiError } from '@/lib/api-client';
import type { Order, Platform, ServiceType } from '@/lib/types';
import { PaymentPanel } from './PaymentPanel';
import { X, CheckCircle2, Send, Rocket, TestTube, Star, BadgeDollarSign, AlertCircle, Users, Copy, Check, CreditCard, Link2, Globe, Code2, MessageSquare, TrendingUp, Search, MonitorCheck } from 'lucide-react';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: ServiceType;
  /** Nền tảng chọn sẵn theo gói khách vừa bấm. Không truyền thì mặc định
   *  'Both' ($100) — trước đây nút gói $50 (Google Play) cũng rơi vào mặc
   *  định này nên khách bấm gói $50 lại nhận đơn $100. */
  initialPlatform?: Platform;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  initialService = 'Testing',
  initialPlatform = 'Both',
}) => {
  const { t } = useLanguage();
  const [appName, setAppName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [platform, setPlatform] = useState<Platform>(initialPlatform);
  const [serviceType, setServiceType] = useState<ServiceType>(initialService);
  const [targetCountries, setTargetCountries] = useState('Vietnam, USA, Japan');
  const [testingUrl, setTestingUrl] = useState('');
  const [details, setDetails] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [copiedGroup, setCopiedGroup] = useState(false);

  const googleGroupEmail = 'te2sr@googlegroups.com';
  /** Thiết kế web / làm app: chưa có app trên Store nên các trường về
   *  link kiểm thử, gói đăng tải và thanh toán 2 đợt đều không áp dụng. */
  const isQuoteOnly = (['WebTesting', 'WebDesign', 'AppDevelopment', 'AppSEO', 'WebSEO', 'PageManagement'] as ServiceType[]).includes(serviceType);

  // Modal được mount sẵn khi đang đóng nên useState chỉ chạy một lần.
  // Đồng bộ lại dịch vụ mỗi lần mở để nút "Trao đổi yêu cầu website" v.v.
  // chọn đúng dịch vụ người dùng vừa bấm.
  useEffect(() => {
    if (isOpen) {
      setServiceType(initialService);
      setPlatform(initialPlatform);
    }
  }, [isOpen, initialService, initialPlatform]);

  if (!isOpen) return null;

  const handleCopyGroup = () => {
    navigator.clipboard.writeText(googleGroupEmail);
    setCopiedGroup(true);
    setTimeout(() => setCopiedGroup(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const order = await api.createOrder({
        appName,
        clientEmail,
        platform,
        serviceType,
        targetCountries: targetCountries.split(',').map((s) => s.trim()).filter(Boolean),
        testingUrl: testingUrl || undefined,
        details: details || undefined,
      });
      setSubmittedOrder(order);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('order_error_submit_failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmittedOrder(null);
    setError('');
    setAppName('');
    setClientEmail('');
    setTestingUrl('');
    setDetails('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white border border-slate-300 rounded-3xl p-6 md:p-8 shadow-apple-lg overflow-hidden max-h-[90vh] overflow-y-auto">

        {/* Close Button */}
        <button
          onClick={resetForm}
          className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedOrder ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 border border-emerald-300 rounded-full flex items-center justify-center mx-auto shadow-apple-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 font-display">
                {t('order_success_title')}
              </h3>
              <p className="text-xs text-slate-700 font-semibold mt-1">
                {t('order_your_order_id')} <span className="font-mono font-extrabold text-brand-blue">{submittedOrder.id}</span>
              </p>
            </div>

            {isQuoteOnly ? (
              <div className="p-4 bg-slate-50 border border-slate-300 rounded-2xl text-left space-y-2 shadow-apple-sm">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs">
                  <MessageSquare className="w-4 h-4 text-slate-600 shrink-0" />
                  <span>{t('order_quote_req_label')}</span>
                </div>
                <p className="text-[11px] text-slate-800 leading-relaxed font-semibold">
                  {t('order_quote_no_payment')}
                </p>
              </div>
            ) : (
              <>
              {/* 2-Step Payment Schedule Notice */}
              <div className="p-4 bg-blue-50 border border-blue-300 rounded-2xl text-left space-y-2 shadow-apple-sm">
                <div className="flex items-center gap-2 text-brand-blue font-extrabold text-xs">
                  <CreditCard className="w-4 h-4 text-brand-blue shrink-0" />
                  <span>{t('order_payment_2step_title')}</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-slate-900 font-semibold">
                  <li className="flex items-start gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-blue-200 text-brand-blue font-extrabold text-[10px]">{t('order_phase1_badge')}</span>
                    <span>{t('order_phase1_desc')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-800 font-extrabold text-[10px]">{t('order_phase2_badge')}</span>
                    <span>{t('order_phase2_desc')}</span>
                  </li>
                </ul>
              </div>

              {/* Google Play Tester Group Notice */}
              {(submittedOrder.platform === 'Android' || submittedOrder.platform === 'Both') && (
                <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-left space-y-2 shadow-apple-sm">
                  <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs">
                    <Users className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>{t('order_tester_guide_title')}</span>
                  </div>
                  <p className="text-[11px] text-slate-800 leading-relaxed font-semibold">
                    {t('order_tester_step1')}
                  </p>
                  <div className="flex items-center justify-between p-2.5 bg-white border border-amber-300 rounded-xl">
                    <span className="font-mono text-xs font-extrabold text-brand-blue select-all">{googleGroupEmail}</span>
                    <button
                      onClick={handleCopyGroup}
                      className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-[11px] flex items-center gap-1 transition-colors"
                    >
                      {copiedGroup ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedGroup ? t('order_copied') : t('order_copy_email')}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-800 leading-relaxed font-semibold pt-1">
                    {t('order_tester_step2')}
                  </p>
                </div>
              )}

              {/* 100% Money-Back Confirmation Badge */}
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-extrabold flex items-center justify-center gap-2 shadow-apple-sm">
                <BadgeDollarSign className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{t('order_moneyback_badge')}</span>
              </div>

              {/* Thông tin thanh toán — lấy từ src/lib/payment.ts, KHÔNG hardcode */}
              <PaymentPanel
                orderId={submittedOrder.id}
                amountUsd={submittedOrder.packagePrice ? submittedOrder.packagePrice / 2 : null}
                totalUsd={submittedOrder.packagePrice ?? null}
              />

              </>
            )}

            {/* Nút này từng chỉ đóng modal, không đưa khách đi đâu cả — trong khi
                chữ trên nút hứa "xem tiến độ". Nay dẫn thẳng sang trang theo dõi
                đơn; nếu chưa đăng nhập, trang đó hướng dẫn đăng nhập Google
                bằng đúng email đã đặt để nhận lại đơn. */}
            <button
              onClick={() => { resetForm(); router.push('/orders'); }}
              className="w-full py-3 rounded-xl bg-brand-blue text-white font-extrabold text-xs shadow-brand-blue hover:bg-blue-600 transition-all"
            >
              {t('order_finish_view_progress')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900 font-display flex items-center gap-2">
                <Rocket className="w-5 h-5 text-brand-blue" />
                <span>{t('order_register_service')}</span>
              </h3>
              <p className="text-xs text-slate-800 font-medium">
                {isQuoteOnly ? t('order_quote_req_hint') : t('order_form_subtitle')}
              </p>
            </div>

            {/* Service Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-900">{t('order_select_service_label')}</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {([
                  { id: 'Testing', icon: TestTube, label: t('order_service_testing') },
                  { id: 'Publishing', icon: Rocket, label: t('order_service_publishing') },
                  { id: 'Promotion_5Star', icon: Star, label: t('order_service_promotion') },
                  { id: 'WebTesting', icon: MonitorCheck, label: t('order_service_webtest') },
                  { id: 'WebDesign', icon: Globe, label: t('order_service_web') },
                  { id: 'AppDevelopment', icon: Code2, label: t('order_service_appdev') },
                  { id: 'AppSEO', icon: TrendingUp, label: t('order_service_aseo') },
                  { id: 'WebSEO', icon: Search, label: t('order_service_wseo') },
                  { id: 'PageManagement', icon: MessageSquare, label: t('order_service_page') },
                ] as { id: ServiceType; icon: typeof Rocket; label: string }[]).map((svc) => {
                  const Icon = svc.icon;
                  const active = serviceType === svc.id;
                  return (
                    <button
                      key={svc.id}
                      type="button"
                      onClick={() => setServiceType(svc.id)}
                      className={`p-3 rounded-xl border text-left text-xs font-extrabold flex items-center gap-2 transition-all ${
                        active
                          ? 'bg-brand-blue text-white border-brand-blue shadow-apple-sm'
                          : 'bg-slate-50 border-slate-300 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{svc.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* App Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">{t('order_app_name_label')}</label>
                <input
                  type="text"
                  required
                  placeholder={t('order_app_name_placeholder')}
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">{t('order_email_label')}</label>
                <input
                  type="email"
                  required
                  placeholder="developer@company.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Testing Link Field */}
            {!isQuoteOnly && (
              <>
              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1 flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-brand-blue" />
                  <span>{t('order_testing_url_label')}</span>
                </label>
                <input
                  type="url"
                  placeholder="https://play.google.com/apps/testing/com.yourcompany.app"
                  value={testingUrl}
                  onChange={(e) => setTestingUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
                />
                <p className="text-[10px] text-slate-600 font-medium mt-1">
                  {t('order_testing_url_hint')}
                </p>
              </div>

              {/* Package / Platform Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">{t('order_select_package_label')}</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as Platform)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-extrabold text-slate-900 focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
                  >
                    {/* iOS từng bị gắn nhãn "Doanh Nghiệp (LIÊN HỆ)" vì App Store
                        chưa có giá niêm yết. Nay App Store là $70, để nhãn cũ thì
                        khách tưởng đang xin báo giá mà lại bị tính tiền. */}
                    <option value="Android">{t('order_package_googleplay')}</option>
                    <option value="iOS">{t('order_package_appstore')}</option>
                    <option value="Both">{t('order_package_both')}</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">{t('order_target_countries_label')}</label>
                  <input
                    type="text"
                    placeholder={t('order_target_countries_placeholder')}
                    value={targetCountries}
                    onChange={(e) => setTargetCountries(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
                  />
                </div>
              </div>
              </>
            )}

            {/* 2-Step Payment Schedule Notice inside Form */}
            {isQuoteOnly ? (
              <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl space-y-1 text-left">
                <div className="flex items-center gap-1.5 text-slate-800 font-extrabold text-[11px]">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span>{t('order_quote_req_label')}</span>
                </div>
                <p className="text-[10px] text-slate-700 font-medium">{t('order_quote_req_hint')}</p>
              </div>
            ) : (
            <div className="p-3 bg-blue-50 border border-blue-300 rounded-xl space-y-1 text-left">
              <div className="flex items-center gap-1.5 text-brand-blue font-extrabold text-[11px]">
                <CreditCard className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                <span>{t('order_flexible_payment_title')}</span>
              </div>
              <p className="text-[10px] text-slate-800 font-medium">
                • {t('order_flex_phase1')}
                <br />
                • {t('order_flex_phase2')}
              </p>
            </div>
            )}

            {/* Google Play Testers Notice inside Form */}
            {!isQuoteOnly && (platform === 'Android' || platform === 'Both') && (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl space-y-1 text-left">
                <div className="flex items-center gap-1.5 text-amber-900 font-extrabold text-[11px]">
                  <Users className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>{t('order_closed_testing_group_title')}</span>
                </div>
                <p className="text-[10px] text-slate-800 font-medium">
                  {t('order_closed_testing_group_desc')}
                </p>
              </div>
            )}

            {/* Details */}
            <div>
              <label className="text-xs font-extrabold text-slate-900 block mb-1">{t('order_details_label')}</label>
              <textarea
                rows={2}
                placeholder={t('order_details_placeholder')}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-brand-blue font-extrabold text-white text-sm shadow-brand-blue hover:bg-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? t('order_submitting') : t('order_submit')}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
