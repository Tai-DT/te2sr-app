'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GlassCard } from '@/components/GlassCard';
import { OrderModal } from '@/components/OrderModal';
import { getTranslation, LanguageCode } from '@/lib/i18n/dictionaries';
import {
  TestTube, Rocket, Star, CheckCircle, Zap,
  ArrowRight, Globe2, ShieldCheck, Timer,
  ChevronRight, TrendingUp, Package, ShieldAlert, BadgeDollarSign, Sparkles, Clock, Lock, Tag, Percent, CreditCard,
} from 'lucide-react';

/* ─── Animated Counter Hook ─── */
function useCounter(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
        observer.disconnect();
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return { count, ref };
}

/* ─── Stat Counter Component ─── */
function StatCounter({ value, suffix, label, color }: { value: number; suffix: string; label: string; color: string }) {
  const { count, ref } = useCounter(value);
  return (
    <div ref={ref} className="text-center p-5">
      <div className={`text-2xl sm:text-4xl font-extrabold font-display ${color} tabular-nums`}>
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-xs text-slate-800 mt-1.5 font-bold leading-tight">{label}</div>
    </div>
  );
}

export default function LandingPage() {
  const [currentLang, setCurrentLang] = useState<LanguageCode>('vi');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [modalInitialService, setModalInitialService] = useState<
    'Testing' | 'Publishing' | 'Promotion_5Star'
  >('Testing');

  const t = (key: string) => getTranslation(currentLang, key);

  const openServiceModal = (service: 'Testing' | 'Publishing' | 'Promotion_5Star') => {
    setModalInitialService(service);
    setIsOrderModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-brand-blue/10 selection:text-brand-blue">
      <Navbar currentLang={currentLang} onLanguageChange={setCurrentLang} />

      <main className="flex-1">

        {/* ════════════════════════════
            HERO SECTION (Apple/Samsung Light)
        ════════════════════════════ */}
        <section className="relative pt-16 md:pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-white to-white overflow-hidden">

          {/* Grid Background */}
          <div className="absolute inset-0 hero-grid-bg opacity-40 pointer-events-none" />

          <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">

            {/* Announcement Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-50 border border-blue-300 text-brand-blue text-xs font-extrabold tracking-wide shadow-apple-sm">
              <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
              <span>💳 THANH TOÁN 2 ĐỢT: 50% KHI HOÀN THÀNH 12 TESTERS (14 NGÀY) & 50% KHI APP LIVE!</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-70" />
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-display leading-[1.1] tracking-tight text-slate-900">
                Đưa App Của Bạn{' '}
                <br className="hidden sm:block" />
                <span className="text-brand-blue">
                  Lên Top Store
                </span>
              </h1>
              <p className="text-base sm:text-xl text-slate-800 max-w-2xl mx-auto leading-relaxed font-medium">
                Cung cấp giải pháp kiểm thử toàn diện & đưa app lên App Store/Google Play. <strong>Thanh toán 50% sau khi cài 12 testers đếm 14 ngày & 50% còn lại khi app live thành công!</strong>
              </p>
            </div>

            {/* 100% Refund, Security & 2-Step Payment Schedule Policy Banners */}
            <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-300 text-brand-blue text-xs font-extrabold flex items-center justify-center gap-2 shadow-apple-sm">
                <CreditCard className="w-4 h-4 text-brand-blue shrink-0" />
                <span>Thanh toán 50% đếm 14 ngày + 50% khi app live</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-extrabold flex items-center justify-center gap-2 shadow-apple-sm">
                <BadgeDollarSign className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Hoàn tiền 100% nếu trượt cam kết</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-extrabold flex items-center justify-center gap-2 shadow-apple-sm">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                <span>KHÔNG nhận app lừa đảo / cờ bạc</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={() => openServiceModal('Publishing')}
                className="group w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-blue hover:bg-blue-600 text-white font-extrabold text-sm shadow-brand-blue hover:scale-[1.02] transition-all flex items-center justify-center gap-2.5 active:scale-95"
              >
                <Rocket className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span>Bắt Đầu Đăng Tải Ngay</span>
              </button>

              <button
                onClick={() => openServiceModal('Testing')}
                className="group w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 font-extrabold text-sm transition-all flex items-center justify-center gap-2.5"
              >
                <TestTube className="w-4 h-4 text-brand-blue group-hover:scale-110 transition-transform" />
                <span>Kiểm Thử App Ngay</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-800 pt-4">
              {[
                { icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />, text: 'Bảo mật 100% tài khoản Dev' },
                { icon: <Timer className="w-4 h-4 text-brand-blue" />, text: 'Xử lý trong 24h' },
                { icon: <Globe2 className="w-4 h-4 text-slate-800" />, text: '50+ Quốc gia' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-300 shadow-apple-sm">
                  {item.icon}
                  <span className="font-bold text-slate-900">{item.text}</span>
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
                features: ['Apple & Google Developer Console', 'Tích hợp cổng thanh toán & API', 'Thanh toán 2 đợt (50% - 50%)', 'Giảm 50% khi chỉ đăng 1 Store'],
                cta: 'Đăng Tải App Ngay',
                glow: 'blue' as const,
              },
              {
                service: 'Promotion_5Star' as const,
                icon: <Star className="w-6 h-6 text-amber-500" />,
                iconBg: 'bg-amber-50 border-amber-200',
                title: '⭐️ Gói Đánh Giá 5 Sao (Tặng Kèm 10 Reviews)',
                desc: 'Hiện tại tất cả các gói dịch vụ đều được tặng kèm 10 đánh giá 5 sao thực tế giúp app xây dựng uy tín ban đầu trên Store.',
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
            PRICING SECTION ($50 / $100 / $200 + 50%-50% SCHEDULE)
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
              Thanh toán linh hoạt: <strong>50% sau khi kết nối 12 testers đếm 14 ngày & 50% còn lại khi app live trên Store.</strong> (Giảm 50% nếu chỉ đăng tải 1 Store).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Starter ($50) */}
            <div className="bg-white rounded-2xl border border-slate-300 p-7 flex flex-col justify-between space-y-6 shadow-apple-sm card-shine">
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-700">Gói Khởi Động</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-5xl font-extrabold font-display text-slate-900">$50</span>
                    <span className="text-xs text-slate-700 font-bold">/ 1 store</span>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-brand-blue text-[11px] font-extrabold">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Thanh toán 2 đợt ($25 + $25)</span>
                  </div>
                </div>
                <div className="border-t border-slate-200" />
                <ul className="space-y-3 text-xs text-slate-900 font-bold">
                  {[
                    'Đưa app lên App Store HOẶC Google Play',
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
                Chọn Gói Starter ($50)
              </button>
            </div>

            {/* Standard / Pro ($100 - Featured) */}
            <div className="relative bg-white rounded-2xl border-2 border-brand-blue p-7 flex flex-col justify-between space-y-6 shadow-apple-md card-shine">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 rounded-full bg-brand-blue text-white text-[11px] font-extrabold tracking-wider shadow-brand-blue whitespace-nowrap">
                  ⭐ PHỔ BIẾN NHẤT
                </span>
              </div>
              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-brand-blue">Gói Tiêu Chuẩn</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-6xl font-extrabold font-display text-slate-900">$100</span>
                    <span className="text-xs text-slate-700 font-bold">/ cả 2 stores</span>
                  </div>
                  {/* 50% discount callout badge */}
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-[11px] font-extrabold">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>Thanh toán: $50 (12 testers 14 ngày) + $50 (Store live)</span>
                  </div>
                </div>
                <div className="border-t border-slate-200" />
                <ul className="space-y-3 text-xs text-slate-900 font-bold">
                  {[
                    'Đăng tải CẢ 2 Store ($100) hoặc 1 Store ($50)',
                    '🐞 BÁO LỖI & phân tích Crash log chi tiết',
                    '💳 TÍCH HỢP CỔNG thanh toán & API',
                    '12 Testers thực tế cài đặt đủ 14 ngày',
                    '🎁 TẶNG 10 Đánh giá 5★ chất lượng',
                    '🔒 Bảo mật 100% an toàn tài khoản Dev',
                    'Hoàn tiền 100% nếu trượt',
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
                Đăng Ký Gói Tiêu Chuẩn ($100 / $50)
              </button>
            </div>

            {/* Advanced / Premium ($200) */}
            <div className="bg-white rounded-2xl border border-slate-300 p-7 flex flex-col justify-between space-y-6 shadow-apple-sm card-shine">
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-900">Gói Nâng Cao</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-5xl font-extrabold font-display text-slate-900">$200</span>
                    <span className="text-xs text-slate-700 font-bold">/ cả 2 stores</span>
                  </div>
                  {/* 50% discount callout badge */}
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-[11px] font-extrabold">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>Thanh toán: $100 (12 testers 14 ngày) + $100 (Store live)</span>
                  </div>
                </div>
                <div className="border-t border-slate-200" />
                <ul className="space-y-3 text-xs text-slate-900 font-bold">
                  {[
                    '🛠️ TRỰC TIẾP FIX LỖI (Sửa code & giao diện)',
                    '🎨 KIỂM TRA UI/UX chuyên sâu tiêu chuẩn Apple/Google',
                    '🧪 FULL TEST với 12 testers thực tế đủ 14 ngày',
                    '🐞 BÁO LỖI chi tiết & phân tích hiệu năng',
                    'Đăng tải CẢ 2 Store ($200) hoặc 1 Store ($100)',
                    '🎁 TẶNG 10 Đánh giá 5★ theo ngôn ngữ chỉ định',
                    '🔒 Bảo mật 100% an toàn tài khoản Dev',
                    'Hoàn tiền 100% nếu trượt cam kết',
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
                className="w-full py-3.5 rounded-xl bg-slate-100 border border-slate-300 text-slate-900 font-extrabold text-xs hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all"
              >
                Tư Vấn Gói Nâng Cao ($200 / $100)
              </button>
            </div>
          </div>

          {/* Security & Account Safety Guarantee Card */}
          <div className="max-w-4xl mx-auto bg-blue-50 border border-blue-300 rounded-2xl p-6 shadow-apple-sm grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="md:col-span-2 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-300 text-brand-blue text-[11px] font-extrabold uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5 text-brand-blue" />
                <span>Bảo Mật Tuyệt Đối</span>
              </div>
              <h4 className="text-base font-extrabold text-slate-900">🔒 Cam Kết 100% An Toàn Cho Tài Khoản Developer</h4>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                TE2SR tuân thủ nghiêm ngặt các quy trình bảo mật dữ liệu. Thông tin tài khoản Apple Developer & Google Play Console của khách hàng được mã hóa an toàn, ký cam kết NDA và không bao giờ chia sẻ cho bên thứ ba.
              </p>
            </div>
            <div className="flex flex-col gap-2 justify-center">
              <div className="p-3 bg-white rounded-xl border border-blue-200 text-xs font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Mã hóa thông tin tài khoản</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-blue-200 text-xs font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Ký hợp đồng bảo mật NDA</span>
              </div>
            </div>
          </div>

          {/* Coming Soon Notice for Large Review Packages */}
          <div className="max-w-2xl mx-auto bg-amber-50 border border-amber-300 rounded-2xl p-5 text-center space-y-2 shadow-apple-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-200 text-amber-900 text-[11px] font-extrabold uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>Sắp Ra Mắt (Coming Soon)</span>
            </div>
            <h4 className="text-sm font-extrabold text-slate-900">⚡ Gói Tăng Đánh Giá 5★ Số Lượng Lớn</h4>
            <p className="text-xs text-slate-800 leading-relaxed font-semibold">
              Hiện tại TE2SR đang áp dụng ưu đãi <strong>tặng kèm 10 đánh giá 5★</strong> cho tất cả các gói dịch vụ ($50, $100, $200). Dịch vụ boost đánh giá số lượng lớn (hàng trăm/hàng nghìn review) hiện đang hoàn thiện quy trình an toàn và sẽ chính thức ra mắt trong thời gian tới!
            </p>
          </div>
        </section>

        {/* ════════════════════════════
            PROCESS / HOW IT WORKS
        ════════════════════════════ */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-24 space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-block px-4 py-1.5 rounded-full bg-slate-100 border border-slate-300 text-xs text-slate-900 font-extrabold uppercase tracking-wider">
              Quy Trình Triển Khai
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900">
              Chỉ 3 Bước Đơn Giản
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              { step: '01', title: 'Gửi Yêu Cầu', desc: 'Điền form đơn hàng với thông tin app, chọn gói & lựa chọn 1 Store hoặc cả 2 Store.', icon: <Package className="w-6 h-6 text-brand-blue" /> },
              { step: '02', title: 'Hoàn Thành 12 Testers (Đợt 1 50%)', desc: 'Đội ngũ TE2SR cài 12 testers, đếm 14 ngày & nhận 50% đợt 1.', icon: <Zap className="w-6 h-6 text-slate-900" /> },
              { step: '03', title: 'App Live & Tất Toán (Đợt 2 50%)', desc: 'App lên Store thành công. Tất toán 50% còn lại, nhận 10 đánh giá 5★.', icon: <TrendingUp className="w-6 h-6 text-emerald-600" /> },
            ].map((step, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-300 p-8 text-center space-y-4 shadow-apple-sm card-shine">
                <div className="relative mx-auto w-14 h-14">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-300 flex items-center justify-center shadow-apple-sm">
                    {step.icon}
                  </div>
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-extrabold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-base font-extrabold text-slate-900">{step.title}</h3>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer currentLang={currentLang} />

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        currentLang={currentLang}
        initialService={modalInitialService}
      />
    </div>
  );
}
