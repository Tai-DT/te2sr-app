'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GlassCard } from '@/components/GlassCard';
import { OrderModal } from '@/components/OrderModal';
import { LanguageCode, getTranslation } from '@/lib/i18n/dictionaries';
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
    <div className="text-center p-4">
      <div className={`text-3xl sm:text-4xl font-extrabold font-display ${color}`}>
        {value.toLocaleString()}{suffix}
      </div>
      <div className="text-xs text-slate-700 font-extrabold mt-1">{label}</div>
    </div>
  );
}

export default function HomePage() {
  const [currentLang, setCurrentLang] = useState<LanguageCode>('vi');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [initialService, setInitialService] = useState<
    'Testing' | 'Publishing' | 'Promotion_5Star' | 'DesignAnalyzer'
  >('Testing');

  const t = (key: string) => getTranslation(currentLang, key);

  const openServiceModal = (service: 'Testing' | 'Publishing' | 'Promotion_5Star' | 'DesignAnalyzer') => {
    setInitialService(service);
    setIsOrderModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-brand-blue selection:text-white">
      {/* Navbar */}
      <Navbar currentLang={currentLang} onLanguageChange={setCurrentLang} />

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
                <span>💳 THANH TOÁN 2 ĐỢT: 50% KHI HOÀN THÀNH 12 TESTERS (14 NGÀY) & 50% KHI APP LIVE!</span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-4 max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-display tracking-tight text-slate-900 leading-[1.1]">
                Đưa App Của Bạn <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-blue-600">
                  Lên Top Store
                </span>
              </h1>

              <p className="text-base sm:text-xl text-slate-800 max-w-2xl mx-auto font-medium leading-relaxed">
                Cung cấp giải pháp kiểm thử toàn diện & đưa app lên App Store/Google Play. <strong>Thanh toán 50% sau khi cài 12 testers đếm 14 ngày & 50% còn lại khi app live thành công!</strong>
              </p>
            </div>

            {/* Key Value Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-extrabold flex items-center gap-2 shadow-apple-sm">
                <CreditCard className="w-4 h-4 text-brand-blue" />
                <span>Thanh toán 50% đếm 14 ngày + 50% khi app live</span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-extrabold flex items-center gap-2 shadow-apple-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Hoàn tiền 100% nếu trượt cam kết</span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-extrabold flex items-center gap-2 shadow-apple-sm">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>KHÔNG nhận app lừa đảo / cờ bạc</span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => openServiceModal('Publishing')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-blue hover:bg-blue-600 text-white font-extrabold text-sm transition-all shadow-brand-blue hover:scale-[1.02] flex items-center justify-center gap-2.5"
              >
                <Rocket className="w-4 h-4" />
                <span>Bắt Đầu Đăng Tải Ngay</span>
              </button>

              <button
                onClick={() => openServiceModal('Testing')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-100 border border-slate-300 hover:bg-slate-200 text-slate-900 font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-apple-sm"
              >
                <TestTube className="w-4 h-4 text-brand-blue" />
                <span>Kiểm Thử App Ngay</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-700 font-extrabold">
              {[
                { icon: ShieldCheck, text: 'Bảo mật 100% tài khoản Dev' },
                { icon: Zap, text: 'Xử lý trong 24h' },
                { icon: TrendingUp, text: '50+ Quốc gia' },
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
                <StatCounter value={200} suffix="+" label="App Đã Duyệt Store" color="text-brand-blue" />
                <StatCounter value={2000} suffix="+" label="Đánh Giá 5★ Đã Tặng" color="text-slate-900" />
                <StatCounter value={90} suffix="%" label="Tỷ Lệ Đạt Duyệt Store" color="text-emerald-600" />
                <StatCounter value={8} suffix="+" label="Ngôn Ngữ Toàn Cầu" color="text-amber-600" />
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
              Dịch Vụ Trọng Tâm
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900">
              {t('services_title')}
            </h2>
            <p className="text-sm sm:text-base text-slate-800 max-w-xl mx-auto font-medium">
              Quy trình khép kín giúp ứng dụng đạt tỷ lệ duyệt 90%, chia 2 đợt thanh toán (50% - 50%) & kèm 10 đánh giá 5★ tặng riêng.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                service: 'Testing' as const,
                icon: <TestTube className="w-6 h-6 text-brand-blue" />,
                iconBg: 'bg-blue-50 border-blue-200',
                title: t('svc_testing_title'),
                desc: t('svc_testing_desc'),
                features: ['TestFlight iOS & Android Internal', '12 Testers thực tế đếm 14 ngày', 'Báo cáo Crash, Bug & UI/UX', 'Fix lỗi giao diện nếu cần'],
                cta: 'Khám Phá Kiểm Thử',
                glow: 'blue' as const,
              },
              {
                service: 'Publishing' as const,
                icon: <Rocket className="w-6 h-6 text-slate-900" />,
                iconBg: 'bg-slate-100 border-slate-300',
                title: t('svc_publishing_title'),
                desc: t('svc_publishing_desc'),
                features: ['Apple & Google Developer Console', 'Tích hợp cổng thanh toán & API', 'Thanh toán 2 đợt (50% - 50%)', 'Tối ưu ASO chuẩn duyệt Store'],
                cta: 'Đăng Tải App Ngay',
                glow: 'blue' as const,
              },
              {
                service: 'Promotion_5Star' as const,
                icon: <Star className="w-6 h-6 text-amber-500" />,
                iconBg: 'bg-amber-50 border-amber-200',
                title: '⭐️ Gói Đánh Giá 5 Sao (Tặng Kèm 10 Reviews)',
                desc: 'Tất cả các gói dịch vụ đều được tặng kèm 10 đánh giá 5 sao thực tế giúp app xây dựng uy tín ban đầu trên Store.',
                features: ['Tặng 10 Đánh Giá 5★ Người Dùng Thật', 'Tối Ưu Keyword ASO Cơ Bản', 'Đánh giá theo ngôn ngữ chỉ định', 'Gói số lượng lớn sẽ ra mắt sau ⏳'],
                cta: 'Đăng Ký Nhận 10★',
                glow: 'magenta' as const,
              },
            ].map((svc, i) => (
              <GlassCard key={i} glow={svc.glow} className="flex flex-col justify-between h-full group card-shine border-slate-300">
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${svc.iconBg} transition-transform group-hover:scale-110 shadow-apple-sm`}>
                    {svc.icon}
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 font-display">{svc.title}</h3>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">{svc.desc}</p>
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
              Bảng Giá & Quy Trình Thanh Toán 2 Đợt
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900">
              Bảng Giá Dịch Vụ Mới
            </h2>
            <p className="text-sm sm:text-base text-slate-800 max-w-xl mx-auto font-medium">
              Thanh toán linh hoạt: <strong>50% sau khi kết nối 12 testers đếm 14 ngày & 50% còn lại khi app live trên Store.</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Starter ($50 - Google Play) */}
            <div className="bg-white rounded-2xl border border-slate-300 p-7 flex flex-col justify-between space-y-6 shadow-apple-sm card-shine">
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-700">Đăng Tải Google Play</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-5xl font-extrabold font-display text-slate-900">$50</span>
                    <span className="text-xs text-slate-700 font-bold">/ Android App</span>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-brand-blue text-[11px] font-extrabold">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Thanh toán 2 đợt ($25 + $25)</span>
                  </div>
                </div>
                <div className="border-t border-slate-200" />
                <ul className="space-y-3 text-xs text-slate-900 font-bold">
                  {[
                    'Đưa app lên Google Play Console',
                    'Cài 12 testers thực tế đếm 14 ngày',
                    '🎁 TẶNG 10 Đánh giá 5★ chất lượng',
                    'Tối ưu Metadata ASO cơ bản',
                    '🔒 Bảo mật 100% an toàn tài khoản',
                    'Hoàn tiền 100% nếu không đạt',
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
                Chọn Gói Google Play ($50)
              </button>
            </div>

            {/* Standard ($100 - Featured Cả 2 Store) */}
            <div className="relative bg-white rounded-2xl border-2 border-brand-blue p-7 flex flex-col justify-between space-y-6 shadow-apple-md card-shine">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 rounded-full bg-brand-blue text-white text-[11px] font-extrabold tracking-wider shadow-brand-blue whitespace-nowrap">
                  ⭐ PHỔ BIẾN NHẤT
                </span>
              </div>
              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-brand-blue">Gói Cả 2 Store</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-6xl font-extrabold font-display text-slate-900">$100</span>
                    <span className="text-xs text-slate-700 font-bold">/ cả 2 stores</span>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-brand-blue text-[11px] font-extrabold">
                    <CreditCard className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                    <span>Thanh toán 2 đợt ($50 + $50)</span>
                  </div>
                </div>
                <div className="border-t border-slate-200" />
                <ul className="space-y-3 text-xs text-slate-900 font-bold">
                  {[
                    'Đăng tải CẢ 2 Store: Google Play & iOS App Store',
                    '12 Testers Google Play (14 ngày) + TestFlight iOS',
                    '🐞 BÁO LỖI & phân tích Crash log chi tiết',
                    '💳 TÍCH HỢP CỔNG thanh toán & API',
                    '🎁 TẶNG 10 Đánh giá 5★ chất lượng',
                    '🔒 Bảo mật 100% an toàn tài khoản Dev',
                    'Hoàn tiền 100% nếu trượt cam kết',
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
                Đăng Ký Cả 2 Store ($100)
              </button>
            </div>

            {/* Enterprise (LIÊN HỆ) */}
            <div className="bg-white rounded-2xl border border-slate-300 p-7 flex flex-col justify-between space-y-6 shadow-apple-sm card-shine">
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-900">Gói Doanh Nghiệp</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-extrabold font-display text-slate-900">LIÊN HỆ</span>
                    <span className="text-xs text-slate-700 font-bold">/ custom plan</span>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-extrabold">
                    <PhoneCall className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Tư vấn 1-1 riêng với Kỹ sư Trưởng</span>
                  </div>
                </div>
                <div className="border-t border-slate-200" />
                <ul className="space-y-3 text-xs text-slate-900 font-bold">
                  {[
                    'Đăng tải Đa Ứng Dụng / Số Lượng Lớn',
                    '🛠️ TRỰC TIẾP FIX LỖI (Sửa code & giao diện)',
                    '🎨 KIỂM TRA UI/UX chuyên sâu tiêu chuẩn Apple/Google',
                    '🧪 FULL TEST với 20+ thiết bị thực tế',
                    '🐞 BÁO LỖI chi tiết & phân tích hiệu năng',
                    '🎁 TẶNG 10 Đánh giá 5★ theo ngôn ngữ chỉ định',
                    '🔒 Bảo mật 100% an toàn tài khoản Dev',
                    'Hợp đồng bảo mật NDA & Cam kết SLA',
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
                Liên Hệ Tư Vấn Doanh Nghiệp
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer currentLang={currentLang} />

      {/* Modals */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        currentLang={currentLang}
        initialService={initialService}
      />
    </div>
  );
}
