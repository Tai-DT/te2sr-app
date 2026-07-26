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
      // Cho phép rõ ràng các bot của công cụ tìm kiếm AI. Nêu tên cụ thể thay
      // vì dựa vào '*' là có chủ ý: một số bot chỉ đọc luật khớp đúng tên
      // mình, và ta MUỐN được ChatGPT, Perplexity, Claude trích dẫn — đó là
      // kênh khách tìm tới ngày càng nhiều.
      {
        userAgent: ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'Claude-User', 'Google-Extended', 'Applebot-Extended'],
        allow: '/',
        disallow: ['/admin', '/orders'],
      },
    ],
    sitemap: 'https://te2sr.com/sitemap.xml',
    host: 'https://te2sr.com',
  };
}
