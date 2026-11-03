// lib/seo/blogs.ts
//
// Blog SEO: one merged list of public posts (static posts in lib/blog-data +
// admin-created posts in the data store), a quality check, and metadata/JSON-LD
// built strictly from each post's own fields.

import { getAllBlogs as getStaticBlogs, getBlogBySlug as getStaticBlog, type BlogPost } from '@/lib/blog-data';
import { getAllBlogs as getAdminBlogs, getBlogBySlug as getAdminBlog } from '@/lib/data-store';
import type { IBlog } from '@/lib/models/Blog';
import { SITE_URL, SITE_NAME, ORG_LOGO, absoluteUrl, canonicalUrl, clampText, toIsoDate } from './site';

/** Extra SEO fields the admin BlogForm may persist on a record. */
export type BlogExtraFields = {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  socialImage?: string;
  canonicalUrl?: string;
  updatedAt?: string;
  createdAt?: string;
  // Optional publishing flags — honoured if the CMS ever starts saving drafts.
  status?: string;
  draft?: boolean;
  published?: boolean;
};

export type PublicBlog = BlogPost & BlogExtraFields;

function fromAdmin(b: IBlog): PublicBlog {
  return {
    ...(b as unknown as PublicBlog),
    id: String(b._id || b.slug),
    tags: b.tags || [],
    relatedSlugs: b.relatedSlugs || [],
  };
}

/** A post is publicly published unless it is explicitly marked as a draft/unpublished. */
export function isBlogPublished(b: Partial<PublicBlog> | null | undefined): boolean {
  if (!b?.slug || !b.title) return false;
  if (b.draft === true || b.published === false) return false;
  const status = String(b.status || '').toLowerCase();
  if (status && status !== 'published') return false;
  return true;
}

/** Static post first (matches the existing page's resolution order), then admin posts. */
export async function findBlog(slug: string): Promise<PublicBlog | null> {
  const s = getStaticBlog(slug);
  if (s) return s;
  try {
    const a = await getAdminBlog(slug);
    return a ? fromAdmin(a) : null;
  } catch {
    return null;
  }
}

/** All published posts, newest first. Admin posts override static ones with the same slug. */
export async function getPublicBlogs(): Promise<PublicBlog[]> {
  const bySlug = new Map<string, PublicBlog>();
  for (const b of getStaticBlogs()) bySlug.set(b.slug, b);
  const admin = await getAdminBlogs().catch(() => [] as IBlog[]);
  for (const b of admin) if (b?.slug) bySlug.set(b.slug, fromAdmin(b));
  return Array.from(bySlug.values())
    .filter(isBlogPublished)
    .sort((a, b) => (Date.parse(b.updatedAt || b.date) || 0) - (Date.parse(a.updatedAt || a.date) || 0));
}

function plainText(html: string): string {
  return String(html || '').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();
}

/** Index only published posts with a real body (≈ 250+ words of text). */
export function blogEligibility(b: PublicBlog): { indexable: boolean; reasons: string[] } {
  const reasons: string[] = [];
  if (!isBlogPublished(b)) reasons.push('not published');
  const words = plainText(b.content).split(' ').filter(Boolean).length;
  if (words < 250) reasons.push(`thin content (${words} words)`);
  if (!b.excerpt && !b.metaDescription) reasons.push('missing excerpt/description');
  return { indexable: reasons.length === 0, reasons };
}

export function blogPath(slug: string): string {
  return `/blog/${slug}`;
}

/**
 * The admin form allows a custom canonical. Accept it only when it points at
 * this site (relative path or our own origin) — never at another domain.
 */
export function blogCanonicalPath(b: PublicBlog): string {
  const custom = b.canonicalUrl?.trim();
  if (custom) {
    if (custom.startsWith('/')) return custom;
    if (custom.startsWith(SITE_URL)) return custom.slice(SITE_URL.length) || '/';
  }
  return blogPath(b.slug);
}

export function blogAuthorName(b: Partial<PublicBlog>): string {
  const a = b.author as unknown;
  if (!a) return '';
  if (typeof a === 'string') return a.trim();
  return String((a as { name?: string }).name || '').trim();
}

export function blogDates(b: PublicBlog): { published?: string; modified?: string } {
  const published = toIsoDate(b.date) || toIsoDate(b.createdAt);
  const modified = toIsoDate(b.updatedAt) || published;
  return { published, modified };
}

export function blogDescription(b: PublicBlog): string {
  return clampText(b.metaDescription?.trim() || b.excerpt?.trim() || plainText(b.content), 160);
}

export function blogImage(b: PublicBlog): string | undefined {
  return absoluteUrl(b.socialImage) || absoluteUrl(b.image) || absoluteUrl(b.image2);
}

export function blogJsonLd(b: PublicBlog) {
  const url = canonicalUrl(blogCanonicalPath(b));
  const { published, modified } = blogDates(b);
  const author = blogAuthorName(b);
  const image = blogImage(b);

  const article = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: clampText(b.title, 110),
    description: blogDescription(b),
    image: image ? [image] : undefined,
    datePublished: published,
    dateModified: modified,
    // Real byline if the post has one; otherwise the publishing organisation.
    author: author
      ? { '@type': 'Person', name: author }
      : { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: ORG_LOGO },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    articleSection: b.category || undefined,
    keywords: Array.isArray(b.tags) && b.tags.length ? b.tags.join(', ') : undefined,
    inLanguage: 'en-IN',
  };

  const faqs = (b.faqs || []).filter((f) => f?.question && f?.answer);
  const faq = faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      }
    : null;

  return { article, faq };
}
