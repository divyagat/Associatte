# SEO Route Inventory: Associatte PropTech

Every route in `app/` with its rendering mode and index status **after** this branch. The per-URL table below that comes straight from the automated audit (`npm run seo:audit`) against a local production build, with the Googlebot smartphone user agent.

## Counts

| | Count |
|---|---|
| Route files audited (`app/**/page.*`, `route.ts`, excluding admin/API) | 31 public routes, 18 admin routes, 22 API routes |
| Project records audited | 33 (production MongoDB) |
| Eligible (indexable) project pages | **33** |
| Blog posts audited | 6 |
| Eligible (indexable) blog posts | **3** (3 are under 250 words → `noindex, follow`) |
| URLs in sitemaps | **66** (15 static, 33 projects, 3 blogs, 3 cities, 12 developers) |
| Broken internal links | 0 (73 checked) |

## Route table

| Route | Rendering | Indexed? | Canonical | Notes |
|---|---|---|---|---|
| `/` | Server, per request | ✅ | `/` | `?city=` variants canonicalise to `/` |
| `/projects` | Server, per request (filters) | ✅ | `/projects` | `?type=`, `?q=` etc. canonicalise to `/projects` |
| `/projects/[slug]` | Server, dynamic | ❌ | — | 308 → `/property/[slug]`; admin-only preview of unpublished listings (`noindex`) |
| `/property/[slug]` | **SSG + ISR 5 min** | ✅ if eligible | `/property/[slug]` | 404 if unknown/unpublished, 308 if mixed case |
| `/properties` | Server, per request | ✅ | `/properties` | |
| `/buy` | Static | ❌ `noindex, follow` | `/buy` | Thin page; not in sitemap |
| `/locations` | Static + ISR | ✅ | `/locations` | |
| `/locations/[city]` | **SSG + ISR** | ✅ pune, mumbai, kdmc | `/locations/[city]` | Other cities 404 |
| `/builders` | Server, per request | ✅ | `/builders` | `?location=` canonicalises to `/builders` |
| `/builders/[slug]` | **SSG + ISR** | ✅ developer slugs | `/builders/[slug]` | `/builders/{pune,mumbai,kdmc}` → `noindex`, canonical `/locations/{city}` |
| `/blog` | Static + ISR | ✅ | `/blog` | |
| `/blog/[slug]` | **SSG + ISR** | ✅ if 250+ words | `/blog/[slug]` | 404 if unknown |
| `/news` | Static + ISR | ✅ | `/news` | |
| `/news/[id]` | Server, dynamic | ❌ unless body has 150+ words | `/news/[id]` | All 6 current items are excerpts |
| `/about-us`, `/services`, `/contact-us`, `/awards`, `/calculator` | Static + ISR | ✅ | self | |
| `/terms-conditions`, `/privacy-policy`, `/cookie-policy` | Static + ISR | ✅ | self | |
| `/enquiry-test` | Static | ❌ `noindex, nofollow` | — | Internal test page |
| `/admin/**` | Dynamic, auth-gated | ❌ (robots Disallow + login redirect) | — | |
| `/api/**` | Route handlers | ❌ Disallow (except `/api/images/`) | — | |
| `/robots.txt` | Static | — | — | |
| `/sitemap.xml` | Route handler (10 min cache) | — | — | Sitemap index |
| `/sitemaps/[name].xml` | Route handler | — | — | static, projects, blogs, locations, developers |
| any other path | — | ❌ 404 + `noindex` | none | |

## Noindex pages (intentional)

`/buy`, `/enquiry-test`, `/news/[id]` (all 6), `/builders/pune|mumbai|kdmc`, `/blog/mantra-codename-paradise-sus-pune`, `/blog/budget-homes-pune-under-75-lakhs`, `/blog/navi-mumbai-airport-impact-real-estate`, `/projects/[slug]` (admin preview only), all 404s.

## Duplicate pages resolved

| Duplicate | Resolution |
|---|---|
| `/projects/[slug]` vs `/property/[slug]` (33 pairs) | 308 to `/property/[slug]` |
| `/projects/<partial name>` fuzzy matches | 404 |
| `/builders/{city}` vs `/locations/{city}` | noindex, canonical to `/locations/{city}` |
| `/?city=…`, `/projects?…`, `/builders?location=…` | canonical to the clean path |
| Mixed-case `/property/…`, `/locations/…`, `/builders/…` | 308 to lowercase |
| Trailing slash (`/blog/`) | 308 to `/blog` (Next default) |

## Edge-case checks (local production build)

| URL | Status | Redirect | Robots | Canonical |
|---|---|---|---|---|
| `/property/this-project-does-not-exist` | 404 |  |  |  |
| `/projects/mantra` | 404 |  |  |  |
| `/projects/mantra-one-residency` | 308 | /property/mantra-one-residency |  |  |
| `/property/Mantra-One-Residency` | 308 | /property/mantra-one-residency |  |  |
| `/locations/xyz` | 404 |  |  |  |
| `/locations/Pune` | 308 | /locations/pune |  |  |
| `/blog/this-post-does-not-exist` | 404 |  |  |  |
| `/builders/not-a-builder` | 404 |  |  |  |
| `/news/not-a-news-item` | 404 |  |  |  |
| `/totally-unknown-page` | 404 |  |  |  |
| `/blog/` | 308 | /blog |  |  |
| `/sitemaps/nope.xml` | 404 |  |  |  |
| `/admin` | 307 | /admin/login |  |  |
| `/builders/pune` | 200 |  | noindex, follow |  |
| `/buy` | 200 |  | noindex, follow |  |
| `/enquiry-test` | 200 |  | noindex, nofollow |  |
| `/news/n1` | 200 |  | noindex, follow |  |
| `/?city=mumbai` | 200 |  |  | https://www.associatte.com |
| `/projects?type=commercial` | 200 |  |  | https://www.associatte.com/projects |

## Every sitemap URL (server HTML as served to Googlebot)

| URL | Status | H1 | Title | Meta description | JSON-LD types |
|---|---|---|---|---|---|
| `/` | 200 | 1 | Associatte PropTech | Buy Verified Properties in Pune, Mumbai & KDMC | Verified RERA-registered 1–4 BHK flats and new projects in Pune, Navi Mumbai & Kalyan-Dombivli. Compare prices, floor plans and builders. Free consultation. | WebSite, RealEstateAgent |
| `/projects` | 200 | 1 | New Residential Projects in Pune, Navi Mumbai & KDMC | Associatte | Browse new launch, under-construction and ready-to-move projects in Pune, Navi Mumbai and Kalyan-Dombivli from Mantra, Lodha, Birla, Shapoorji Pallonji & more. | WebSite, RealEstateAgent |
| `/locations` | 200 | 1 | Properties by City – Pune, Navi Mumbai & Kalyan-Dombivli | Associatte | Explore new flats and residential projects city by city — Pune, Navi Mumbai and Kalyan-Dombivli (KDMC). See live project counts, localities and price ranges. | WebSite, RealEstateAgent |
| `/properties` | 200 | 1 | Properties | Residential, Commercial, Plots & More | Associatte PropTech | Explore Residential, Commercial, Pre-Launch, Ready-to-Move, Rent, Plot & Resale properties in Pune, Mumbai & KDMC. Filter by type, location, budget & more. | WebSite, RealEstateAgent |
| `/builders` | 200 | 1 | Know Your Developer | Trusted Builders in Pune, Mumbai & KDMC | Explore verified projects from top developers like Mantra, Lodha, Paradise Group & more. | WebSite, RealEstateAgent |
| `/about-us` | 200 | 1 | About Us | Associatte PropTech | Learn about Associatte PropTech Pvt Ltd — your trusted real estate partner for verified properties across Pune, Mumbai and KDMC. | WebSite, RealEstateAgent |
| `/services` | 200 | 1 | Our Services | Associatte PropTech | Property consultation, home loans, legal assistance, property management and investment advisory — end-to-end real estate services from Associatte PropTech. | WebSite, RealEstateAgent |
| `/blog` | 200 | 1 | Real Estate Blog | Associatte PropTech | Insights, market trends, buying guides and investment tips for property buyers across Pune, Mumbai and KDMC. | WebSite, RealEstateAgent, BreadcrumbList |
| `/contact-us` | 200 | 1 | Contact Us | Associatte PropTech | Get in touch with Associatte PropTech for verified properties, free consultation and expert guidance across Pune, Mumbai and KDMC. | WebSite, RealEstateAgent |
| `/terms-conditions` | 200 | 1 | Terms of Service | Associatte | Terms of Service for Associatte PropTech Private Limited - Read our terms and conditions for using our website and services. | WebSite, RealEstateAgent |
| `/privacy-policy` | 200 | 1 | Privacy Policy | Associatte | Privacy Policy for Associatte PropTech Pvt Ltd - Learn how we collect, protect, and use your personal information. | WebSite, RealEstateAgent |
| `/cookie-policy` | 200 | 1 | Cookie Policy | Associatte | Cookie Policy for Associatte PropTech Private Limited - Learn about how we use cookies to improve your experience on our website. | WebSite, RealEstateAgent |
| `/awards` | 200 | 1 | Awards & Recognition | Associatte PropTech | Industry recognition earned by Associatte PropTech for sales excellence, innovation, and customer satisfaction across Pune, Mumbai & KDMC real estate. | WebSite, RealEstateAgent |
| `/news` | 200 | 1 | Real Estate News & Market Updates | Associatte PropTech | Latest real estate news, market trends, infrastructure updates and RERA policy changes across Pune, Mumbai & KDMC. Stay informed with Associatte PropTech. | WebSite, RealEstateAgent |
| `/calculator` | 200 | 1 | Home Loan EMI Calculator | Associatte PropTech | Calculate your monthly home loan EMI, total interest and payment breakdown instantly. Free EMI calculator for properties in Pune, Mumbai & KDMC. | WebSite, RealEstateAgent |
| `/property/mantra-one-residency` | 200 | 1 | Mantra One Residency – 2, 3 & 4 BHK Flats in Magarpatta, Pune | Associatte | Mantra One Residency by Mantra Developers in Magarpatta, Pune: 2, 3 & 4 BHK flats, ₹2.4 Cr onwards. New Launch. Possession Dec 2029. MahaRERA P52100066482… | WebSite, RealEstateAgent, WebPage, BreadcrumbList |
| `/property/mantra-mayfair` | 200 | 1 | Mantra Mayfair – 3 & 4 BHK Flats in Koregaon Park, Pune | Associatte | Mantra Mayfair by Mantra Developers in Koregaon Park, Pune: 3 & 4 BHK flats, ₹1.96 Cr onwards. New Launch. Possession Dec 2030. MahaRERA P52100079211 |… | WebSite, RealEstateAgent, WebPage, BreadcrumbList |
| `/property/mantra-meridian` | 200 | 1 | Mantra Meridian – 2, 3 & 4 BHK Flats in Balewadi, Pune | Associatte | Mantra Meridian by Mantra Developers in Balewadi, Pune: 2, 3 & 4 BHK flats, ₹1.20 Cr onwards. New Launch. Possession Dec 2029. MahaRERA P52100045688. See… | WebSite, RealEstateAgent, WebPage, BreadcrumbList |
| `/property/mantra-magnus` | 200 | 1 | Mantra Magnus – 3 & 3.5 BHK Flats in Mundhwa, Pune | Associatte | Mantra Magnus by Mantra Developers in Mundhwa, Pune: 3 & 3.5 BHK flats, ₹1.40 Cr onwards. New Launch. Possession Dec 2029-30. MahaRERA P52100054373. See floor… | WebSite, RealEstateAgent, WebPage, BreadcrumbList |
| `/property/mantra-milange` | 200 | 1 | Mantra Melange – 2 & 3 BHK Flats in Kharadi, Pune | Associatte | Mantra Melange by Mantra Developers in Kharadi, Pune: 2 & 3 BHK flats, ₹1.05 Cr onwards. New Launch. Possession Dec 2029-30. MahaRERA P52100079582. See floor… | WebSite, RealEstateAgent, WebPage, BreadcrumbList |
| `/property/mantra-codename-paradise` | 200 | 1 | Mantra Codename Paradise – 2 & 3 BHK Flats in Sus, Pune | Associatte | Mantra Codename Paradise by Mantra Developers in Sus, Pune: 2 & 3 BHK flats, ₹69.90 Lacs onwards. New Launch. Possession Dec 2029-30. See floor plans… | WebSite, RealEstateAgent, WebPage, BreadcrumbList |
| `/property/lodha-mundhwa` | 200 | 1 | Lodha Mundhwa – 2 & 3 BHK Flats in Pune | Associatte | Lodha Mundhwa by Lodha Group in Mundhwa, Pune: 2 & 3 BHK flats. Possession Mar 2027. See floor plans, amenities & location. | WebSite, RealEstateAgent, WebPage, BreadcrumbList |
| `/property/birla-punya` | 200 | 1 | Birla Punya – 2, 3 & 4 BHK Flats in Sangamwadi, Pune | Associatte | Birla Punya by Birla Estates in Sangamwadi, Pune: 2, 3 & 4 BHK flats, ₹1.86 Cr onwards. New Launch. Possession Dec 2031. MahaRERA P52100079533. See floor… | WebSite, RealEstateAgent, WebPage, BreadcrumbList |
| `/property/birla-evem` | 200 | 1 | Birla Evam – 2 & 3 BHK Flats in Manjari, Pune | Associatte | Birla Evam by Birla Estates in Manjari, Pune: 2 & 3 BHK flats, ₹71.55 Lacs onwards. New Launch. Possession Jun 2031. MahaRERA PR1261012500295. See floor… | WebSite, RealEstateAgent, WebPage, BreadcrumbList |
| `/property/shapoorji-tree-cloud` | 200 | 1 | Shapoorji Tree Cloud – 3 & 4 BHK Flats in Hadapsar, Pune | Associatte | Shapoorji Tree Cloud by Shapoorji Pallonji in Hadapsar, Pune: 3 & 4 BHK flats, ₹1.48 Cr onwards. New Launch. Possession Dec 2031. MahaRERA PR1260002503056… | WebSite, RealEstateAgent, WebPage, BreadcrumbList |
| `/property/shapoorji-celestia` | 200 | 1 | Shapoorji Celestia – 2 & 3 BHK Flats in Shewalewadi, Pune | Associatte | Shapoorji Celestia by Shapoorji Pallonji in Shewalewadi, Pune: 2 & 3 BHK flats, ₹78 Lacs onwards. New Launch. Possession Dec 2031. MahaRERA P52100048338. See… | WebSite, RealEstateAgent, WebPage, BreadcrumbList |
| `/property/shapoorji-wildernest` | 200 | 1 | Shapoorji Wildernest – 3 & 4 BHK Flats in Hadapsar, Pune | Associatte | Shapoorji Wildernest by Shapoorji Pallonji in Hadapsar, Pune: 3 & 4 BHK flats, ₹1.84 Cr onwards. Possession Jun 2027. MahaRERA P52100052683. See floor plans… | WebSite, RealEstateAgent, WebPage, BreadcrumbList |
| `/property/shapoorji-tree-topia` | 200 | 1 | Shapoorji Tree Topia – Plots in Jadhav Wadi, Hadapsar–Saswad Rd, Pune | Associatte | Shapoorji Tree Topia by Shapoorji Pallonji in Jadhav Wadi, Hadapsar–Saswad Rd, Pune: plots, ₹90 Lacs. Possession June 2027. MahaRERA PP1261012501803. See… | WebSite, RealEstateAgent, WebPage, BreadcrumbList |
| `/property/shapoorji-villa` | 200 | 1 | Shapoorji Villa – 3 & 4 BHK Flats in Undri, Pune | Associatte | Shapoorji Villa by Shapoorji Pallonji in Undri, Pune: 3 & 4 BHK flats, ₹4.70 Cr onwards. Possession Dec 2027. MahaRERA P52100052683. See floor plans… | WebSite, RealEstateAgent, WebPage, BreadcrumbList |
| `/property/jhamtani-ace-abundance` | 200 | 1 | Jhamtani Ace Abundance – 3, 4 & 4.5 BHK Flats in Mundhwa, Pune | Associatte | Jhamtani Ace Abundance by Jhamtani Group in Mundhwa, Pune: 3, 4 & 4.5 BHK flats, ₹2.29 Cr onwards. Possession March 2029 . MahaRERA PR1260002500852. See floor… | WebSite, RealEstateAgent, WebPage, BreadcrumbList |
| `/property/kumar-prism` | 200 | 1 | Kumar Prism – 3 & 4 BHK Flats in Magarpatta, Pune | Associatte | Kumar Prism by Kumar Properties in Magarpatta, Pune: 3 & 4 BHK flats, ₹1.95 Cr onwards. Possession Mar 2027. MahaRERA P52100048139. See floor plans, amenities… | WebSite, RealEstateAgent, WebPage, BreadcrumbList |
| `/property/panchshil-57avenue` | 200 | 1 | Panchshil 57 Avenue – 3, 3.5 & 4.5 BHK Flats in Mundhwa, Pune | Associatte | Panchshil 57 Avenue by Panchshil Realty in Mundhwa, Pune: 3, 3.5 & 4.5 BHK flats, ₹4 Cr++ onwards. New Launch. Possession Dec 2029 - 30. MahaRERA… | WebSite, RealEstateAgent, WebPage, BreadcrumbList |
| `/property/panchshil-lohegaon-plotting` | 200 | 1 | Panchshil Lohegaon Plotting – Plots in Pune | Associatte | Panchshil Lohegaon Plotting by Panchshil Realty in Lohegaon, Pune: plots, ₹2.6 Cr onwards. Possession Ready to Register. MahaRERA P52100034062. See floor… | WebSite, RealEstateAgent, WebPage, BreadcrumbList |
| `/property/tribeca-lulla-nagar` | 200 | 1 | Tribeca Lulla Nagar – 3, 4 & 5 BHK Flats in Pune | Associatte | Tribeca Lulla Nagar by Tribeca Developers in Lulla Nagar, Pune: 3, 4 & 5 BHK flats, ₹3.46 Cr onwards. Possession Jun 2027 - 30. MahaRERA PM1261012600059. See… | WebSite, RealEstateAgent, WebPage, BreadcrumbList |
| `/property/tribeca-trump-tower` | 200 | 1 | Tribeca Trump Tower – Commercial Spaces in Koregaon Park, Pune | Associatte | Tribeca Trump Tower by Tribeca Developers in Koregaon Park, Pune: commercial spaces, ₹8.10 Cr onwards. Possession Dec 2028 - 30. MahaRERA P52100066551. See… | WebSite, RealEstateAgent, WebPage, BreadcrumbList |
| `/property/magarpatta-city-nova-residency` | 200 | 1 | Magarpatta City Nova Residency – 2 & 3 BHK Flats in Pune | Associatte | Magarpatta City Nova Residency by Magarpatta City in Magarpatta City, Pune: 2 & 3 BHK flats, ₹1.05 Cr onwards. Ready to Move. Possession Ready to Move… | WebSite, RealEstateAgent, WebPage, BreadcrumbList |
| `/property/magarpatta-city-nova-elegance` | 200 | 1 | Magarpatta City Nova Elegance – 4.5 BHK Flats in Pune | Associatte | Magarpatta City Nova Elegance by Magarpatta City in Magarpatta City, Pune: 4.5 BHK flats, ₹3.81 Cr onwards. Ready to Move. Possession Ready to Move. MahaRERA… | WebSite, RealEstateAgent, WebPage, BreadcrumbList |
| `/property/magarpatta-city-rvc-hornbill` | 200 | 1 | Magarpatta City RVC Hornbill – 2 BHK Flats in Pune | Associatte | Magarpatta City RVC Hornbill by Magarpatta City in Magarpatta City, Pune: 2 BHK flats, ₹80.50 Lacs onwards. Ready to Move. Possession Ready to Move. MahaRERA… | WebSite, RealEstateAgent, WebPage, BreadcrumbList |
| `/property/magarpatta-city-rvc-flamingo` | 200 | 1 | Magarpatta City RVC Flamingo – 2 & 3 BHK Flats in Pune | Associatte | Magarpatta City RVC Flamingo by Magarpatta City in Magarpatta City, Pune: 2 & 3 BHK flats, ₹73.85 Lacs onwards. Ready to Move. Possession Ready to Move… | WebSite, RealEstateAgent, WebPage, BreadcrumbList |
| `/property/sai-world-one` | 200 | 1 | Sai World One – 2 & 3 BHK Flats in Panvel, Navi Mumbai | Associatte | Sai World One by Paradise Group in Panvel, Navi Mumbai: 2 & 3 BHK flats, ₹1.80 Cr onwards. New Launch. Possession Dec 2028. See floor plans, amenities &… | WebSite, RealEstateAgent, WebPage, BreadcrumbList |
| `/property/sai-world-empire` | 200 | 1 | Sai World Empire – 2, 3 & 4 BHK Flats in Kharghar, Navi Mumbai | Associatte | Sai World Empire by Paradise Group in Kharghar, Navi Mumbai: 2, 3 & 4 BHK flats, ₹1.53 Cr onwards. Possession Jun 2027. MahaRERA P51700002446. See floor… | WebSite, RealEstateAgent, WebPage, BreadcrumbList |
| `/property/sai-world-dreams` | 200 | 1 | Sai World Dreams – 2 & 3 BHK Flats in Kalyan-Shil Road, Dombivli | Associatte | Sai World Dreams by Paradise Group in Kalyan-Shil Road, Dombivli: 2 & 3 BHK flats, ₹69 Lacs onwards. Possession Mar 2027. MahaRERA P51700035191. See floor… | WebSite, RealEstateAgent, WebPage, BreadcrumbList |
| `/property/today-nova-vista-nerul` | 200 | 1 | Today Nova Vista Nerul – 2 & 4 BHK Flats in Navi Mumbai | Associatte | Today Nova Vista Nerul by Today Global in Nerul, Navi Mumbai: 2 & 4 BHK flats, ₹2.05 Cr onwards. New Launch. Possession Dec 2029. MahaRERA PR1330002600138… | WebSite, RealEstateAgent, WebPage, BreadcrumbList |
| `/property/today-airoli` | 200 | 1 | Today Airoli – 2, 3 & 4 BHK Flats in Navi Mumbai | Associatte | Today Airoli by Today Global in Airoli, Navi Mumbai: 2, 3 & 4 BHK flats, ₹1.75 Cr onwards. New Launch. Possession Sep 2032. MahaRERA P52000005932. See floor… | WebSite, RealEstateAgent, WebPage, BreadcrumbList |
| `/property/today-kharghar` | 200 | 1 | Today Kharghar – Homes in Navi Mumbai | Associatte | Today Kharghar by Today Global in Kharghar, Navi Mumbai. Possession Dec 2027. MahaRERA P52000048037. See floor plans, amenities & location. | WebSite, RealEstateAgent, WebPage, BreadcrumbList |
| `/property/runwal-gardens` | 200 | 1 | Runwal Gardens – 1, 2 & 3 BHK Flats in Dombivli, Kalyan | Associatte | Runwal Gardens by Runwal Group in Dombivli, Kalyan: 1, 2 & 3 BHK flats, ₹37.50 Lacs onwards. Ready to Move. Possession Ready To Move In. MahaRERA… | WebSite, RealEstateAgent, WebPage, BreadcrumbList |
| `/property/lodha-premier` | 200 | 1 | Lodha Premier – 1, 2 & 3 BHK Flats in Kalyan | Associatte | Lodha Premier by Lodha Group in Kalyan: 1, 2 & 3 BHK flats, ₹59.99 Lacs onwards. Possession Dec 2024. MahaRERA P51700033751. See floor plans, amenities &… | WebSite, RealEstateAgent, WebPage, BreadcrumbList |
| `/property/lodha-opulis` | 200 | 1 | Lodha Opulis – 3 & 4 BHK Flats in Dombivli East, Kalyan | Associatte | Lodha Opulis by Lodha Group in Dombivli East, Kalyan: 3 & 4 BHK flats, ₹1.44 Cr onwards. New Launch. Possession Sep 2029 - 30. MahaRERA P51700079035. See… | WebSite, RealEstateAgent, WebPage, BreadcrumbList |
| `/blog/sad` | 200 | 1 | Signs That a Property in Pune Will Deliver Strong Returns in the Future | Associatte PropTech | Pune has emerged as one of India's most promising real estate markets, driven by its thriving IT sector, expanding infrastructure, and growing population… | WebSite, RealEstateAgent, BlogPosting, BreadcrumbList |
| `/blog/factors-drive-property-appreciation` | 200 | 1 | Factors That Drive Property Appreciation: A Complete Guide | Associatte PropTech | Property appreciation is one of the most important aspects of real estate investment. Discover the key factors that influence property values and maximize… | WebSite, RealEstateAgent, BlogPosting, FAQPage, BreadcrumbList |
| `/blog/evolution-pune-mumbai-real-estate-decade` | 200 | 1 | The Evolution of Pune and Mumbai's Real Estate Markets Over the Past Decade | Associatte PropTech | A comprehensive analysis of how the real estate markets in Pune and Mumbai have transformed over the last decade, highlighting key trends, current scenarios… | WebSite, RealEstateAgent, BlogPosting, FAQPage, BreadcrumbList |
| `/locations/pune` | 200 | 1 | Flats & New Residential Projects in Pune | Compare 24 residential projects in Pune across Mundhwa, Magarpatta City, Magarpatta & Koregaon Park — 2, 3, 3.5, 4, 4.5 & 5 BHK homes by Mantra Developers… | WebSite, RealEstateAgent, BreadcrumbList, Place, ItemList |
| `/locations/mumbai` | 200 | 1 | Flats & New Projects in Navi Mumbai & Mumbai Region | Compare 6 residential projects in Mumbai across Kharghar, Panvel, Kalyan-Shil Road & Nerul — 2, 3 & 4 BHK homes by Paradise Group & Today Global and more. See… | WebSite, RealEstateAgent, BreadcrumbList, Place, ItemList |
| `/locations/kdmc` | 200 | 1 | Flats & New Projects in Kalyan-Dombivli (KDMC) | Compare 3 residential projects in Kalyan-Dombivli (KDMC) across Dombivli, Kalyan & Dombivli East — 1, 2, 3 & 4 BHK homes by Lodha Group & Runwal Group and… | WebSite, RealEstateAgent, BreadcrumbList, Place, ItemList |
| `/builders/mantra` | 200 | 1 | Mantra Developers Projects in Pune | Associatte PropTech | Explore 6 Mantra Developers projects in Magarpatta, Koregaon Park, Balewadi, Mundhwa. Compare configurations, prices, RERA details and possession dates. | WebSite, RealEstateAgent, BreadcrumbList |
| `/builders/lodha` | 200 | 1 | Lodha Group Projects in Pune & kdmc  & Kalyan | Associatte PropTech | Explore 3 Lodha Group projects in Mundhwa, Kalyan, Dombivli East. Compare configurations, prices, RERA details and possession dates. | WebSite, RealEstateAgent, BreadcrumbList |
| `/builders/birla` | 200 | 1 | Birla Estates Projects in Pune | Associatte PropTech | Explore 2 Birla Estates projects in Sangamwadi, Manjari. Compare configurations, prices, RERA details and possession dates. | WebSite, RealEstateAgent, BreadcrumbList |
| `/builders/shapoorji` | 200 | 1 | Shapoorji Pallonji Projects in Pune | Associatte PropTech | Explore 5 Shapoorji Pallonji projects in Hadapsar, Shewalewadi, Jadhav Wadi, Hadapsar–Saswad Rd, Undri. Compare configurations, prices, RERA details and… | WebSite, RealEstateAgent, BreadcrumbList |
| `/builders/jhamtani` | 200 | 1 | Jhamtani Group Projects in Pune | Associatte PropTech | Explore 1 Jhamtani Group project in Mundhwa. Compare configurations, prices, RERA details and possession dates. | WebSite, RealEstateAgent, BreadcrumbList |
| `/builders/kumar` | 200 | 1 | Kumar Properties Projects in Pune | Associatte PropTech | Explore 1 Kumar Properties project in Magarpatta. Compare configurations, prices, RERA details and possession dates. | WebSite, RealEstateAgent, BreadcrumbList |
| `/builders/panchshil` | 200 | 1 | Panchshil Realty Projects in Pune | Associatte PropTech | Explore 2 Panchshil Realty projects in Mundhwa, Lohegaon. Compare configurations, prices, RERA details and possession dates. | WebSite, RealEstateAgent, BreadcrumbList |
| `/builders/tribeca` | 200 | 1 | Tribeca Developers Projects in Pune | Associatte PropTech | Explore 2 Tribeca Developers projects in Lulla Nagar, Koregaon Park. Compare configurations, prices, RERA details and possession dates. | WebSite, RealEstateAgent, BreadcrumbList |
| `/builders/magarpatta-city` | 200 | 1 | Magarpatta City Projects in Pune | Associatte PropTech | Explore 4 Magarpatta City projects in Magarpatta City. Compare configurations, prices, RERA details and possession dates. | WebSite, RealEstateAgent, BreadcrumbList |
| `/builders/sai-paradise-group` | 200 | 1 | Paradise Group Projects in Navi Mumbai & Dombivli | Associatte PropTech | Explore 3 Paradise Group projects in Panvel, Kharghar, Kalyan-Shil Road. Compare configurations, prices, RERA details and possession dates. | WebSite, RealEstateAgent, BreadcrumbList |
| `/builders/today-group` | 200 | 1 | Today Global Projects in Navi Mumbai | Associatte PropTech | Explore 3 Today Global projects in Nerul, Airoli, Kharghar. Compare configurations, prices, RERA details and possession dates. | WebSite, RealEstateAgent, BreadcrumbList |
| `/builders/runwal-group` | 200 | 1 | Runwal Group Projects in Kalyan | Associatte PropTech | Explore 1 Runwal Group project in Dombivli. Compare configurations, prices, RERA details and possession dates. | WebSite, RealEstateAgent, BreadcrumbList |
