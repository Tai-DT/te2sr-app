'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GlassCard } from '@/components/GlassCard';
import { OrderModal } from '@/components/OrderModal';
import { LanguageCode, getTranslation } from '@/lib/i18n/dictionaries';
import { TestTube, CheckCircle, Smartphone, Cpu, Bug, ShieldCheck, ArrowRight } from 'lucide-react';

export default function TestingServicePage() {
  const [currentLang, setCurrentLang] = useState<LanguageCode>('vi');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const t = (key: string) => getTranslation(currentLang, key);

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col font-sans">
      <Navbar currentLang={currentLang} onLanguageChange={setCurrentLang} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neon-blue/10 border border-neon-blue/40 text-neon-blue text-xs font-semibold">
            <TestTube className="w-4 h-4" />
            <span>Dịch Vụ Kiểm Thử App Chuyên Nghiệp</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white">
            iOS TestFlight & Android QA Multi-Device Testing
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Phát hiện toàn bộ lỗi crash, tối ưu tốc độ phản hồi và đảm bảo ứng dụng tương thích hoàn hảo trên 20+ mẫu iPhone, iPad, Samsung, Google Pixel trước khi trình làng thế giới.
          </p>
          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-neon-gradient font-bold text-white text-sm shadow-neon-blue hover:scale-105 transition-all"
          >
            Đăng Ký Kiểm Thử Ngay
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard glow="blue" className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-neon-blue/20 text-neon-blue flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Phân Phối TestFlight & Beta</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Quản lý danh sách 100+ tester thử nghiệm nội bộ, thu thập phản hồi và log lỗi crash realtime tự động.
            </p>
          </GlassCard>

          <GlassCard glow="blue" className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-neon-blue/20 text-neon-blue flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Kiểm Thử Hiệu Năng & RAM</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Đo lường mức tiêu thụ pin, bộ nhớ RAM, dung lượng CPU và tốc độ render frame (60fps/120fps smoothness).
            </p>
          </GlassCard>

          <GlassCard glow="blue" className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-neon-blue/20 text-neon-blue flex items-center justify-center font-bold">
              <Bug className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Báo Cáo Bug Chi Tiết</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Cung cấp file log, video các bước tái diễn lỗi và giải pháp fix từ các chuyên gia QA cấp cao.
            </p>
          </GlassCard>
        </div>

        {/* Device Matrix */}
        <div className="glass-panel rounded-3xl p-8 border border-white/10 space-y-6">
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-neon-blue" />
            <span>Danh Sách Thiết Bị Kiểm Thử Thực Tế</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-surface-low rounded-xl border border-white/5 font-medium text-slate-300">
              📱 iPhone 15 Pro Max (iOS 17.5)
            </div>
            <div className="p-3 bg-surface-low rounded-xl border border-white/5 font-medium text-slate-300">
              📱 iPhone 14 & 13 Mini (iOS 16)
            </div>
            <div className="p-3 bg-surface-low rounded-xl border border-white/5 font-medium text-slate-300">
              📱 iPad Pro 12.9" (iPadOS 17)
            </div>
            <div className="p-3 bg-surface-low rounded-xl border border-white/5 font-medium text-slate-300">
              🤖 Samsung Galaxy S24 Ultra
            </div>
            <div className="p-3 bg-surface-low rounded-xl border border-white/5 font-medium text-slate-300">
              🤖 Google Pixel 9 Pro (Android 15)
            </div>
            <div className="p-3 bg-surface-low rounded-xl border border-white/5 font-medium text-slate-300">
              🤖 Xiaomi 14 Ultra (HyperOS)
            </div>
            <div className="p-3 bg-surface-low rounded-xl border border-white/5 font-medium text-slate-300">
              🤖 Oppo Find X7 Series
            </div>
            <div className="p-3 bg-surface-low rounded-xl border border-white/5 font-medium text-slate-300">
              📱 Android Tablets & Foldables
            </div>
          </div>
        </div>
      </main>

      <Footer currentLang={currentLang} />

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        currentLang={currentLang}
        initialService="Testing"
      />
    </div>
  );
}
