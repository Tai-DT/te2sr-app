import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { organizationSchema } from '@/lib/structured-data';
import { getAllSlugs, getPost } from '@/lib/blog';
import { Calendar, Clock, ArrowLeft, MessageSquare } from 'lucide-react';

const SITE = 'https://te2sr.com';

/** Bắt buộc với output: 'export' — Next cần biết trước danh sách trang để dựng. */
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return { title: 'Không tìm thấy bài viết' };

  const url = `${SITE}/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      images: post.cover ? [{ url: post.cover }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.cover ? [post.cover] : undefined,
    },
  };
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  // Schema Article giúp công cụ AI biết đây là bài viết có tác giả và ngày
  // tháng, thay vì một trang bất kỳ — tăng khả năng được trích dẫn.
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: { '@id': `${SITE}/#organization` },
    publisher: { '@id': `${SITE}/#organization` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}/blog/${post.slug}` },
    ...(post.cover ? { image: `${SITE}${post.cover}` } : {}),
    inLanguage: 'vi',
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <JsonLd data={organizationSchema} />
      <JsonLd data={articleSchema} />
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-10 sm:py-14">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-blue transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden />
          Tất cả bài viết
        </Link>

        <header className="mt-4 pb-6 border-b border-slate-200">
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-[10px] font-bold text-brand-blue"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight leading-tight">
            {post.title}
          </h1>
          {post.description && (
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">{post.description}</p>
          )}
          <div className="mt-4 flex items-center gap-4 text-[11px] text-slate-500 font-semibold">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" aria-hidden />
              {formatDate(post.date)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" aria-hidden />
              {post.readingMinutes} phút đọc
            </span>
          </div>
        </header>

        {/* Kiểu chữ cho nội dung markdown — đặt ở globals.css dưới .blog-body */}
        <div className="blog-body mt-7" dangerouslySetInnerHTML={{ __html: post.html }} />

        <aside className="mt-12 p-5 rounded-2xl border border-blue-200 bg-blue-50">
          <h2 className="font-extrabold text-slate-900 text-base">Cần chạy closed testing cho app của bạn?</h2>
          <p className="mt-1.5 text-[13px] text-slate-700 leading-relaxed">
            TE2SR chạy đủ 12 tester trong 14 ngày trên thiết bị thật, và bàn giao báo cáo lỗi kèm ảnh
            chụp màn hình cùng các bước tái hiện.
          </p>
          <Link
            href="/services/testing"
            className="mt-3.5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white text-xs font-extrabold shadow-brand-blue transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" aria-hidden />
            Xem dịch vụ kiểm thử
          </Link>
        </aside>
      </main>

      <Footer />
    </div>
  );
}
