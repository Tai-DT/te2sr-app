'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GlassCard } from '@/components/GlassCard';
import { OrderModal } from '@/components/OrderModal';
import { LanguageCode } from '@/lib/i18n/dictionaries';
import { Star, TrendingUp, Globe } from 'lucide-react';

export default function PromotionServicePage() {
  const [currentLang, setCurrentLang] = useState<LanguageCode>('vi');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const features = [
    { icon: TrendingUp, title: 'Tăng Lượt Tải Tìm Kiếm (Keyword Installs)', desc: 'Người dùng tìm từ khóa mục tiêu (ví dụ: "crypto wallet") trên App Store/Play Store và tải app của bạn để đẩy vị trí tìm kiếm lên Top 1-3.' },
    { icon: Star, title: 'Xây Dựng 1,000+ Ratings 5 Sao', desc: 'Nhận hàng trăm bình luận tích cực, dài từ 2-3 câu bằng ngôn ngữ địa phương (Việt, Anh, Nhật, Hàn, Pháp...) giúp giữ vị trí 4.8 - 5.0 điểm rating.' },
    { icon: Globe, title: 'Quảng Bá Theo Quốc Gia (Geo Targeting)', desc: 'Lựa chọn tệp người dùng thực tại bất kỳ quốc gia nào trên thế giới để tăng tính tương thích cho chiến dịch quảng bá toàn cầu.' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Navbar currentLang={currentLang} onLanguageChange={setCurrentLang} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-extrabold">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>Tăng Lượt Tải & Đánh Giá 5 Sao Uy Tín</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 leading-tight">
            Đưa App Vào Top Category & Đẩy Keyword ASO
          </h1>
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
            Chiến dịch tăng 1,000 - 100,000 lượt tải từ người dùng thực tế tại Mỹ, Việt Nam, Nhật Bản, Hàn Quốc, Châu Âu... cùng 1,000+ đánh giá 5 sao tự nhiên giúp nâng uy tín app.
          </p>
          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 font-extrabold text-white text-sm shadow-apple-md hover:scale-[1.02] transition-all"
          >
            Bắt Đầu Chiến Dịch Tăng 5★
          </button>
        </div>

        {/* Campaign Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <GlassCard key={i} className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
                  <Icon className={`w-6 h-6 ${f.icon === Star ? 'fill-amber-500' : ''}`} />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">{f.title}</h3>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{f.desc}</p>
              </GlassCard>
            );
          })}
        </div>

        {/* Bonus note */}
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 text-center shadow-apple-sm">
          <p className="text-sm font-extrabold text-amber-900">🎁 Mọi gói dịch vụ TE2SR đều được tặng kèm 10 đánh giá 5★ người dùng thật.</p>
          <p className="text-xs text-amber-800 font-semibold mt-1">Gói tăng trưởng số lượng lớn sẽ ra mắt sau — liên hệ để được tư vấn sớm.</p>
        </div>
      </main>

      <Footer currentLang={currentLang} />

      <OrderModal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} currentLang={currentLang} initialService="Promotion_5Star" />
    </div>
  );
}
