'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { OrderModal } from '@/components/OrderModal';
import { ShareButtons } from '@/components/ShareButtons';
import { GooglePlayGlyph } from '@/components/brand/StoreGlyphs';
import { useLanguage } from '@/lib/useLanguage';
import { CLOSED_TESTING_FAQS } from '@/lib/faq';
import {
  CheckCircle,
  ChevronRight,
  AlertTriangle,
  Users,
  CalendarDays,
  Rocket,
  Copy,
  Check,
} from 'lucide-react';

const GROUP_EMAIL = 'te2sr@googlegroups.com';

const STEPS = [
  {
    n: '1',
    title: 'Tạo bản build và đưa lên Closed testing',
    body: 'Trong Google Play Console, vào Test and release → Testing → Closed testing, tạo một track (ví dụ "Alpha") và tải bản AAB lên. Điền đầy đủ App content, Store listing và Content rating trước — thiếu mục nào track sẽ không chạy được.',
  },
  {
    n: '2',
    title: 'Thêm danh sách tester bằng Google Group',
    body: `Ở tab Testers, chọn cách thêm bằng Google Groups và dán email nhóm. Dùng Google Group thay vì nhập từng email giúp bạn thêm/bớt tester mà không cần tạo bản phát hành mới. Với TE2SR, bạn chỉ cần thêm ${GROUP_EMAIL}.`,
  },
  {
    n: '3',
    title: 'Gửi link kiểm thử (opt-in URL) cho tester',
    body: 'Play Console sinh ra một "Copy link" dạng play.google.com/apps/testing/<package-name>. Tester phải mở link này, bấm "Become a tester" rồi cài app từ Google Play — cài file APK ngoài luồng KHÔNG được tính.',
  },
  {
    n: '4',
    title: 'Giữ đủ 12 tester opt-in liên tục 14 ngày',
    body: 'Đây là phần khiến hầu hết dự án trượt. Google đếm số tester đang opt-in, không phải số lượt cài. Nếu có người rời nhóm hoặc gỡ opt-in làm số tụt xuống dưới 12, bộ đếm 14 ngày sẽ quay lại từ đầu.',
  },
  {
    n: '5',
    title: 'Nộp đơn xin production access',
    body: 'Sau khi đủ 14 ngày liên tục, mục Production access sẽ mở. Bạn điền bảng câu hỏi về quá trình test (bạn học được gì, thay đổi gì sau phản hồi) rồi nộp. Google thường phản hồi trong vài ngày đến 1–2 tuần.',
  },
];

export function ClosedTestingGuide({ shareUrl }: { shareUrl: string }) {
  const [currentLang, setCurrentLang] = useLanguage();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyGroup = () => {
    navigator.clipboard?.writeText(GROUP_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Navbar currentLang={currentLang} onLanguageChange={setCurrentLang} />

      <main className="flex-1">
        <nav aria-label="Breadcrumb" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <ol className="flex items-center gap-1.5 text-xs text-slate-500">
            <li>
              <Link href="/" className="hover:text-brand-blue transition-colors">
                Trang chủ
              </Link>
            </li>
            <ChevronRight className="w-3 h-3" aria-hidden />
            <li className="text-slate-900 font-medium">Closed testing Google Play</li>
          </ol>
        </nav>

        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
          <header className="space-y-5">
            <div className="flex items-center gap-2">
              <GooglePlayGlyph size={20} />
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-blue">
                Hướng dẫn Google Play
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.1]">
              Closed testing Google Play: đủ 12 testers trong 14 ngày
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed">
              Tài khoản Google Play cá nhân đăng ký từ 13/11/2023 phải chạy closed testing với{' '}
              <strong className="text-slate-900">tối thiểu 12 tester opt-in liên tục 14 ngày</strong>{' '}
              trước khi được mở production access. Đây là hướng dẫn đầy đủ quy trình, kèm lý do đồng
              hồ 14 ngày hay bị reset.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: Users, label: '12 tester', sub: 'đang opt-in, không phải lượt cài' },
                { icon: CalendarDays, label: '14 ngày', sub: 'liên tục, tụt là reset' },
                { icon: Rocket, label: 'Production', sub: 'mở sau khi đạt đủ' },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <s.icon className="w-4 h-4 text-brand-blue mb-1.5" aria-hidden />
                  <p className="text-sm font-semibold text-slate-900">{s.label}</p>
                  <p className="text-[11px] text-slate-500 leading-snug">{s.sub}</p>
                </div>
              ))}
            </div>
          </header>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Closed testing là gì?</h2>
            <p className="text-slate-700 leading-relaxed">
              Closed testing (kiểm thử kín) là kênh phát hành giới hạn trong Google Play Console, nơi
              chỉ những người bạn mời mới tải được app. Google dùng giai đoạn này để xác nhận app đã
              được người thật dùng thử và nhà phát triển có phản hồi để cải thiện, trước khi cho phép
              phát hành công khai.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Với tài khoản <strong>cá nhân</strong> (personal), đây là bước bắt buộc. Tài khoản{' '}
              <strong>tổ chức</strong> (organization) đã xác minh doanh nghiệp thì không bị áp yêu cầu
              12 tester này.
            </p>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl font-bold tracking-tight">
              Quy trình 5 bước để đạt yêu cầu 12 testers / 14 ngày
            </h2>
            <ol className="space-y-4">
              {STEPS.map((s) => (
                <li key={s.n} className="flex gap-4">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-brand-blue text-white text-sm font-bold flex items-center justify-center">
                    {s.n}
                  </span>
                  <div className="space-y-1.5 pt-0.5">
                    <h3 className="text-base font-semibold text-slate-900">{s.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 space-y-2.5">
            <h2 className="text-base font-semibold text-amber-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden />
              Vì sao đồng hồ 14 ngày bị reset?
            </h2>
            <ul className="space-y-2 text-sm text-amber-900/90">
              {[
                'Số tester đang opt-in tụt xuống dưới 12 (có người rời nhóm hoặc bấm "Leave the test").',
                'Tester chỉ cài file APK gửi tay mà không opt-in qua link kiểm thử — Google không tính.',
                'Track closed testing bị tạm dừng (pause) hoặc bản phát hành bị gỡ giữa chừng.',
                'Đổi sang track khác giữa chừng thay vì giữ nguyên một track xuyên suốt.',
              ].map((x) => (
                <li key={x} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-700 shrink-0" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Cách TE2SR làm giúp bạn</h2>
            <p className="text-slate-700 leading-relaxed">
              Bạn không cần đi tìm đủ 12 người quen chịu giữ app suốt 14 ngày. TE2SR cung cấp đội
              tester thật, opt-in qua đúng link kiểm thử của bạn và giữ liên tục cho đến khi đủ điều
              kiện. Bạn chỉ cần làm một việc: thêm Google Group của chúng tôi vào track.
            </p>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3">
              <p className="text-sm font-semibold text-slate-900">
                Thêm email này vào Closed testing → Testers → Google Groups:
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap px-3.5 py-2.5 rounded-xl bg-white border border-slate-300">
                <code className="font-mono text-sm font-semibold text-brand-blue select-all">
                  {GROUP_EMAIL}
                </code>
                <button
                  type="button"
                  onClick={copyGroup}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold inline-flex items-center gap-1.5 transition-colors"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden />
                  ) : (
                    <Copy className="w-3.5 h-3.5" aria-hidden />
                  )}
                  {copied ? 'Đã chép' : 'Chép email'}
                </button>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sau đó gửi <strong>link kiểm thử (opt-in URL)</strong> cho chúng tôi. Bạn chỉ thanh
                toán đợt 1 (50%) khi đã có đủ 12 tester chạy thật và đồng hồ 14 ngày bắt đầu chạy —
                không trả trước.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={() => setIsOrderModalOpen(true)}
                className="px-7 py-3.5 rounded-full bg-brand-blue hover:bg-brand-blueHover text-white font-semibold text-sm shadow-brand-blue transition-colors"
              >
                Đăng ký 12 testers — $50
              </button>
              <Link
                href="/goi/google-play"
                className="px-7 py-3.5 rounded-full bg-white border border-slate-300 hover:border-slate-400 text-slate-900 font-semibold text-sm text-center transition-colors"
              >
                Xem chi tiết gói Google Play
              </Link>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Câu hỏi thường gặp</h2>
            <div className="space-y-3">
              {CLOSED_TESTING_FAQS.map((f) => (
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

          <section className="space-y-3 pt-2 border-t border-slate-200">
            <h2 className="text-base font-semibold text-slate-900">Xem thêm</h2>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/goi/google-play', label: 'Gói đăng tải Google Play — $50' },
                { href: '/goi/ca-2-store', label: 'Gói cả 2 Store (Google Play + App Store) — $100' },
                { href: '/services/testing', label: 'Dịch vụ kiểm thử app đa thiết bị' },
                { href: '/services/publishing', label: 'Dịch vụ đăng tải app lên Store' },
              ].map((l) => (
                <li key={l.href} className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" aria-hidden />
                  <Link href={l.href} className="text-brand-blue hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <ShareButtons url={shareUrl} title="Closed testing Google Play: đủ 12 testers trong 14 ngày" />
        </article>
      </main>

      <Footer currentLang={currentLang} />

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        currentLang={currentLang}
        initialService="Publishing"
        initialPackage="google-play"
      />
    </div>
  );
}
