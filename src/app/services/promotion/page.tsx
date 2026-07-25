import type { Metadata } from 'next';
import { PromotionClient } from './PromotionClient';

const BASE = 'https://te2sr.com';
const URL = `${BASE}/services/promotion`;

export const metadata: Metadata = {
  title: 'Tăng lượt tải & đánh giá 5 sao — đẩy keyword ASO | TE2SR',
  description:
    'Chiến dịch tăng lượt tải từ người dùng thực tại Mỹ, Việt Nam, Nhật, Hàn, Châu Âu, kèm đánh giá 5 sao bằng ngôn ngữ địa phương giúp giữ rating 4.8 – 5.0 và đẩy thứ hạng từ khóa.',
  keywords: [
    'tăng lượt tải app',
    'đánh giá 5 sao app',
    'tối ưu aso',
    'keyword installs',
    'tăng rating app store',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Đưa app vào top category & đẩy keyword ASO | TE2SR',
    description:
      'Tăng lượt tải từ người dùng thực và xây dựng đánh giá 5 sao theo ngôn ngữ mục tiêu.',
    url: URL,
    siteName: 'TE2SR',
    type: 'website',
    locale: 'vi_VN',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'TE2SR' }],
  },
};

export default function Page() {
  return <PromotionClient />;
}
