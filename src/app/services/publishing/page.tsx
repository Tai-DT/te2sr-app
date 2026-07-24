'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GlassCard } from '@/components/GlassCard';
import { OrderModal } from '@/components/OrderModal';
import { LanguageCode } from '@/lib/i18n/dictionaries';
import { Rocket } from 'lucide-react';

export default function PublishingServicePage() {
  const [currentLang, setCurrentLang] = useState<LanguageCode>('vi');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const steps = [
    { n: '01', title: 'Chuẩn Bị Account & Cert', desc: 'Cấu hình Apple Developer ID, Google Play Console, Provisioning Profiles & Signings.' },
    { n: '02', title: 'Tối Ưu Metadata ASO', desc: 'Viết Mô tả, Từ khóa, thiết kế Screenshots chuẩn kích thước 6.7" & iPad Pro.' },
    { n: '03', title: 'Nộp App & Review Cleared', desc: 'Gửi bản build và xử lý phản hồi trực tiếp với đội ngũ App Review của Apple/Google.' },
    { n: '04', title: 'Live & Bảo Hành 100%', desc: 'Ứng dụng chính thức xuất hiện công khai trên 150+ quốc gia với lượt tải mở màn.' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Navbar currentLang={currentLang} onLanguageChange={setCurrentLang} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-brand-blue text-xs font-extrabold">
            <Rocket className="w-4 h-4" />
            <span>Dịch Vụ Đưa App Lên App Store & Google Play</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 leading-tight">
            Đưa Dự Án Lên Chợ Ứng Dụng Toàn Cầu
          </h1>
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
            Hỗ trợ trọn gói từ chuẩn bị chứng chỉ Apple Certificate / Android Keystore, tối ưu từ khóa ASO metadata, đến khi ứng dụng chính thức xuất hiện trên App Store & Google Play.
          </p>
          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-brand-blue hover:bg-blue-600 font-extrabold text-white text-sm shadow-brand-blue hover:scale-[1.02] transition-all"
          >
            Đăng Ký Đăng Tải Ngay
          </button>
        </div>

        {/* Workflow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step) => (
            <GlassCard key={step.n} glow="blue" className="space-y-3">
              <div className="text-brand-blue font-extrabold text-2xl font-display">{step.n}</div>
              <h3 className="font-extrabold text-slate-900 text-base">{step.title}</h3>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">{step.desc}</p>
            </GlassCard>
          ))}
        </div>

        {/* Pricing hint */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center shadow-apple-sm">
          {[
            { title: 'Google Play', price: '$50', note: 'Thanh toán 2 đợt ($25 + $25)' },
            { title: 'Cả 2 Store', price: '$100', note: 'Google Play + iOS App Store' },
            { title: 'Doanh Nghiệp', price: 'Liên Hệ', note: 'Đa ứng dụng / số lượng lớn' },
          ].map((p) => (
            <div key={p.title} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-apple-sm">
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-600">{p.title}</p>
              <p className="text-3xl font-extrabold font-display text-slate-900 mt-1">{p.price}</p>
              <p className="text-[11px] text-slate-600 font-semibold mt-1">{p.note}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer currentLang={currentLang} />

      <OrderModal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} currentLang={currentLang} initialService="Publishing" />
    </div>
  );
}
