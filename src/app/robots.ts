import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Trang quản trị không có giá trị SEO và không nên xuất hiện trên Google
        disallow: ['/admin'],
      },
    ],
    sitemap: 'https://te2sr.com/sitemap.xml',
    host: 'https://te2sr.com',
  };
}
