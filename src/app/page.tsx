import type { Metadata } from 'next';
import { HomeClient } from './HomeClient';
import { PACKAGES } from '@/lib/packages';

const BASE = 'https://te2sr.com';

export const metadata: Metadata = {
  title: 'TE2SR — Dịch vụ 12 testers 14 ngày & đăng tải App Store / Google Play',
  description:
    'Cài đủ 12 testers thực tế chạy closed testing 14 ngày và đưa app lên Google Play & App Store. Từ $50, thanh toán 2 đợt 50% – 50%, tặng 10 đánh giá 5★, hoàn tiền 100% nếu không đạt.',
  keywords: [
    'đăng tải app lên google play',
    '12 testers 14 ngày',
    'closed testing google play',
    'thuê tester google play',
    'đưa app lên app store',
    'dịch vụ kiểm thử app',
    'google play closed testing service',
  ],
  alternates: { canonical: BASE },
  openGraph: {
    title: 'TE2SR — 12 testers 14 ngày & đăng tải App Store / Google Play',
    description:
      'Cài đủ 12 testers thực tế 14 ngày và đưa app lên Store. Từ $50, thanh toán 2 đợt, tặng 10 đánh giá 5★.',
    url: BASE,
    siteName: 'TE2SR',
    type: 'website',
    locale: 'vi_VN',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'TE2SR' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@_te2sr',
    title: 'TE2SR — 12 testers 14 ngày & đăng tải App Store / Google Play',
    description: 'Cài đủ 12 testers thực tế 14 ngày và đưa app lên Store. Từ $50, thanh toán 2 đợt.',
    images: ['/og.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${BASE}#org`,
      name: 'TE2SR',
      alternateName: 'TE2SR Platform',
      url: BASE,
      logo: `${BASE}/icon-512.png`,
      description:
        'Dịch vụ kiểm thử ứng dụng di động (12 testers / 14 ngày) và đăng tải lên Apple App Store & Google Play.',
      sameAs: ['https://x.com/_te2sr'],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'te2sr@googlegroups.com',
          availableLanguage: ['Vietnamese', 'English'],
        },
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE}#website`,
      url: BASE,
      name: 'TE2SR',
      inLanguage: 'vi-VN',
      publisher: { '@id': `${BASE}#org` },
    },
    {
      '@type': 'Service',
      '@id': `${BASE}#service`,
      name: 'Kiểm thử 12 testers & đăng tải ứng dụng lên App Store / Google Play',
      serviceType: 'Mobile app testing and store publishing',
      provider: { '@id': `${BASE}#org` },
      areaServed: 'Worldwide',
      offers: PACKAGES.filter((p) => p.priceUsd !== null).map((p) => ({
        '@type': 'Offer',
        name: p.seo.h1,
        price: String(p.priceUsd),
        priceCurrency: 'USD',
        url: `${BASE}/goi/${p.slug}`,
        availability: 'https://schema.org/InStock',
      })),
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
      <HomeClient />
    </>
  );
}
