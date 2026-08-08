import type { Metadata } from 'next';
import { getBlogBySlug as getStaticBlog } from '@/lib/blog-data';
import { getBlogBySlug as getAdminBlog } from '@/lib/data-store';
import { getSeoOverride, keywordsToArray } from '@/lib/seo-store';

export const dynamic = 'force-dynamic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.associatte.com';
const SITE_NAME = 'Associatte PropTech';
const ORG_LOGO = `${SITE_URL}/logos/Asoociattelogo.jpg`;

// The blog detail page is a Client Component (interactive TOC, share, reading
// progress, popups) so it can't export metadata. This server layout derives real
// per-post SEO tags + JSON-LD from the SAME data the page renders: static posts
// (lib/blog-data) and admin posts (data/blogs.json via the data store). SEO fields
// added in the admin BlogForm (metaTitle, metaDescription, metaKeywords,
// socialImage, canonicalUrl) win over the sensible fallbacks.

async function resolveBlog(slug: string): Promise<any | null> {
  // Static posts first (matches the page's resolution order), then admin posts.
  const staticPost = getStaticBlog(slug);
  if (staticPost) return staticPost;
  try {
    return await getAdminBlog(slug);
  } catch {
    return null;
  }
}

function absUrl(src?: string): string | undefined {
  if (!src || typeof src !== 'string') return undefined;
  return src.startsWith('http') ? src : `${SITE_URL}${src.startsWith('/') ? '' : '/'}${src}`;
}

function authorName(post: any): string {
  if (!post?.author) return 'Associatte PropTech';
  if (typeof post.author === 'string') return post.author;
  return post.author.name || 'Associatte PropTech';
}

function toISO(date?: string): string | undefined {
  if (!date) return undefined;
  const d = new Date(date);
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await resolveBlog(slug);

  if (!post) {
    return { title: 'Article Not Found', robots: { index: false, follow: false } };
  }

  // Admin SEO panel override (by path) wins over the post's own SEO fields.
  const override = await getSeoOverride(`/blog/${slug}`);

  const title = override?.title?.trim() || post.metaTitle?.trim() || `${post.title} | ${SITE_NAME}`;
  const description =
    override?.description?.trim() || post.metaDescription?.trim() || post.excerpt?.trim() || `${post.title} — insights from ${SITE_NAME}.`;
  const canonical = post.canonicalUrl?.trim() || `/blog/${slug}`;
  const ogImage = absUrl(post.socialImage) || absUrl(post.image2) || absUrl(post.image);
  const keywords = keywordsToArray(override?.keywords)
    || (post.metaKeywords?.trim()
      ? post.metaKeywords.split(',').map((k: string) => k.trim()).filter(Boolean)
      : Array.isArray(post.tags)
        ? post.tags
        : undefined);
  const published = toISO(post.date);
  const modified = toISO(post.updatedAt) || published;

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `${SITE_URL}${canonical.startsWith('/') ? '' : '/'}${canonical}`,
      siteName: SITE_NAME,
      locale: 'en_IN',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: post.title }] : undefined,
      publishedTime: published,
      modifiedTime: modified,
      authors: [authorName(post)],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function BlogLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await resolveBlog(slug);

  const schema: any[] = [];

  if (post) {
    const canonical = post.canonicalUrl?.trim() || `/blog/${slug}`;
    const pageUrl = `${SITE_URL}${canonical.startsWith('/') ? '' : '/'}${canonical}`;
    const image = absUrl(post.socialImage) || absUrl(post.image2) || absUrl(post.image);
    const published = toISO(post.date);

    // Article schema
    schema.push({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.metaDescription?.trim() || post.excerpt || '',
      image: image ? [image] : undefined,
      datePublished: published,
      dateModified: toISO(post.updatedAt) || published,
      author: { '@type': 'Person', name: authorName(post) },
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        logo: { '@type': 'ImageObject', url: ORG_LOGO },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
      keywords: Array.isArray(post.tags) ? post.tags.join(', ') : undefined,
      articleSection: post.category || undefined,
    });

    // FAQ schema (rich result eligibility) when the post has FAQs
    if (Array.isArray(post.faqs) && post.faqs.length > 0) {
      schema.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faqs
          .filter((f: any) => f?.question && f?.answer)
          .map((f: any) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
      });
    }

    // Breadcrumbs
    schema.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
        { '@type': 'ListItem', position: 3, name: post.title, item: pageUrl },
      ],
    });
  }

  return (
    <>
      {schema.map((entry, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
        />
      ))}
      {children}
    </>
  );
}
