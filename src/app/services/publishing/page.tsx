'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GlassCard } from '@/components/GlassCard';
import { OrderModal } from '@/components/OrderModal';
import { LanguageCode, getTranslation } from '@/lib/i18n/dictionaries';
import { Rocket, CheckCircle, ShieldCheck, FileCheck, Award, Sparkles } from 'lucide-react';

export default function PublishingServicePage() {
  const [currentLang, setCurrentLang] = useState<LanguageCode>('vi');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col font-sans">
      <Navbar currentLang={currentLang} onLanguageChange={setCurrentLang} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neon-blue/10 border border-neon-blue/40 text-neon-blue text-xs font-semibold">
            <Rocket className="w-4 h-4" />
            <span>Dịch Vụ Đưa App Lên App Store & Google Play</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white">
            Đưa Dự Án Lên Chợ Ứng Dụng Toàn Cầu
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Hỗ trợ trọn gói từ chuẩn bị chứng chỉ Apple Certificate / Android Keystore, tối ưu từ khóa ASO metadata, đến khi ứng dụng chính thức xuất hiện trên App Store & Google Play.
          </p>
          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-neon-gradient font-bold text-white text-sm shadow-neon-blue hover:scale-105 transition-all"
          >
            Đăng Ký Đăng Tải Ngay
          </button>
        </div>

        {/* Workflow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <GlassCard glow="blue" className="space-y-3">
            <div className="text-neon-blue font-extrabold text-2xl font-display">01</div>
            <h3 className="font-bold text-white text-base">Chuẩn Bị Account & Cert</h3>
            <p className="text-xs text-slate-300">Cấu hình Apple Developer ID, Google Play Console, Provisioning Profiles & Signings.</p>
          </GlassCard>

          <GlassCard glow="blue" className="space-y-3">
            <div className="text-neon-blue font-extrabold text-2xl font-display">02</div>
            <h3 className="font-bold text-white text-base">Tối Ưu Metadata ASO</h3>
            <p className="text-xs text-slate-300">Viết Mô tả, Từ khóa, thiết kế Screenshots chuẩn kích thước 6.7" & iPad Pro.</p>
          </GlassCard>

          <GlassCard glow="blue" className="space-y-3">
            <div className="text-neon-blue font-extrabold text-2xl font-display">03</div>
            <h3 className="font-bold text-white text-base">Nộp App & Review Cleared</h3>
            <p className="text-xs text-slate-300">Gửi bản build và xử lý phản hồi trực tiếp với đội ngũ App Review của Apple/Google.</p>
          </GlassCard>

          <GlassCard glow="blue" className="space-y-3">
            <div className="text-neon-blue font-extrabold text-2xl font-display">04</div>
            <h3 className="font-bold text-white text-base">Live & Bảo Hành 100%</h3>
            <p className="text-xs text-slate-300">Ứng dụng chính thức xuất hiện công khai trên 150+ quốc gia với lượt tải mở màn.</p>
          </GlassCard>
        </div>
      </main>

      <Footer currentLang={currentLang} />

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        currentLang={currentLang}
        initialService="Publishing"
      />
    </div>
  );
}
