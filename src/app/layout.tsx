import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth';
import { AuthModal } from '@/components/AuthModal';
import { LanguageProvider } from '@/lib/i18n/language-context';

const SITE_URL = 'https://te2sr.com';
const SITE_NAME = 'TE2SR';
const TITLE = 'TE2SR — Kiểm thử app 12 tester/14 ngày & đăng tải App Store, Google Play';
const DESCRIPTION =
  'Chạy đủ 12 tester trong 14 ngày theo yêu cầu closed testing của Google Play, đưa app lên App Store và Google Play, kiểm thử website. Mỗi lỗi bàn giao đều kèm ảnh chụp màn hình và các bước tái hiện.';

export const metadata: Metadata = {
  // Bắt buộc cho static export: thiếu metadataBase thì mọi ảnh og bị xuất
  // thành đường dẫn tương đối, và Facebook/Zalo không tải được.
  metadataBase: new URL(SITE_URL),
  // template để trang con không phải lặp lại tên thương hiệu
  title: { default: TITLE, template: '%s — TE2SR' },
  description: DESCRIPTION,
  // Thiếu khối này nên link dán lên Facebook/Zalo/Messenger hiện ra trơ trọi
  // không ảnh, dù public/og.png đã có sẵn đúng chuẩn 1200×630.
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    locale: 'vi_VN',
    alternateLocale: ['en_US', 'ja_JP', 'ko_KR', 'fr_FR', 'de_DE', 'es_ES', 'zh_CN'],
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'TE2SR — kiểm thử và đăng tải ứng dụng' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16.png', type: 'image/png', sizes: '16x16' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.webmanifest',
};

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://te2sr.com/#organization',
      name: 'TE2SR',
      url: 'https://te2sr.com',
      logo: 'https://te2sr.com/logo.png',
      sameAs: [
        'https://www.facebook.com/profile.php?id=61592332571131',
        'https://www.facebook.com/p/TE2SR-Google-Play-Closed-Testing-App-Store-Publishing-61592332571131/',
      ],
      description:
        'Professional Google Play 12 testers 14 days closed testing and App Store publishing service on real devices.',
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'admin@te2sr.com',
        contactType: 'customer support',
        availableLanguage: [
          'Vietnamese',
          'English',
          'Japanese',
          'Korean',
          'French',
          'German',
          'Spanish',
          'Chinese',
        ],
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://te2sr.com/#website',
      url: 'https://te2sr.com',
      name: 'TE2SR',
      publisher: {
        '@id': 'https://te2sr.com/#organization',
      },
    },
    {
      '@type': 'Service',
      '@id': 'https://te2sr.com/#service-google-play',
      name: 'Google Play Closed Testing Service (12 Testers / 14 Days)',
      serviceType: 'Mobile App QA & Testing',
      provider: {
        '@id': 'https://te2sr.com/#organization',
      },
      description:
        '12 testers for 14 continuous days on real Android devices to meet Google Play Console requirements for personal developer accounts.',
      offers: {
        '@type': 'Offer',
        price: '50.00',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        description: 'Flexible 2-step payment: 50% once 12 testers start, 50% when app is live.',
      },
    },
    {
      '@type': 'Service',
      '@id': 'https://te2sr.com/#service-app-store',
      name: 'App Store Publishing Service',
      serviceType: 'Mobile App Deployment',
      provider: {
        '@id': 'https://te2sr.com/#organization',
      },
      description:
        'Complete App Store Connect release management, metadata, screenshots, privacy policy declaration, and Apple Guideline review rejection resolution.',
      offers: {
        '@type': 'Offer',
        price: '70.00',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    },
    {
      '@type': 'Service',
      '@id': 'https://te2sr.com/#service-both-stores',
      name: 'Google Play Closed Testing & App Store Publishing Combo',
      serviceType: 'Mobile App QA & Store Deployment',
      provider: {
        '@id': 'https://te2sr.com/#organization',
      },
      description:
        'Complete dual-store package covering 12 testers x 14 days on Google Play and full App Store deployment.',
      offers: {
        '@type': 'Offer',
        price: '100.00',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://te2sr.com/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How many testers does Google Play require for closed testing?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Google Play requires at least 12 opted-in testers for 14 continuous days for personal developer accounts. This rule was officially updated in December 2024 from the previous 20-tester rule.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does TE2SR use real devices or emulators?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'TE2SR only uses real physical Android devices with distinct Google accounts and active daily engagement. We never use emulators or bots, ensuring zero risk of account suspension.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does the 2-step payment work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You only pay 50% after all 12 testers have successfully installed and joined the closed test track, and the remaining 50% when your app is officially granted production access and goes live.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the refund policy?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We offer a 100% full refund if we fail to maintain 12 active testers across the full 14-day duration.',
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Montserrat:ital,wght@0,700;0,800;0,900;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body>
        <LanguageProvider>
          <AuthProvider>
            {children}
            <AuthModal />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
