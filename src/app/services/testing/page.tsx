import type { Metadata } from 'next';
import TestingPageClient from './TestingPageClient';
import { JsonLd } from '@/components/JsonLd';
import { organizationSchema, faqSchema } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'Kiểm thử app — 12 tester chạy đủ 14 ngày cho Google Play',
  description:
    'Google Play closed testing bắt buộc 12 tester liên tục 14 ngày mới cho phát hành. TE2SR chạy đủ số tester trên thiết bị thật và bàn giao báo cáo lỗi kèm ảnh chụp màn hình cùng các bước tái hiện.',
  alternates: { canonical: '/services/testing' },
  openGraph: {
    title: 'Kiểm thử app — 12 tester chạy đủ 14 ngày cho Google Play',
    description: 'Chạy đủ 12 tester trong 14 ngày theo yêu cầu closed testing của Google Play, trên thiết bị thật.',
    url: 'https://te2sr.com/services/testing',
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={faqSchema} />
      <TestingPageClient />
    </>
  );
}
