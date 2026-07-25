import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth';

export const metadata: Metadata = {
  metadataBase: new URL('https://te2sr.com'),
  title: 'TE2SR — Kiểm thử app & đăng tải App Store / Google Play',
  description:
    'Kiểm thử toàn diện và đưa app lên App Store & Google Play (12 testers / 14 ngày), thanh toán 2 đợt, tặng 10 đánh giá 5★.',
  manifest: '/manifest.webmanifest',
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
  openGraph: {
    title: 'TE2SR — Testing to Store Release',
    description:
      'Kiểm thử app & đưa lên App Store / Google Play. Thanh toán 2 đợt, tặng 10 đánh giá 5★.',
    url: '/',
    siteName: 'TE2SR',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'TE2SR' }],
    type: 'website',
  },
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Montserrat:ital,wght@1,800;1,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
