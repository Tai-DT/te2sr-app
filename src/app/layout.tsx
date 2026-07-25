import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth';
import { AuthModal } from '@/components/AuthModal';
import { LanguageProvider } from '@/lib/i18n/language-context';

export const metadata: Metadata = {
  title: 'TE2SR App - Platform Kiểm Thử & Triển Khai App Store',
  description: 'Nền tảng kiểm thử ứng dụng iOS/Android, đăng tải App Store/Google Play và tăng lượt tải 5 sao.',
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
