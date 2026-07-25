import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cổng quản trị TE2SR',
  // Trang nội bộ: chặn hẳn khỏi chỉ mục (robots.txt disallow không ngăn URL bị index)
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
