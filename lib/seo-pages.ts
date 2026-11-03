// lib/seo-pages.ts
//
// The master list of STATIC public pages whose SEO is editable from the admin
// SEO panel, together with each page's built-in default meta title / description
// / keywords. This is the single source of truth: every static page derives its
// metadata from here (via `pageMetadata`), and the admin panel renders one
// editable row per entry. Dynamic detail pages (property / project / blog /
// locations) are handled separately — they carry per-item defaults and read
// their override by their live path.

import type { Metadata } from 'next';
import { getSeoOverride, keywordsToArray } from './seo-store';
import { DEFAULT_OG_IMAGE, SITE_NAME } from './seo/site';

export interface SeoPageDef {
  path: string;          // canonical route, e.g. "/buy"
  label: string;         // human label shown in the admin panel
  title: string;         // default meta title
  description: string;   // default meta description
  keywords?: string[];   // default meta keywords
  noindex?: boolean;     // keep the page live but out of search results / sitemap
}

// Keep this list in sync with the public nav. Order = display order in the panel.
export const SEO_PAGES: SeoPageDef[] = [
  {
    path: '/',
    label: 'Home',
    title: 'Associatte PropTech | Buy Verified Properties in Pune, Mumbai & KDMC',
    description:
      'Verified RERA-registered 1–4 BHK flats and new projects in Pune, Navi Mumbai & Kalyan-Dombivli. Compare prices, floor plans and builders. Free consultation.',
    keywords: [
      'Associatte PropTech',
      'properties in Pune',
      'properties in Mumbai',
      'flats in KDMC',
      'RERA registered projects',
      'buy property Maharashtra',
    ],
  },
  {
    path: '/projects',
    label: 'Projects',
    title: 'New Residential Projects in Pune, Navi Mumbai & KDMC | Associatte',
    description:
      'Browse new launch, under-construction and ready-to-move projects in Pune, Navi Mumbai and Kalyan-Dombivli from Mantra, Lodha, Birla, Shapoorji Pallonji & more.',
    keywords: ['new projects in Pune', 'new residential projects Pune', 'new projects Navi Mumbai', 'new launch projects', 'RERA registered projects Pune'],
  },
  {
    path: '/locations',
    label: 'Locations',
    title: 'Properties by City – Pune, Navi Mumbai & Kalyan-Dombivli | Associatte',
    description:
      'Explore new flats and residential projects city by city — Pune, Navi Mumbai and Kalyan-Dombivli (KDMC). See live project counts, localities and price ranges.',
    keywords: ['properties by city', 'flats in Pune', 'flats in Navi Mumbai', 'flats in Kalyan Dombivli'],
  },
  {
    path: '/properties',
    label: 'Properties',
    title: 'Properties | Residential, Commercial, Plots & More | Associatte PropTech',
    description:
      'Explore Residential, Commercial, Pre-Launch, Ready-to-Move, Rent, Plot & Resale properties in Pune, Mumbai & KDMC. Filter by type, location, budget & more.',
    keywords: ['properties', 'residential', 'commercial', 'plots', 'rent', 'resale', 'Pune', 'Mumbai', 'KDMC', 'real estate'],
  },
  {
    path: '/buy',
    label: 'Buy Property',
    // Thin page (a hero banner only) that overlaps /projects — not indexed.
    noindex: true,
    title: 'Buy Property | Associatte PropTech',
    description:
      'Explore flats, villas, and investment properties in Pune, Mumbai and KDMC. Find your dream home today.',
  },
  {
    path: '/builders',
    label: 'Know Your Developer',
    title: 'Know Your Developer | Trusted Builders in Pune, Mumbai & KDMC',
    description: 'Explore verified projects from top developers like Mantra, Lodha, Paradise Group & more.',
    keywords: ['builders', 'developers', 'Pune', 'Mumbai', 'KDMC', 'real estate'],
  },
  {
    path: '/about-us',
    label: 'About Us',
    title: 'About Us | Associatte PropTech',
    description:
      'Learn about Associatte PropTech Pvt Ltd — your trusted real estate partner for verified properties across Pune, Mumbai and KDMC.',
    keywords: ['about Associatte', 'real estate company Pune', 'property consultants'],
  },
  {
    path: '/services',
    label: 'Services',
    title: 'Our Services | Associatte PropTech',
    description:
      'Property consultation, home loans, legal assistance, property management and investment advisory — end-to-end real estate services from Associatte PropTech.',
    keywords: ['property consultation', 'home loans', 'legal assistance', 'property management', 'investment advisory'],
  },
  {
    path: '/blog',
    label: 'Blog',
    title: 'Real Estate Blog | Associatte PropTech',
    description:
      'Insights, market trends, buying guides and investment tips for property buyers across Pune, Mumbai and KDMC.',
    keywords: ['real estate blog', 'property investment tips', 'home buying guide', 'Pune property market'],
  },
  {
    path: '/contact-us',
    label: 'Contact Us',
    title: 'Contact Us | Associatte PropTech',
    description:
      'Get in touch with Associatte PropTech for verified properties, free consultation and expert guidance across Pune, Mumbai and KDMC.',
    keywords: ['contact Associatte', 'real estate enquiry', 'property consultation Pune'],
  },
  {
    path: '/terms-conditions',
    label: 'Terms & Conditions',
    title: 'Terms of Service | Associatte',
    description:
      'Terms of Service for Associatte PropTech Private Limited - Read our terms and conditions for using our website and services.',
  },
  {
    path: '/privacy-policy',
    label: 'Privacy Policy',
    title: 'Privacy Policy | Associatte',
    description:
      'Privacy Policy for Associatte PropTech Pvt Ltd - Learn how we collect, protect, and use your personal information.',
  },
  {
    path: '/cookie-policy',
    label: 'Cookie Policy',
    title: 'Cookie Policy | Associatte',
    description:
      'Cookie Policy for Associatte PropTech Private Limited - Learn about how we use cookies to improve your experience on our website.',
  },
];

export function seoPageByPath(path: string): SeoPageDef | undefined {
  return SEO_PAGES.find((p) => p.path === path);
}

/**
 * Build a page's Metadata for a STATIC page: default (from SEO_PAGES) merged with
 * any admin override stored for that path. Titles are `absolute` so the root
 * layout's "%s | Associatte PropTech" template never double-appends the brand.
 */
export async function pageMetadata(path: string): Promise<Metadata> {
  const def = seoPageByPath(path);
  const override = await getSeoOverride(path);

  const title = override?.title?.trim() || def?.title || 'Associatte PropTech';
  const description = override?.description?.trim() || def?.description || '';
  const keywords = keywordsToArray(override?.keywords) || def?.keywords;
  const canonical = path;

  return {
    title: { absolute: title },
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical },
    ...(def?.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: 'website',
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: 'en_IN',
      images: [{ url: DEFAULT_OG_IMAGE, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}
