import type { MetadataRoute } from 'next';

const SITE_URL = 'https://te2sr.com';

/**
 * Sitemap sinh lúc build. Chỉ liệt kê trang công khai — /admin và /orders
 * đòi đăng nhập nên không có gì để Google đọc.
 *
 * lastModified dùng ngày build. Không dùng Date.now() trong module scope của
 * component để tránh lệch hydration; ở đây an toàn vì file này chỉ chạy lúc
 * build, không render ra HTML.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '', priority: 1.0, freq: 'weekly' },
    { path: '/services/testing', priority: 0.9, freq: 'monthly' },
    { path: '/services/publishing', priority: 0.9, freq: 'monthly' },
    { path: '/services/promotion', priority: 0.8, freq: 'monthly' },
  ];

  return pages.map((p) => ({
    url: `${SITE_URL}${p.path}`,
    lastModified: now,
    changeFrequency: p.freq,
    priority: p.priority,
  }));
}
