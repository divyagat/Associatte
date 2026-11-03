// lib/seo/revalidate.ts
//
// Called by the admin write APIs so a newly published/edited/deleted blog or
// project shows up (or disappears) on the site, in internal links and in the
// sitemaps right away instead of after the 5–10 minute cache window.
// Never throws: a failed revalidation must not fail the admin's save.

import { revalidatePath } from 'next/cache';

function safe(path: string, type?: 'page' | 'layout') {
  try {
    if (type) revalidatePath(path, type);
    else revalidatePath(path);
  } catch (error) {
    console.error(`revalidatePath(${path}) failed:`, error);
  }
}

function sitemaps() {
  safe('/sitemap.xml');
  safe('/sitemaps/[name]', 'page');
}

export function revalidateBlog(slug?: string) {
  if (slug) safe(`/blog/${slug}`);
  safe('/blog');
  safe('/');
  sitemaps();
}

export function revalidateListing(slug?: string) {
  if (slug) safe(`/property/${slug}`);
  // City, builder and listing pages all show project cards/links.
  safe('/locations/[city]', 'layout');
  safe('/builders/[slug]', 'page');
  safe('/projects');
  safe('/properties');
  safe('/');
  sitemaps();
}
