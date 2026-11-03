// lib/seo/jsonld.tsx
//
// Small helpers for emitting JSON-LD from Server Components so structured data
// is present in the initial HTML Google receives.

import { SITE_URL, canonicalUrl } from './site';

type Json = Record<string, unknown>;

/** Drop undefined / null / empty-string / empty-array values (recursively). */
export function compact<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(compact).filter((v) => v !== undefined) as unknown as T;
  }
  if (value && typeof value === 'object') {
    const out: Json = {};
    for (const [k, v] of Object.entries(value as Json)) {
      if (v === undefined || v === null || v === '') continue;
      if (Array.isArray(v) && v.length === 0) continue;
      out[k] = compact(v);
    }
    return out as T;
  }
  return value;
}

/** Render one or more JSON-LD objects. `<` is escaped so content can't close the script tag. */
export function JsonLd({ data }: { data: Json | Json[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(compact(item)).replace(/</g, '\\u003c'),
          }}
        />
      ))}
    </>
  );
}

export interface Crumb {
  name: string;
  path: string;
}

/** BreadcrumbList for a trail of site paths, always starting at Home. */
export function breadcrumbJsonLd(trail: Crumb[]): Json {
  const all: Crumb[] = [{ name: 'Home', path: '/' }, ...trail];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: all.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: canonicalUrl(c.path),
    })),
  };
}

/** Reference to the site-wide Organization node (defined once in the root layout). */
export const ORG_REF = { '@id': `${SITE_URL}/#organization` };
