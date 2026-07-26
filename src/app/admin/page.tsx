import type { Metadata } from 'next';
import AdminPortalPageClient from './AdminPortalPageClient';

export const metadata: Metadata = {
  title: 'Quản trị',
  robots: { index: false, follow: false },
  alternates: { canonical: '/admin' },
};

export default function Page() {
  return <AdminPortalPageClient />;
}
