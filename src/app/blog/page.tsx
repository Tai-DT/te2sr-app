import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { organizationSchema } from '@/lib/structured-data';
import { getAllPosts } from '@/lib/blog';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hướng dẫn đưa app lên Store',
  description:
    'Bài viết về closed testing Google Play, quy trình duyệt App Store, ASO và những lỗi khiến app bị từ chối — viết từ kinh nghiệm làm thật, kèm ảnh chụp màn hình.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Hướng dẫn đưa app lên Store — TE2SR',
    description: 'Closed testing Google Play, quy trình duyệt App Store, ASO — viết từ kinh nghiệm làm thật.',
    url: 'https://te2sr.com/blog',
  },
};

/** Ngày phải render giống nhau ở server và trình duyệt, nên format thủ công. */
function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <JsonLd data={organizationSchema} />
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-12 sm:py-16">
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-brand-blue text-[11px] font-extrabold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" aria-hidden />
            Kiến thức đưa app lên Store
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight">
            Hướng dẫn từ việc làm thật
          </h1>
          <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
            Những gì chúng tôi gặp khi đưa app của khách qua closed testing và vòng duyệt của Google
            Play, App Store. Có ảnh chụp màn hình thật, không viết chung chung.
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="text-sm text-slate-500">Chưa có bài viết nào.</p>
        ) : (
          <div className="space-y-4">
            {posts.map((p) => (
              <article
                key={p.slug}
                className="rounded-2xl border border-slate-200 bg-white shadow-apple-sm overflow-hidden hover:border-brand-blue/40 transition-colors"
              >
                <Link href={`/blog/${p.slug}`} className="block p-5">
                  {p.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-600"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <h2 className="text-lg font-extrabold text-slate-900 leading-snug">{p.title}</h2>
                  <p className="mt-1.5 text-[13px] text-slate-600 leading-relaxed">{p.description}</p>
                  <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-500 font-semibold">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" aria-hidden />
                      {formatDate(p.date)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" aria-hidden />
                      {p.readingMinutes} phút đọc
                    </span>
                    <span className="ml-auto inline-flex items-center gap-1 text-brand-blue font-bold">
                      Đọc tiếp
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden />
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
