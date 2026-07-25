import type { MetadataRoute } from 'next';
import { PACKAGES } from '@/lib/packages';

export const dynamic = 'force-static';

const BASE = 'https://te2sr.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2026-07-25');

  const staticRoutes = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    // Trang nội dung nhắm đúng nhu cầu tìm kiếm lớn nhất của dịch vụ
    { path: '/google-play-closed-testing', priority: 0.95, changeFrequency: 'monthly' as const },
    { path: '/services/testing', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/services/publishing', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/services/promotion', priority: 0.8, changeFrequency: 'monthly' as const },
  ];

  return [
    ...staticRoutes.map((r) => ({
      url: `${BASE}${r.path}`,
      lastModified,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...PACKAGES.map((p) => ({
      url: `${BASE}/goi/${p.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: p.featured ? 0.95 : 0.85,
    })),
  ];
}
