import type { MetadataRoute } from 'next';

/**
 * Next.js sinh ra /robots.txt lúc build — chạy được với output: 'export'.
 *
 * /admin và /orders chặn lập chỉ mục: chúng chỉ có nội dung sau khi đăng nhập,
 * nên Google thu thập được cũng chỉ thấy màn hình trống, làm loãng kết quả
 * tìm kiếm của trang bán hàng.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/orders'],
      },
    ],
    sitemap: 'https://te2sr.com/sitemap.xml',
    host: 'https://te2sr.com',
  };
}
