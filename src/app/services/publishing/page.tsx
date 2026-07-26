import type { Metadata } from 'next';
import PublishingPageClient from './PublishingPageClient';
import { JsonLd } from '@/components/JsonLd';
import { organizationSchema, faqSchema } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'Đăng tải app lên App Store và Google Play',
  description:
    'Chuẩn bị hồ sơ, chứng chỉ, metadata ASO và xử lý phản hồi của bên duyệt cho tới khi app lên Store. Gói Google Play $50, App Store $70, cả hai $100 — thanh toán 2 đợt.',
  alternates: { canonical: '/services/publishing' },
  openGraph: {
    title: 'Đăng tải app lên App Store và Google Play',
    description: 'Lo trọn hồ sơ duyệt cho tới khi app lên Store. Google Play $50, App Store $70, cả hai $100.',
    url: 'https://te2sr.com/services/publishing',
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={faqSchema} />
      <PublishingPageClient />
    </>
  );
}
