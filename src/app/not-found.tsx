import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Không tìm thấy trang | TE2SR',
  description: 'Trang bạn tìm không tồn tại. Quay lại trang chủ TE2SR để xem dịch vụ kiểm thử và đăng tải app.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4 py-20 font-sans">
      <div className="text-center max-w-md space-y-5">
        <p className="text-6xl font-bold tracking-tight text-brand-blue">404</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Không tìm thấy trang này
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Đường dẫn có thể đã thay đổi hoặc không còn tồn tại. Bạn có thể quay về trang chủ hoặc
          xem các gói dịch vụ bên dưới.
        </p>

        <div className="flex flex-wrap justify-center gap-2 pt-2">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-full bg-brand-blue hover:bg-brand-blueHover text-white font-semibold text-sm transition-colors"
          >
            Về trang chủ
          </Link>
          <Link
            href="/goi/ca-2-store"
            className="px-5 py-2.5 rounded-full bg-white border border-slate-300 hover:border-slate-400 text-slate-900 font-semibold text-sm transition-colors"
          >
            Xem bảng giá
          </Link>
        </div>

        <nav className="pt-4 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
          <Link href="/services/testing" className="hover:text-brand-blue transition-colors">
            Kiểm thử app
          </Link>
          <Link href="/services/publishing" className="hover:text-brand-blue transition-colors">
            Đăng tải app
          </Link>
          <Link href="/services/promotion" className="hover:text-brand-blue transition-colors">
            Tăng lượt tải &amp; 5★
          </Link>
        </nav>
      </div>
    </main>
  );
}
