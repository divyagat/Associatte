# SEO Implementation Report: Associatte PropTech

**Branch:** `seo/technical-seo-overhaul` (not merged, not deployed) · **Canonical origin:** `https://www.associatte.com`

## Results at a glance

| Check | Production today | This branch (local production build) |
|---|---|---|
| Automated audit failures (`npm run seo:audit`) | **61** | **0** |
| Sitemap URLs | 48 (incl. 33 duplicate `/projects/…` URLs) | 66 canonical URLs in 5 sitemaps |
| Project pages with H1 and content in the initial HTML | 0 of 33 on the linked URL | 33 of 33 |
| Blog articles with H1 in the initial HTML | 0 | 6 of 6 |
| Soft 404s (unknown slug → 200) | 4 tested routes | 0 |
| Pages canonicalised to the homepage by mistake | builders, 404, test page | 0 |
| Broken internal links | 3 (`/locations/navi-mumbai`, `/locations/thane`, `/contact`) | 0 |
| Remaining warnings | — | 5 titles over 75 characters (3 blog titles, 2 long project names) |

## What changed

### Phase 3: technical foundation
- **`lib/seo/site.ts`** (new): one source for the canonical origin, brand, `absoluteUrl()`, `canonicalUrl()`, `clampText()` and `toIsoDate()` (rejects invalid and future dates).
- **`lib/seo/jsonld.tsx`** (new): `<JsonLd>` renders schema in Server Components, escapes `<`, and drops empty fields. Also `breadcrumbJsonLd()`.
- **`app/layout.tsx`**: removed the site-wide `canonical: "/"` and `og:url`. Each page sets its own now. `lang="en-IN"`. WebSite schema gets an `@id` linked to the Organization, and the retired SearchAction is gone. Removed the unneeded font preconnects.
- **`next.config.ts`**: `htmlLimitedBots` now includes **Googlebot**, so `<title>`, canonical and robots are always in `<head>` for search crawlers rather than streamed into `<body>`.
- **`proxy.ts`**: mixed-case `/property/…`, `/locations/…` and `/builders/…` URLs 308-redirect to lowercase. Admin auth logic is unchanged.
- **`app/robots.ts`**: no longer blocks `/_next/`. Blocks `/admin`, `/api/` and `/user/`, but allows `/api/images/` (where admin uploads are served). Test pages use `noindex` instead of `Disallow`, so Google can see the noindex.
- **`app/not-found.tsx`**: proper title, `noindex`, and helpful links. The 404 no longer inherits a canonical.

### Phase 4: project pages (highest priority)
- **`lib/seo/listings.ts`** (new):
  - **Data access**: listings read from MongoDB via the data store. Lookup is exact or case-insensitive by slug; **no fuzzy matching**.
  - **Eligibility**: indexed only if published, with a clean slug, name, location and main image, enough unique content (80+ character description, or configurations plus 3+ amenities), and not a duplicate (same name and area as an earlier listing). Otherwise the page stays live for users with `noindex, follow`.
  - **Title**, built from real fields: `Mantra One Residency – 2, 3 & 4 BHK Flats in Magarpatta, Pune | Associatte`.
  - **Description**: developer, location, BHK mix, price (only if numeric), launch/ready status, possession date and MahaRERA number when present. Clamped to about 160 characters.
  - **JSON-LD**: `WebPage` → `about` an `ApartmentComplex` (residential) or `Place` (plots/commercial), with address, geo, amenities and the RERA number as a `PropertyValue`. Plus `BreadcrumbList`. **No Offer, price, rating or review**, because prices are "onwards" estimates.
- **`app/property/[slug]/page.tsx`** (new server page): loads the listing, returns a real **404** for unknown or unpublished slugs, a **308** for case variants, emits JSON-LD, computes similar projects (same city, same area first), and is **prerendered** via `generateStaticParams` with 5-minute ISR.
- **`PropertyPageClient.jsx`** (was `page.jsx`): unchanged UI. It now takes `initialProject` from the server, so it renders immediately without a client fetch. Removed the dead `next/head` block and misleading schema generators. Breadcrumbs link only to real city pages. The hero image has `fetchPriority="high"`. Gallery alt text is now "{Project} – photo n of N".
- **RERA truthfulness**: removed the hard-coded fallback RERA number `P51800012345`. The "RERA Verified" badge, the "Registered with MahaRERA" text, meta descriptions and JSON-LD now appear only for real registration numbers (6+ digits). Placeholders show "RERA registration details are awaited."
- **`app/projects/[slug]/page.tsx`**: published listings **308-redirect** to `/property/[slug]`. Unknown slugs 404. Unpublished listings are an **admin-only preview** (`noindex`), keeping the previous preview capability.

### Phase 5: blog automation
- **`lib/seo/blogs.ts`** (new): merges static and admin posts. Respects a `draft` / `published:false` / `status` flag if the CMS ever adds one; today every saved post is published. Eligibility requires 250+ words and an excerpt. Admin `canonicalUrl` is accepted **only** for this site's own URLs. Dates come from the post (`date`, `updatedAt`), never "now".
- **`app/blog/[slug]/page.tsx`** (new server page) plus **`BlogDetailClient.tsx`**: the article, H1, body and FAQs are in the initial HTML. Unknown slugs 404. Related posts come from the merged list (explicit related slugs, then same category or city). Adds an **"Explore projects in {city}"** block linking to real project pages.
- **`app/blog/[slug]/layout.tsx`**: metadata (override, then post SEO fields, then defaults), OG `article` with published/modified times, author, section and tags. JSON-LD `BlogPosting` (author is a Person if the post has a byline, otherwise the Organization), `FAQPage` when FAQs exist, `BreadcrumbList`.
- **`app/blog/page.tsx`** (new server page) plus **`BlogListingClient.tsx`**: every article link is in the HTML. The H1 now describes the page ("Real Estate Insights & Buying Guides").
- FAQ answers are always in the DOM (`hidden` until opened, with `aria-expanded`).
- **Publishing automation** (`lib/seo/revalidate.ts`): blog, project and property create/update/delete APIs, and the admin SEO panel, now call `revalidatePath` for the item, listings, homepage and sitemaps. **A newly published post is live, linked from `/blog`, and in `/sitemaps/blogs.xml` immediately.**

### Phase 6: cities, developers, other pages
- **`app/locations/[city]/layout.tsx`**: only cities with live projects are served (pune, mumbai, kdmc); anything else 404s. Uppercase variants redirect. Descriptions are generated from live data (project count, top localities, BHK range, developers). Breadcrumb JSON-LD. Prerendered.
- **City page JSON-LD**: the `Product`/`Offer` list was replaced with an honest `ItemList` of project URLs. "Kdmc" is displayed as "Kalyan-Dombivli".
- **`app/builders/[slug]/page.tsx`**: real metadata ("Mantra Developers Projects in Pune"), live data from MongoDB instead of the bundled JSON, breadcrumbs, prerendered. `/builders/pune|mumbai|kdmc` (duplicates of city pages) are `noindex, follow` and canonical to `/locations/{city}`.
- **`app/locations/layout.tsx`** (new): metadata for `/locations`.
- `/news` and `/awards` titles de-duplicated; OG images added. `/calculator` title fixed.
- News items: canonical, plus `noindex, follow` unless the body has 150+ words (currently all 6 are excerpts). Metadata moved to `app/news/[id]/layout.tsx` so 404s get it too.
- `/buy` (thin): `noindex, follow` and left out of the sitemap, via a new `noindex` flag in `lib/seo-pages.ts`.
- `/enquiry-test`: `noindex, nofollow`.
- `lib/seo-pages.ts`: better default title and description for `/projects`, a new `/locations` entry, and a shorter homepage description. Admin overrides still win.

### Phase 7: internal linking and images
- **Homepage** (`app/page.tsx` server wrapper → `components/Home/HomePageClient.tsx`) renders on the server. Hero, project carousels, developer and blog sections are now in the HTML (14 project links). The duplicate RealEstateAgent schema was removed. The mobile hero heading is a `<p>`, leaving one H1.
- **Header**: the full navigation renders in the Suspense fallback, so the nav links are in the HTML of every page.
- **City cards** (homepage and `/locations`) use real live counts (`lib/location-cards.ts`). Cards without projects are hidden. Navi Mumbai links to `/locations/mumbai`, where those projects are listed. `/contact` was fixed to `/contact-us`.
- **Image sitemap**: project sitemap entries include up to 10 images (main, gallery, floor plans).

### Phase 8: sitemaps
- `app/sitemap.ts` was replaced with a **sitemap index** at `/sitemap.xml` (`app/sitemap.xml/route.ts`) plus per-type sitemaps at `/sitemaps/{static,projects,blogs,locations,developers}.xml` (`app/sitemaps/[name]/route.ts`, `lib/seo/sitemap.ts`).
- They list only canonical, public, indexable URLs. `lastmod` appears only where a real modification date exists: projects use `updatedAt`, blogs use the post date, cities and developers use the newest project. Future dates are rejected. Any type automatically splits into `-2.xml`, `-3.xml`… past 45,000 URLs (Google's limit is 50,000).

## Files

**New:** `lib/seo/site.ts`, `lib/seo/jsonld.tsx`, `lib/seo/listings.ts`, `lib/seo/blogs.ts`, `lib/seo/sitemap.ts`, `lib/seo/revalidate.ts`, `lib/location-cards.ts`, `app/page.tsx`, `app/property/[slug]/page.tsx`, `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`, `app/locations/layout.tsx`, `app/news/[id]/layout.tsx`, `app/enquiry-test/layout.tsx`, `app/sitemap.xml/route.ts`, `app/sitemaps/[name]/route.ts`, `scripts/seo-audit.mjs`, `seo-doc/*`

**Renamed (UI preserved):** `app/page.tsx` → `components/Home/HomePageClient.tsx`; `app/property/[slug]/page.jsx` → `PropertyPageClient.jsx`; `app/blog/page.tsx` → `BlogListingClient.tsx`; `app/blog/[slug]/page.tsx` → `BlogDetailClient.tsx`

**Removed:** `app/sitemap.ts` (replaced by the index), `app/property/[slug]/layout.tsx` (metadata moved into the page)

**Modified:** `app/layout.tsx`, `app/robots.ts`, `app/not-found.tsx`, `app/projects/[slug]/page.tsx`, `app/blog/[slug]/layout.tsx`, `app/locations/[city]/layout.tsx`, `app/locations/[city]/page.tsx`, `app/locations/page.tsx`, `app/builders/[slug]/page.tsx`, `app/news/layout.tsx`, `app/news/[id]/page.tsx`, `app/awards/layout.tsx`, `app/awards/page.tsx`, `app/calculator/page.tsx`, `app/api/{blogs,projects,properties}/**/route.ts`, `app/api/admin/seo/route.ts`, `components/Layout/Header.tsx`, `components/Home/Hero.tsx`, `components/SEO/OrganizationSchema.tsx`, `components/sections/PropertyTypesSection.tsx`, `lib/seo-pages.ts`, `next.config.ts`, `proxy.ts`, `package.json` (`seo:audit` script)

**Not touched:** database contents, project or blog data, authentication, admin dashboard, API response shapes, design.

## Verification actually run

| Check | Result |
|---|---|
| `tsc --noEmit` | ✅ pass (also passed before) |
| `eslint .` | 55 errors / 102 warnings, **identical to baseline**. All are pre-existing (e.g. `set-state-in-effect`, unescaped `'`). The new files lint clean. |
| `next build` | ✅ pass. 92 pages generated, including 33 project, 6 blog, 3 city and 12 builder pages prerendered. |
| Automated tests | None exist in the repo. |
| `npm run seo:audit http://localhost:3100` (Googlebot UA) | ✅ **0 failures**, 5 warnings (long titles). 66 sitemap URLs: each returns 200, has one H1 in server HTML, title and description, a canonical equal to its sitemap URL, no noindex, OG and Twitter tags, and JSON-LD that parses with no ratings or reviews. 73 internal links all return 200. 19 edge-case status, redirect and noindex checks pass. |
| Sitemap XML | Index plus 5 urlsets are well-formed, on the canonical origin, with no duplicates, no future `lastmod`, and under 50k URLs each. |
| Image sitemap URLs | 259 checked over HTTP; **7 return 404** (data problems listed in the audit report). |
| Mobile performance / Core Web Vitals | **Not measured.** Lighthouse/PageSpeed was not run, and field data needs Search Console. Expected wins: hero and content in the initial HTML, prerendered detail pages, no font preconnects. Run PageSpeed Insights after deploy. |
| Google Rich Results Test / Schema Markup Validator | **Not run** (external tools). JSON-LD was validated for syntax and content only. Run them after deploy (see checklist). |

## Known trade-offs
- **The homepage is rendered per request** (it reads `searchParams`). This is needed so its `useSearchParams`-based UI renders on the server instead of bailing out to the client. It costs one server render per visit; monitor TTFB after deploy.
- The **header fallback** renders the nav once on the server and again after hydration, so `/api/site-config` is fetched one extra time on static pages.
- Three short static blog posts and all news items are now `noindex` until they have real content. If any currently receive search traffic, expanding them should be the first content task.
