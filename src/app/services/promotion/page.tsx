'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GlassCard } from '@/components/GlassCard';
import { OrderModal } from '@/components/OrderModal';
import { LanguageCode, getTranslation } from '@/lib/i18n/dictionaries';
import { Star, TrendingUp, Users, Globe, CheckCircle, ArrowRight } from 'lucide-react';

export default function PromotionServicePage() {
  const [currentLang, setCurrentLang] = useState<LanguageCode>('vi');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col font-sans">
      <Navbar currentLang={currentLang} onLanguageChange={setCurrentLang} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neon-magenta/10 border border-neon-magenta/40 text-neon-magenta text-xs font-semibold">
            <Star className="w-4 h-4 fill-neon-magenta" />
            <span>Tăng Lượt Tải & Đánh Giá 5 Sao Uy Tín</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white">
            Đưa App Vào Top Category & Đẩy Keyword ASO
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Chiến dịch tăng 1,000 - 100,000 lượt tải từ người dùng thực tế tại Mỹ, Việt Nam, Nhật Bản, Hàn Quốc, Châu Âu... cùng 1,000+ đánh giá 5 sao tự nhiên giúp nâng uy tín app.
          </p>
          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-neon-gradient font-bold text-white text-sm shadow-neon-pink hover:scale-105 transition-all"
          >
            Bắt Đầu Chiến Dịch Tăng 5★
          </button>
        </div>

        {/* Campaign Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard glow="magenta" className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-neon-magenta/15 text-neon-magenta border border-neon-magenta/30 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Tăng Lượt Tải Tìm Kiếm (Keyword Installs)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Người dùng tìm từ khóa mục tiêu (ví dụ: "crypto wallet") trên App Store/Play Store và tải app của bạn để đẩy vị trí tìm kiếm lên Top 1-3.
            </p>
          </GlassCard>

          <GlassCard glow="magenta" className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-neon-magenta/15 text-neon-magenta border border-neon-magenta/30 flex items-center justify-center">
              <Star className="w-6 h-6 fill-neon-magenta" />
            </div>
            <h3 className="text-lg font-bold text-white">Xây Dựng 1,000+ Ratings 5 Sao</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Nhận hàng trăm bình luận tích cực, dài từ 2-3 câu bằng ngôn ngữ địa phương (Việt, Anh, Nhật, Hàn, Pháp...) giúp giữ vị trí 4.8 - 5.0 điểm rating.
            </p>
          </GlassCard>

          <GlassCard glow="magenta" className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-neon-magenta/15 text-neon-magenta border border-neon-magenta/30 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Quảng Bá Theo Quốc Gia (Geo Targeting)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Lựa chọn tệp người dùng thực tại bất kỳ quốc gia nào trên thế giới để tăng tính tương thích cho chiến dịch quảng bá toàn cầu.
            </p>
          </GlassCard>
        </div>
      </main>

      <Footer currentLang={currentLang} />

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        currentLang={currentLang}
        initialService="Promotion_5Star"
      />
    </div>
  );
}
