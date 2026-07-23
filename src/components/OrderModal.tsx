'use client';

import React, { useState } from 'react';
import { getTranslation, LanguageCode } from '@/lib/i18n/dictionaries';
import { X, CheckCircle2, Send, Rocket, TestTube, Star, BadgeDollarSign, ShieldCheck, Tag, Percent, Users, Copy, Check, CreditCard, Link2 } from 'lucide-react';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: LanguageCode;
  initialService?: 'Testing' | 'Publishing' | 'Promotion_5Star' | 'DesignAnalyzer';
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  initialService = 'Testing',
}) => {
  const [appName, setAppName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [platform, setPlatform] = useState<'iOS' | 'Android' | 'Both'>('Both');
  const [serviceType, setServiceType] = useState<
    'Testing' | 'Publishing' | 'Promotion_5Star' | 'DesignAnalyzer'
  >(initialService);
  const [targetCountries, setTargetCountries] = useState('Vietnam, USA, Japan');
  const [testingUrl, setTestingUrl] = useState('');
  const [details, setDetails] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<any>(null);
  const [copiedGroup, setCopiedGroup] = useState(false);

  const googleGroupEmail = 'te2sr@googlegroups.com';

  const t = (key: string) => getTranslation(currentLang, key);

  if (!isOpen) return null;

  const handleCopyGroup = () => {
    navigator.clipboard.writeText(googleGroupEmail);
    setCopiedGroup(true);
    setTimeout(() => setCopiedGroup(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          serviceType,
          targetCountries: targetCountries.split(',').map((s) => s.trim()),
          testingUrl,
          details,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedOrder(data.order);
      }
    } catch (err) {
      console.error(err);
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
                Đã Gửi Yêu Cầu Thành Công!
              </h3>
              <p className="text-xs text-slate-700 font-semibold mt-1">
                Mã đơn hàng của bạn: <span className="font-mono font-extrabold text-brand-blue">{submittedOrder.id}</span>
              </p>
            </div>

            {/* 2-Step Payment Schedule Notice */}
            <div className="p-4 bg-blue-50 border border-blue-300 rounded-2xl text-left space-y-2 shadow-apple-sm">
              <div className="flex items-center gap-2 text-brand-blue font-extrabold text-xs">
                <CreditCard className="w-4 h-4 text-brand-blue shrink-0" />
                <span>💳 Quy Trình Thanh Toán 2 Đợt (50% - 50%)</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-900 font-semibold">
                <li className="flex items-start gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-blue-200 text-brand-blue font-extrabold text-[10px]">Đợt 1 (50%)</span>
                  <span>Thanh toán 50% sau khi cài 12 testers & nhận Link Kiểm Thử để bắt đầu đếm 14 ngày.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-800 font-extrabold text-[10px]">Đợt 2 (50%)</span>
                  <span>Thanh toán 50% còn lại sau khi app lên thành công (Duyệt live trên Store).</span>
                </li>
              </ul>
            </div>

            {/* Google Play Tester Group Notice */}
            {(submittedOrder.platform === 'Android' || submittedOrder.platform === 'Both') && (
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-left space-y-2 shadow-apple-sm">
                <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs">
                  <Users className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>🤖 Hướng Dẫn Kích Hoạt 12 Testers (14 Ngày)</span>
                </div>
                <p className="text-[11px] text-slate-800 leading-relaxed font-semibold">
                  1. Thêm email Google Group vào mục <strong>Closed Testing (Kiểm thử kín)</strong> trong Google Play Console:
                </p>
                <div className="flex items-center justify-between p-2.5 bg-white border border-amber-300 rounded-xl">
                  <span className="font-mono text-xs font-extrabold text-brand-blue select-all">{googleGroupEmail}</span>
                  <button
                    onClick={handleCopyGroup}
                    className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-[11px] flex items-center gap-1 transition-colors"
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
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-extrabold flex items-center justify-center gap-2 shadow-apple-sm">
              <BadgeDollarSign className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Cam kết HOÀN TIỀN 100% nếu không đáp ứng đúng yêu cầu dịch vụ.</span>
            </div>

            {/* Payment Information Gateways */}
            <div className="bg-slate-50 border border-slate-300 rounded-2xl p-4 text-left space-y-3 text-xs">
              <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center justify-between">
                <span>💳 Thông Tin Thanh Toán Đợt 1 (50%)</span>
                <span className="text-[10px] text-amber-700 font-extrabold">Check thủ công 15m</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {/* Timo Bank Vietnam */}
                <div className="p-3 bg-white border border-emerald-300 rounded-xl space-y-1">
                  <div className="font-extrabold text-emerald-800 flex items-center gap-1.5">
                    <span>🇻🇳 Ngân Hàng Timo (Việt Nam)</span>
                  </div>
                  <div className="text-[11px] text-slate-700 font-medium">
                    STK: <strong className="text-slate-900 font-mono font-extrabold">9007041001234</strong>
                  </div>
                  <div className="text-[11px] text-slate-700 font-medium">
                    Chủ TK: <strong className="text-slate-900 font-extrabold">TE2SR PLATFORM CO</strong>
                  </div>
                  <div className="text-[10px] text-slate-600 pt-0.5">
                    Nội dung: <span className="text-brand-blue font-mono font-extrabold">{submittedOrder.id} (50%)</span>
                  </div>
                </div>

                {/* Binance Pay Global */}
                <div className="p-3 bg-white border border-amber-300 rounded-xl space-y-1">
                  <div className="font-extrabold text-amber-800 flex items-center gap-1.5">
                    <span>🌐 Binance Pay / USDT (Quốc Tế)</span>
                  </div>
                  <div className="text-[11px] text-slate-700 font-medium">
                    Binance ID: <strong className="text-slate-900 font-mono font-extrabold">892100456</strong>
                  </div>
                  <div className="text-[11px] text-slate-700 font-medium">
                    Mạng: <strong className="text-slate-900 font-mono font-extrabold">USDT (TRC20 / BEP20)</strong>
                  </div>
                  <div className="text-[10px] text-slate-600 pt-0.5">
                    Memo: <span className="text-brand-blue font-mono font-extrabold">{submittedOrder.id} (50%)</span>
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-slate-700 text-center italic font-semibold pt-1">
                Sau khi thanh toán đợt 1, kỹ thuật viên sẽ đối soát đơn <span className="text-brand-blue font-mono font-bold">{submittedOrder.id}</span> và kích hoạt đếm 14 ngày ngay!
              </p>
            </div>

            <button
              onClick={resetForm}
              className="w-full py-3 rounded-xl bg-brand-blue text-white font-extrabold text-xs shadow-brand-blue hover:bg-blue-600 transition-all"
            >
              Hoàn Tất & Xem Tiến Độ
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900 font-display flex items-center gap-2">
                <Rocket className="w-5 h-5 text-brand-blue" />
                <span>Đăng Ký Dịch Vụ TE2SR</span>
              </h3>
              <p className="text-xs text-slate-800 font-medium">
                Thanh toán 50% sau khi cài 12 testers đếm 14 ngày & 50% còn lại khi app live trên Store.
              </p>
            </div>

            {/* Service Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-900">Chọn Dịch Vụ Muốn Đăng Ký</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setServiceType('Testing')}
                  className={`p-3 rounded-xl border text-left text-xs font-extrabold flex items-center gap-2 transition-all ${
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
                  className={`p-3 rounded-xl border text-left text-xs font-extrabold flex items-center gap-2 transition-all ${
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
                  className={`p-3 rounded-xl border text-left text-xs font-extrabold flex items-center gap-2 transition-all ${
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
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Tên App / Dự Án</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: CryptoPulse App"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Email Liên Hệ</label>
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

            {/* Testing Link Field (New) */}
            <div>
              <label className="text-xs font-extrabold text-slate-900 block mb-1 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-brand-blue" />
                <span>Link Kiểm Thử (Google Play / TestFlight Opt-in URL)</span>
              </label>
              <input
                type="url"
                placeholder="https://play.google.com/apps/testing/com.yourcompany.app"
                value={testingUrl}
                onChange={(e) => setTestingUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
              />
              <p className="text-[10px] text-slate-600 font-medium mt-1">
                📌 Dán link tham gia kiểm thử kín để kỹ sư TE2SR vào test & tính 14 ngày ngay.
              </p>
            </div>

            {/* Platform & 50% Discount Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-extrabold text-slate-900">Nền Tảng Đăng Tải</label>
                  {platform !== 'Both' && (
                    <span className="text-[10px] font-extrabold text-emerald-600">🏷️ GIẢM 50%</span>
                  )}
                </div>
                <select
                  value={platform}
                  onChange={(e: any) => setPlatform(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-extrabold text-slate-900 focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
                >
                  <option value="Both">Cả 2 Store (iOS & Android) - Giá Chuẩn</option>
                  <option value="iOS">Chỉ iOS App Store - GIẢM NGAY 50%</option>
                  <option value="Android">Chỉ Android Google Play - GIẢM NGAY 50%</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Quốc Gia Mục Tiêu</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Việt Nam, Mỹ, Nhật Bản"
                  value={targetCountries}
                  onChange={(e) => setTargetCountries(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* 2-Step Payment Schedule Notice inside Form */}
            <div className="p-3 bg-blue-50 border border-blue-300 rounded-xl space-y-1 text-left">
              <div className="flex items-center gap-1.5 text-brand-blue font-extrabold text-[11px]">
                <CreditCard className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                <span>Thanh Toán Linh Hoạt 2 Đợt (50% - 50%):</span>
              </div>
              <p className="text-[10px] text-slate-800 font-medium">
                • <strong>Đợt 1 (50%):</strong> Thanh toán sau khi kết nối 12 testers & gửi link kiểm thử đếm 14 ngày.
                <br />
                • <strong>Đợt 2 (50%):</strong> Thanh toán sau khi app live thành công trên Store.
              </p>
            </div>

            {/* Google Play Testers Notice inside Form */}
            {(platform === 'Android' || platform === 'Both') && (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl space-y-1 text-left">
                <div className="flex items-center gap-1.5 text-amber-900 font-extrabold text-[11px]">
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
              <label className="text-xs font-extrabold text-slate-900 block mb-1">Ghi Chú Hoặc Yêu Cầu Đặc Biệt</label>
              <textarea
                rows={2}
                placeholder="Mô tả mục tiêu (ví dụ: đăng tải 1 store duy nhất để nhận ưu đãi giảm 50%...)"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-brand-blue font-extrabold text-white text-sm shadow-brand-blue hover:bg-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang Gửi Dữ Liệu...' : 'Gửi Yêu Cầu Ngay'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
