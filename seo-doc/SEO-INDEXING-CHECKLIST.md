# SEO Indexing Checklist and Google Search Console Guide

Nothing on this list has been done in Search Console yet. **No page is "indexed" until Search Console's URL Inspection says so.** Submitting a sitemap or requesting indexing does not guarantee it.

## Search Console integration status

- **No Search Console API integration exists in the repo**, and no OAuth or service-account credentials were found. None was added: the site doesn't need one to be indexed, and an API integration would mean storing Google credentials server-side for little gain at this size.
- The site **already supports HTML-tag verification**: set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and `app/layout.tsx` outputs `<meta name="google-site-verification">`.
- **Do not use Google's Indexing API** for project or blog pages. Google restricts it to `JobPosting` and `BroadcastEvent` pages; using it for other content is against its terms. Use sitemaps and URL Inspection.

## 1. Before deploying this branch

- [ ] Review the diff on branch `seo/technical-seo-overhaul` and merge.
- [ ] In Vercel, confirm `NEXT_PUBLIC_SITE_URL=https://www.associatte.com` (or leave it unset; that's the default). It must have **no trailing slash** and must be the `www` host.
- [ ] Deploy, then run the audit against production:
  ```bash
  npm run seo:audit -- https://www.associatte.com
  ```
  Expect 0 failures.
- [x] Domain redirects (verified 2 Nov 2026): `http://www.` → `https://www.` (308) and `https://associatte.com` → `https://www.associatte.com` (308). `http://associatte.com` takes two hops (→ `https://associatte.com` → `https://www.`). That's harmless; optionally make it one hop in Vercel → Domains.

## 2. Verify the property (one-time)

**Recommended: Domain property.** It covers http/https and www/non-www.
1. search.google.com/search-console → Add property → **Domain** → `associatte.com`.
2. Add the TXT record Google shows at your DNS provider. Wait for it to propagate, then click Verify.

**Alternative: URL-prefix property** `https://www.associatte.com/`.
1. Choose "HTML tag" and copy the `content` value.
2. In Vercel, set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=<value>` and redeploy.
3. Click Verify.

## 3. Submit the sitemap

Search Console → **Sitemaps** → submit `https://www.associatte.com/sitemap.xml`.
This is a sitemap index; Google discovers the 5 child sitemaps from it. Each appears separately in the report, so indexing can be tracked per content type:

| Sitemap | URLs today |
|---|---|
| `/sitemaps/static.xml` | 15 |
| `/sitemaps/projects.xml` | 33 (with image entries) |
| `/sitemaps/blogs.xml` | 3 |
| `/sitemaps/locations.xml` | 3 |
| `/sitemaps/developers.xml` | 12 |

If the old sitemap is listed with errors for `/projects/…` URLs, leave it. Those URLs now 308 to `/property/…`, and Google will consolidate them.

## 4. Request indexing for priority URLs (URL Inspection)

Do these by hand. There is a daily quota of roughly 10–12 requests, so spread them over a few days.
1. `https://www.associatte.com/`
2. `/locations/pune`, `/locations/mumbai`, `/locations/kdmc`
3. `/projects`, `/blog`
4. Your most important project pages, e.g. `/property/mantra-codename-paradise`, `/property/birla-punya`, `/property/panchshil-57avenue`

For each one: Inspect → **Test live URL** → View tested page → check that the screenshot and HTML show the project name in an H1 and the full content (not "Loading…") → **Request indexing**.

## 5. When a new blog post or project is published

This is now automatic: the page goes live, appears in `/blog` and the city/builder listings, and is added to the right sitemap with the real date. Optionally:
- [ ] Inspect the new URL in Search Console → Request indexing.
- [ ] Check that blog posts have **250+ words**, an excerpt and a featured image. Shorter posts are published but served with `noindex`.
- [ ] Use a descriptive slug (the form generates one from the title if left empty). Avoid slugs like `sad`.
- [ ] Projects: fill in the area, city, description (80+ characters) or configurations plus 3+ amenities, the main image, and the **real** MahaRERA number. Leave RERA blank rather than writing "Coming soon".

## 6. Monitor (weekly for the first 2 months, then monthly)

| Report | Where | What to look for |
|---|---|---|
| **Page indexing** | Indexing → Pages | "Indexed" count rising toward 66. Investigate any `/property/` or `/blog/` URL under "Crawled – currently not indexed", "Duplicate without user-selected canonical" or "Soft 404". |
| Expected exclusions | same | "Excluded by noindex": `/buy`, news items, 3 short blog posts, `/builders/{city}`. "Page with redirect": old `/projects/{slug}` URLs. These are correct. |
| **Sitemaps** | Indexing → Sitemaps | Status "Success"; discovered URLs per child sitemap. |
| **Core Web Vitals** | Experience → Core Web Vitals | Mobile URLs "Good": LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1. Data appears after about 28 days of Chrome traffic. Until then, use PageSpeed Insights on `/`, one `/property/` page and one `/blog/` page. |
| **Performance** | Performance → Search results | Clicks, impressions, average position, and queries per page. Use it to replace the unmeasured parts of the keyword map. |
| **Enhancements** | Breadcrumbs (and any other detected types) | No errors. |

## 7. Structured data validation (manual, after deploy)

- [ ] https://search.google.com/test/rich-results on `/`, `/property/mantra-one-residency`, `/blog/factors-drive-property-appreciation` and `/locations/pune`. Expect **Breadcrumbs** to be eligible. Google shows no rich result for `ApartmentComplex`/`WebPage`; that's expected and fine. FAQ rich results are limited by Google to authoritative government and health sites, so the blog FAQ markup won't produce one.
- [ ] https://validator.schema.org on the same URLs. Expect 0 errors.

## 8. Ongoing hygiene

- [ ] Run `npm run seo:audit -- https://www.associatte.com` after each significant release.
- [ ] Fix the 7 broken project image paths and the data issues listed in `SEO-AUDIT-REPORT.md` §4.
- [ ] Expand the three short blog posts. They will become indexable automatically.
