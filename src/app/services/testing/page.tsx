import type { Metadata } from 'next';
import { TestingClient } from './TestingClient';

const BASE = 'https://te2sr.com';
const URL = `${BASE}/services/testing`;

export const metadata: Metadata = {
  title: 'Dịch vụ kiểm thử app — TestFlight iOS & Android đa thiết bị | TE2SR',
  description:
    'Kiểm thử ứng dụng trên 20+ thiết bị thật (iPhone, iPad, Samsung, Google Pixel): phát hiện crash, đo hiệu năng & RAM, báo cáo bug chi tiết kèm video tái hiện lỗi.',
  keywords: [
    'dịch vụ kiểm thử app',
    'testflight ios',
    'android beta testing',
    'kiểm thử đa thiết bị',
    'thuê tester app',
    'qa app mobile',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Kiểm thử TestFlight iOS & Android đa thiết bị | TE2SR',
    description:
      'Phát hiện crash, đo hiệu năng và báo cáo bug chi tiết trên hơn 20 mẫu thiết bị thật trước khi phát hành.',
    url: URL,
    siteName: 'TE2SR',
    type: 'website',
    locale: 'vi_VN',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'TE2SR' }],
  },
};

export default function Page() {
  return <TestingClient />;
}
