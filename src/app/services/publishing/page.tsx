import type { Metadata } from 'next';
import { PublishingClient } from './PublishingClient';

const BASE = 'https://te2sr.com';
const URL = `${BASE}/services/publishing`;

export const metadata: Metadata = {
  title: 'Dịch vụ đăng tải app lên App Store & Google Play | TE2SR',
  description:
    'Đăng tải trọn gói: chuẩn bị chứng chỉ Apple / Android Keystore, tối ưu metadata ASO, nộp duyệt và xử lý phản hồi App Review đến khi app chính thức lên Store tại 150+ quốc gia.',
  keywords: [
    'dịch vụ đăng tải app',
    'đưa app lên app store',
    'đăng app lên google play',
    'tối ưu aso',
    'apple developer certificate',
    'google play console',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Đưa dự án lên chợ ứng dụng toàn cầu | TE2SR',
    description:
      'Trọn gói từ chứng chỉ, metadata ASO đến khi app xuất hiện trên App Store và Google Play.',
    url: URL,
    siteName: 'TE2SR',
    type: 'website',
    locale: 'vi_VN',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'TE2SR' }],
  },
};

export default function Page() {
  return <PublishingClient />;
}
