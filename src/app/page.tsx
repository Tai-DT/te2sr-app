import HomePageClient from './HomePageClient';
import { JsonLd } from '@/components/JsonLd';
import { organizationSchema, websiteSchema, servicesSchema, faqSchema } from '@/lib/structured-data';

// Vỏ máy chủ: trang nội dung là 'use client' nên không tự khai metadata được.
// Không có vỏ này, mọi trang đều thừa hưởng canonical của layout và cùng tự
// khai là trang chủ — Google sẽ bỏ qua toàn bộ trang dịch vụ.
export const metadata = {
  alternates: { canonical: '/' },
};

export default function Page() {
  return (
    <>
      {/* Nguồn dữ kiện cho công cụ tìm kiếm AI trích dẫn. */}
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
      <JsonLd data={servicesSchema} />
      <JsonLd data={faqSchema} />
      <HomePageClient />
    </>
  );
}
