// ══════════════════════════════════════════════════════════════
//  Đọc bài viết từ các file markdown trong content/blog/
//
//  Bài viết để dạng file markdown thay vì lưu trong database vì site này
//  xuất tĩnh hoàn toàn: nội dung phải có sẵn lúc build thì Google mới đọc
//  được ngay trong HTML. Nếu tải bài từ database bằng JavaScript sau khi
//  trang mở thì công cụ tìm kiếm nhìn vào chỉ thấy trang trống — mất đúng
//  cái lợi ích SEO mà blog sinh ra để phục vụ.
//
//  Cách đăng bài: thêm một file .md vào content/blog/ trên github.com,
//  bấm Commit, khoảng 2 phút sau bài lên web (xem .github/workflows/deploy.yml).
// ══════════════════════════════════════════════════════════════

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  /** Ngày đăng dạng YYYY-MM-DD. Dùng cho sitemap và thứ tự hiển thị. */
  date: string;
  /** Ngày sửa gần nhất, nếu có. */
  updated?: string;
  /** Ảnh đại diện, đường dẫn trong /public. */
  cover?: string;
  /** Nhãn phân loại, ví dụ 'Google Play', 'App Store'. */
  tags: string[];
  /** Số phút đọc ước tính. */
  readingMinutes: number;
}

export interface Post extends PostMeta {
  /** HTML đã dựng sẵn từ markdown. */
  html: string;
}

/** 200 từ/phút là tốc độ đọc trung bình; làm tròn lên, tối thiểu 1 phút. */
function estimateReadingMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function readPostFile(slug: string): Post | null {
  const file = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;

  const raw = fs.readFileSync(file, 'utf8');
  const { data, content } = matter(raw);

  // Thiếu tiêu đề hoặc ngày thì bỏ qua bài đó thay vì dựng ra một trang hỏng.
  // Bài viết bị lỗi định dạng sẽ không xuất hiện, và build vẫn chạy tiếp.
  if (!data.title || !data.date) {
    console.warn(`[blog] bỏ qua "${slug}": thiếu title hoặc date trong phần đầu file`);
    return null;
  }

  return {
    slug,
    title: String(data.title),
    description: String(data.description ?? ''),
    date: String(data.date),
    updated: data.updated ? String(data.updated) : undefined,
    cover: data.cover ? String(data.cover) : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    readingMinutes: estimateReadingMinutes(content),
    html: marked.parse(content, { async: false }) as string,
  };
}

/** Tất cả slug có bài. Dùng cho generateStaticParams. */
export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}

export function getPost(slug: string): Post | null {
  return readPostFile(slug);
}

/** Danh sách bài, mới nhất trước. */
export function getAllPosts(): PostMeta[] {
  return getAllSlugs()
    .map(readPostFile)
    .filter((p): p is Post => p !== null)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(({ html: _html, ...meta }) => meta);
}
