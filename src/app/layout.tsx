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
