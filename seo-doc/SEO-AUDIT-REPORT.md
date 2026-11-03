# SEO Audit Report: Associatte PropTech (www.associatte.com)

**Date:** 2 Nov 2026 · **Branch:** `seo/technical-seo-overhaul`

## 0. Scope note: which site this covers

The brief named **Mappingg.com**, but this repository is the **Associatte PropTech** site at **https://www.associatte.com**:
- The live robots.txt, `<title>` and canonical on associatte.com match this code exactly.
- www.mappingg.com is a separate live Next.js site with different routes (`/map`, `/s-admin`, `/dashboard`, `/intake`, `/partners/`, `/rest/`), none of which exist here.

On confirmation, all work keeps **www.associatte.com** as the canonical domain. Pointing this code at mappingg.com would have told Google to drop associatte.com. To audit Mappingg, run this process in that site's repository.

The stack also differs from the brief. It is **MongoDB** (a `jsondocs` collection holding JSON documents, with `data/*.json` seed files as fallback), not PostgreSQL/Prisma.

## 1. Method

1. Read every route under `app/`, the data layer (`lib/data-store.ts`, `lib/blob-store.ts`), the metadata helpers, `robots.ts`, `sitemap.ts`, `proxy.ts` and `next.config.ts`.
2. Took a **read-only** snapshot of production MongoDB, skipping leads and admin data, to count real records.
3. Fetched the **live production HTML** of representative pages and every sitemap URL, with a Googlebot smartphone user agent. Tool: `scripts/seo-audit.mjs`.
4. Re-ran the same automated audit against a local production build (`next build && next start`) after the fixes.

## 2. Data inventory (production MongoDB)

| Content | Records | Notes |
|---|---|---|
| Projects (`data/projects.json`) | 33 | All legacy records without `status`, so treated as **published**. No duplicate slugs or names. |
| Properties (`data/properties.json`) | 0 | Not in MongoDB yet; the seed file is empty. |
| Blog posts | 6 | 5 static posts in `lib/blog-data.ts` plus 1 admin post (slug `sad`). |
| News items | 6 | Excerpts of 135–150 characters, no article body and no source URL. |
| Cities with projects | 3 | `pune` (24), `mumbai` (6: 5 Navi Mumbai + 1 Dombivli), `kdmc` (3) |
| Developers with projects | 12 | |

## 3. Problems found in production (before)

Same checker run against **https://www.associatte.com**: **61 failures** across 48 sitemap URLs plus edge cases.

### Critical
| # | Problem | Evidence |
|---|---|---|
| C1 | **Root layout set `canonical: "/"` for the whole site.** Any page without its own canonical declared itself a duplicate of the homepage. | `/builders/mantra`, `/builders/pune`, `/enquiry-test` and the 404 page all had `canonical=https://www.associatte.com` |
| C2 | **Main project pages (`/property/[slug]`) were client-rendered.** Google's initial HTML had only "Loading project details…": no H1, no specs. JSON-LD sat in `next/head`, which does nothing in the App Router. | Live HTML: `h1=0`, loading shell |
| C3 | **Blog articles were client-rendered**, with the same loading shell and no H1 in the HTML. | `/blog/factors-drive-property-appreciation`: `h1=0` |
| C4 | **Homepage bailed out to client-side rendering** (`useSearchParams` inside a static page). The HTML was about 3 KB of text with no hero, no H1 and no project links. | `BAILOUT_TO_CLIENT_SIDE_RENDERING` in the live HTML |
| C5 | **Duplicate project URLs.** Each project existed at both `/projects/[slug]` and `/property/[slug]`, each canonicalised to itself. The sitemap listed only `/projects/…`, while every internal link (18 places) pointed to `/property/…`. | |
| C6 | **Fuzzy slug matching** on `/projects/[slug]` meant any URL that partially matched a project name returned 200 with a self-canonical, creating unlimited duplicate URLs. | `/projects/mantra` served "Mantra One Residency" |
| C7 | **Soft 404s.** Unknown projects, blogs and cities returned **200**. | `/property/doesnotexist`, `/blog/<anything>` and `/locations/xyz` (generic "Maharashtra" page) all returned 200 |
| C8 | **robots.txt blocked `/_next/`**, the CSS and JS Google needs to render pages. | |
| C9 | **Header navigation missing from the HTML** on static pages (`Suspense fallback={null}`). | |
| C10 | **Made-up RERA data on project pages.** The "RERA Details" box showed a hard-coded `P51800012345` whenever a project had no number, and a "RERA Verified" badge appeared for any non-empty value, including the placeholder "Comming Soon" (3 projects: `lodha-mundhwa`, `mantra-codename-paradise`, `sai-world-one`). | `PropertyPageClient.jsx` (was `page.jsx`) |

### High
| # | Problem |
|---|---|
| H1 | Sitemap omitted 5 of 6 blog posts (only admin posts were read), all builder pages and `/locations`, and used `new Date()` as `lastmod` for every static page. |
| H2 | `/property/[slug]` metadata read the **bundled JSON file**, not MongoDB. A project added in the admin panel would get "Property Not Found" plus `noindex`. |
| H3 | Builder pages had **no metadata**: homepage title and homepage canonical. |
| H4 | Misleading structured data. City pages marked every project as a `Product` with an `Offer` price parsed from "₹2.4 Cr" (giving 2.4). The client schema on project pages used `datePosted: now`, an invented `GovernmentPermit`, sq ft labelled as `SQM`, and `propfinder.in` URLs. |
| H5 | Duplicate or incorrect titles: `/news` ("…\| Associatte PropTech \| Associatte PropTech"), `/calculator`, the 404 page ("Page Not Found \| YourBrand"), and `/locations` (inherited the homepage title). |
| H6 | Blog listing (`/blog`) had **no article links** in its HTML; posts loaded in `useEffect`. |
| H7 | FAQ answers in blog posts only existed in the DOM once expanded, while FAQ schema described them. |

### Medium / low
- Two `<h1>` elements on the homepage (desktop and mobile hero).
- Invented counts on the homepage and `/locations` city cards ("48 Projects" for Mumbai against 6 real; 37 for Navi Mumbai; 12 for Thane, which has none).
- Thane and Navi Mumbai cards linked to empty pages; a "Contact us" link pointed to `/contact` (404).
- Breadcrumbs on project pages linked to `/locations/navi mumbai`, `/locations/dombivli` and similar, which don't exist.
- `/buy` is a thin page (hero banner only) that overlaps `/projects`.
- News detail pages are about 150-character excerpts: thin.
- A second, conflicting `RealEstateAgent` JSON-LD on the homepage with `?city=` URLs.
- Deprecated sitelinks `SearchAction` in the WebSite schema.
- Unneeded Google Fonts preconnects (fonts are self-hosted by `next/font`).
- Detail routes were fully dynamic (no static generation), which is slower for first byte.
- **Dynamic pages streamed `<title>` into `<body>` for Googlebot** on slow renders: 39 of the production pages checked had no `<title>` in `<head>` for the Googlebot user agent.

## 4. Content and data issues (not changed: need an editor)

These need human judgement or new content, so code doesn't change them:

| Issue | Where | Recommendation |
|---|---|---|
| Blog slug is `sad` | Admin post "Signs That a Property in Pune Will Deliver Strong Returns…" | Re-save with a descriptive slug and add a 301 from `/blog/sad`. |
| 3 static posts are 116–128 words | `mantra-codename-paradise-sus-pune`, `budget-homes-pune-under-75-lakhs`, `navi-mumbai-airport-impact-real-estate` | Expand to at least 250 useful words. They are now `noindex, follow` and will be indexed automatically once expanded. |
| Project text contradicts its location | `mantra-one-residency`: `about` says "Wakad… Hinjewadi", `fullLocation` says Magarpatta | Correct the description. |
| `lodha-premier` city is `"kdmc "` | Trailing space and wrong value in `fullLocation.city` | Set the city to "Kalyan". |
| 7 broken image paths | `/public/gallery/mayfair-gallery4.webp`, `/floorplans/treetopia-3bhk.webp`, `/gallery/trump-5.webp`, `/gallery/trump-6.webp`, `/floorplans/sai-1bhk.webp`, `/floorplans/sai-2bhk.webp`, `/floorplans/sai-3bhk.webp` | Fix the paths or upload the files. |
| Invented engagement on blog pages | "24 Comments", "2.8K Views", random like counts, 5-star author badge | Remove, or wire to real data. These are UI only (not in schema), but they are not truthful. |
| Marketing figures | Org schema "25+ years, 10,000+ clients"; `/locations` stats "150+ projects, 12+ cities" | Confirm they are accurate. |
| `/projects` and `/properties` list the same 33 projects | No properties exist yet | Differentiate once sale/rent listings are added. |
