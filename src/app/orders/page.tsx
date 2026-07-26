import type { Metadata } from 'next';
import MyOrdersPageClient from './MyOrdersPageClient';

// Trang này chỉ có nội dung sau khi đăng nhập, nên chặn lập chỉ mục: để Google
// thu thập thì nó chỉ thấy màn hình trống, làm loãng kết quả tìm kiếm.
export const metadata: Metadata = {
  title: 'Đơn hàng của tôi',
  robots: { index: false, follow: false },
  alternates: { canonical: '/orders' },
};

export default function Page() {
  return <MyOrdersPageClient />;
}
