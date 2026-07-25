import type { Metadata } from 'next';
import { CLOSED_TESTING_FAQS } from '@/lib/faq';
import { ClosedTestingGuide } from './ClosedTestingGuide';

const BASE = 'https://te2sr.com';
const URL = `${BASE}/google-play-closed-testing`;

export const metadata: Metadata = {
  title: 'Closed testing Google Play: đủ 12 testers trong 14 ngày | TE2SR',
  description:
    'Hướng dẫn đầy đủ closed testing Google Play: yêu cầu 12 testers opt-in liên tục 14 ngày, cách thêm Google Group, vì sao đồng hồ 14 ngày bị reset và cách xin production access.',
  keywords: [
    'closed testing google play',
    '12 testers 14 ngày',
    'google play 12 testers 14 days',
    'thuê tester google play',
    'kiểm thử kín google play',
    'production access google play',
    'google play closed test bao nhiêu tester',
    'opt-in url google play',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Closed testing Google Play: đủ 12 testers trong 14 ngày',
    description:
      'Yêu cầu 12 testers opt-in liên tục 14 ngày, cách thêm Google Group, vì sao đồng hồ bị reset và cách xin production access.',
    url: URL,
    siteName: 'TE2SR',
    type: 'article',
    locale: 'vi_VN',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'TE2SR' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@_te2sr',
    title: 'Closed testing Google Play: đủ 12 testers trong 14 ngày',
    description: 'Hướng dẫn đầy đủ + dịch vụ cung cấp 12 testers thật giữ đủ 14 ngày.',
    images: ['/og.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': `${URL}#article`,
      headline: 'Closed testing Google Play: đủ 12 testers trong 14 ngày',
      description:
        'Hướng dẫn đầy đủ quy trình closed testing Google Play và yêu cầu 12 testers opt-in liên tục 14 ngày.',
      inLanguage: 'vi-VN',
      mainEntityOfPage: URL,
      author: { '@type': 'Organization', name: 'TE2SR', url: BASE },
      publisher: {
        '@type': 'Organization',
        name: 'TE2SR',
        url: BASE,
        logo: { '@type': 'ImageObject', url: `${BASE}/icon-512.png` },
      },
      image: `${BASE}/og.png`,
    },
    {
      '@type': 'HowTo',
      '@id': `${URL}#howto`,
      name: 'Cách đạt yêu cầu 12 testers trong 14 ngày trên Google Play',
      description:
        'Năm bước để chạy closed testing đúng chuẩn Google Play và mở được production access.',
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Tạo bản build và đưa lên Closed testing',
          text: 'Trong Google Play Console, vào Test and release → Testing → Closed testing, tạo track và tải bản AAB lên.',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Thêm danh sách tester bằng Google Group',
          text: 'Ở tab Testers, chọn Google Groups và dán email nhóm tester.',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Gửi link kiểm thử (opt-in URL) cho tester',
          text: 'Tester phải mở link, bấm Become a tester rồi cài app từ Google Play.',
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: 'Giữ đủ 12 tester opt-in liên tục 14 ngày',
          text: 'Nếu số tester tụt xuống dưới 12, bộ đếm 14 ngày sẽ quay lại từ đầu.',
        },
        {
          '@type': 'HowToStep',
          position: 5,
          name: 'Nộp đơn xin production access',
          text: 'Sau 14 ngày liên tục, điền bảng câu hỏi về quá trình test và nộp cho Google.',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${URL}#faq`,
      mainEntity: CLOSED_TESTING_FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: BASE },
        { '@type': 'ListItem', position: 2, name: 'Closed testing Google Play', item: URL },
      ],
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ClosedTestingGuide shareUrl={URL} />
    </>
  );
}
