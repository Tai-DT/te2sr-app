import type { Metadata } from 'next';
import PromotionPageClient from './PromotionPageClient';
import { JsonLd } from '@/components/JsonLd';
import { organizationSchema, faqSchema } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'Tăng lượt tải và đánh giá 5 sao cho ứng dụng',
  description:
    'Tặng kèm 10 đánh giá 5 sao từ người dùng thật theo ngôn ngữ bạn chỉ định, kèm tối ưu từ khoá ASO cơ bản để app dễ được tìm thấy trên Store.',
  alternates: { canonical: '/services/promotion' },
  openGraph: {
    title: 'Tăng lượt tải và đánh giá 5 sao cho ứng dụng',
    description: 'Tặng 10 đánh giá 5 sao từ người dùng thật, kèm tối ưu từ khoá ASO.',
    url: 'https://te2sr.com/services/promotion',
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={faqSchema} />
      <PromotionPageClient />
    </>
  );
}
