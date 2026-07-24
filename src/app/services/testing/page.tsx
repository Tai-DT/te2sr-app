'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GlassCard } from '@/components/GlassCard';
import { OrderModal } from '@/components/OrderModal';
import { LanguageCode } from '@/lib/i18n/dictionaries';
import { TestTube, Smartphone, Cpu, Bug, ShieldCheck } from 'lucide-react';

export default function TestingServicePage() {
  const [currentLang, setCurrentLang] = useState<LanguageCode>('vi');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Navbar currentLang={currentLang} onLanguageChange={setCurrentLang} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-brand-blue text-xs font-extrabold">
            <TestTube className="w-4 h-4" />
            <span>Dịch Vụ Kiểm Thử App Chuyên Nghiệp</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 leading-tight">
            iOS TestFlight & Android QA Multi-Device Testing
          </h1>
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
            Phát hiện toàn bộ lỗi crash, tối ưu tốc độ phản hồi và đảm bảo ứng dụng tương thích hoàn hảo trên 20+ mẫu iPhone, iPad, Samsung, Google Pixel trước khi trình làng thế giới.
          </p>
          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-brand-blue hover:bg-blue-600 font-extrabold text-white text-sm shadow-brand-blue hover:scale-[1.02] transition-all"
          >
            Đăng Ký Kiểm Thử Ngay
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Smartphone, title: 'Phân Phối TestFlight & Beta', desc: 'Quản lý danh sách 100+ tester thử nghiệm nội bộ, thu thập phản hồi và log lỗi crash realtime tự động.' },
            { icon: Cpu, title: 'Kiểm Thử Hiệu Năng & RAM', desc: 'Đo lường mức tiêu thụ pin, bộ nhớ RAM, dung lượng CPU và tốc độ render frame (60fps/120fps smoothness).' },
            { icon: Bug, title: 'Báo Cáo Bug Chi Tiết', desc: 'Cung cấp file log, video các bước tái diễn lỗi và giải pháp fix từ các chuyên gia QA cấp cao.' },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <GlassCard key={i} glow="blue" className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-brand-blue flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">{f.title}</h3>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{f.desc}</p>
              </GlassCard>
            );
          })}
        </div>

        {/* Device Matrix */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-apple-md space-y-6">
          <h2 className="text-xl font-extrabold font-display text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-blue" />
            <span>Danh Sách Thiết Bị Kiểm Thử Thực Tế</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            {[
              '📱 iPhone 15 Pro Max (iOS 17.5)',
              '📱 iPhone 14 & 13 Mini (iOS 16)',
              '📱 iPad Pro 12.9" (iPadOS 17)',
              '🤖 Samsung Galaxy S24 Ultra',
              '🤖 Google Pixel 9 Pro (Android 15)',
              '🤖 Xiaomi 14 Ultra (HyperOS)',
              '🤖 Oppo Find X7 Series',
              '📱 Android Tablets & Foldables',
            ].map((device) => (
              <div key={device} className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-700">
                {device}
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer currentLang={currentLang} />

      <OrderModal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} currentLang={currentLang} initialService="Testing" />
    </div>
  );
}
