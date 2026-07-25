import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PACKAGES, getPackage } from '@/lib/packages';
import { PACKAGE_FAQS } from '@/lib/faq';
import { PackageLanding } from './PackageLanding';

const BASE = 'https://te2sr.com';

export function generateStaticParams() {
  return PACKAGES.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const pkg = getPackage(params.slug);
  if (!pkg) return {};

  const url = `${BASE}/goi/${pkg.slug}`;

  return {
    title: pkg.seo.title,
    description: pkg.seo.description,
    keywords: pkg.seo.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: pkg.seo.title,
      description: pkg.seo.description,
      url,
      siteName: 'TE2SR',
      type: 'website',
      locale: 'vi_VN',
      images: [{ url: '/og.png', width: 1200, height: 630, alt: pkg.seo.h1 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: pkg.seo.title,
      description: pkg.seo.description,
      images: ['/og.png'],
    },
  };
}

export default function PackagePage({ params }: { params: { slug: string } }) {
  const pkg = getPackage(params.slug);
  if (!pkg) notFound();

  const url = `${BASE}/goi/${pkg.slug}`;

  // Structured data: the Offer itself + breadcrumbs, so Google can show price & path.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: pkg.seo.h1,
        description: pkg.seo.description,
        url,
        serviceType: 'Mobile app testing and store publishing',
        areaServed: 'Worldwide',
        provider: {
          '@type': 'Organization',
          name: 'TE2SR',
          url: BASE,
          logo: `${BASE}/icon-512.png`,
        },
        ...(pkg.priceUsd !== null
          ? {
              offers: {
                '@type': 'Offer',
                price: String(pkg.priceUsd),
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
                url,
              },
            }
          : {}),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: BASE },
          { '@type': 'ListItem', position: 2, name: 'Bảng giá', item: `${BASE}/#bang-gia` },
          { '@type': 'ListItem', position: 3, name: pkg.seo.h1, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: PACKAGE_FAQS[pkg.slug].map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PackageLanding slug={pkg.slug} shareUrl={url} />
    </>
  );
}
