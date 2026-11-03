# SEO Keyword Mapping: Associatte PropTech

One primary search intent per URL, so pages don't compete with each other. Titles and descriptions are the **defaults this branch generates**; an admin can override any of them in **Admin → SEO** (overrides win).

> No search volumes, difficulty scores or ranking positions are given. None were measured, and inventing them would mislead. Pull real figures from Search Console (Performance → Queries) about 4–6 weeks after deploy, or from a keyword tool, and re-prioritise.

## Principles
- **City intent** ("flats in Pune") → `/locations/{city}`. **Project-name intent** ("Mantra Magnus") → `/property/{slug}`. **Developer intent** ("Lodha projects Pune") → `/builders/{slug}`. **Informational intent** ("property appreciation factors") → `/blog/{slug}`.
- Locality phrases ("flats in Mundhwa") are served by the **project pages in that locality**, which carry the locality in their title, H1 area line, description and address schema. Separate locality landing pages were **not** created: most localities have only 1–4 projects, and thin pages per locality would be doorway pages. See "Future locality pages" below.
- "Mumbai" on this site effectively means **Navi Mumbai** (5 of the 6 projects), so that page targets Navi Mumbai wording.
- The brief's example localities **Wakad, Hinjewadi, Baner and Thane have no projects in the database**. They are not targeted until real listings exist.

## Site-level pages

| URL | Primary keyword | Secondary keywords | Intent | Page type | Default title | Default description |
|---|---|---|---|---|---|---|
| `/` | buy property in Pune | RERA registered flats Pune, new projects Navi Mumbai, flats Kalyan Dombivli, Associatte | Navigational / commercial | Home | Associatte PropTech \| Buy Verified Properties in Pune, Mumbai & KDMC | Verified RERA-registered 1–4 BHK flats and new projects in Pune, Navi Mumbai & Kalyan-Dombivli. Compare prices, floor plans and builders. Free consultation. |
| `/projects` | new residential projects in Pune | new launch projects Pune, RERA registered projects Pune, new projects Navi Mumbai | Commercial | Listing | New Residential Projects in Pune, Navi Mumbai & KDMC \| Associatte | Browse new launch, under-construction and ready-to-move projects in Pune, Navi Mumbai and Kalyan-Dombivli from Mantra, Lodha, Birla, Shapoorji Pallonji & more. |
| `/properties` | properties for sale Pune | residential, commercial, plots, resale, rent | Commercial | Listing (deal type) | Properties \| Residential, Commercial, Plots & More \| Associatte PropTech | Explore Residential, Commercial, Pre-Launch, Ready-to-Move, Rent, Plot & Resale properties… |
| `/locations` | properties by city | flats in Pune, flats in Navi Mumbai, flats in Kalyan Dombivli | Navigational | Hub | Properties by City – Pune, Navi Mumbai & Kalyan-Dombivli \| Associatte | Explore new flats and residential projects city by city… |
| `/builders` | top builders in Pune | trusted developers Pune, builders Navi Mumbai | Commercial investigation | Hub | Know Your Developer \| Trusted Builders in Pune, Mumbai & KDMC | Explore verified projects from top developers like Mantra, Lodha, Paradise Group & more. |
| `/blog` | Pune real estate blog | home buying guide Pune, property investment tips | Informational | Hub | Real Estate Blog \| Associatte PropTech | Insights, market trends, buying guides and investment tips… |
| `/calculator` | home loan EMI calculator | EMI calculator India | Tool | Tool | Home Loan EMI Calculator \| Associatte PropTech | Calculate your monthly home loan EMI… |
| `/news` | Pune real estate news | Navi Mumbai property news, MahaRERA updates | Informational | Hub | Real Estate News & Market Updates \| Associatte PropTech | Latest real estate news… |
| `/services`, `/about-us`, `/contact-us`, `/awards` | brand + service | property consultant Pune, home loan assistance | Navigational | Info | (registry defaults) | (registry defaults) |

## City pages

| URL | Primary keyword | Secondary keywords | Default title | Description (generated from live data) |
|---|---|---|---|---|
| `/locations/pune` | flats in Pune | new residential projects in Pune, 2 BHK / 3 BHK flats in Pune, flats in Mundhwa / Magarpatta / Hadapsar / Kharadi | Flats & New Residential Projects in Pune \| Associatte PropTech | "Compare 24 residential projects in Pune across {top 4 localities} — {BHK range} homes by {top 3 developers} and more. See prices, floor plans, RERA details & locations." |
| `/locations/mumbai` | flats in Navi Mumbai | new projects Navi Mumbai, flats in Kharghar, flats in Panvel, flats in Nerul, flats in Airoli | Flats & New Projects in Navi Mumbai & Mumbai Region \| Associatte PropTech | (generated, 6 projects) |
| `/locations/kdmc` | flats in Kalyan Dombivli | flats in Dombivli East, 1 BHK flats Kalyan, Lodha Kalyan | Flats & New Projects in Kalyan-Dombivli (KDMC) \| Associatte PropTech | (generated, 3 projects) |

## Developer pages (12)

Pattern: **primary** "{developer} projects in {city}" · **secondary** "{developer} {locality}", "{developer} new launch" · **title** `{Developer} Projects in {Cities} | Associatte PropTech` · **description** `Explore {n} {Developer} projects in {localities}. Compare configurations, prices, RERA details and possession dates.`

`/builders/mantra`, `/builders/lodha`, `/builders/birla`, `/builders/shapoorji`, `/builders/jhamtani`, `/builders/kumar`, `/builders/panchshil`, `/builders/tribeca`, `/builders/magarpatta-city`, `/builders/sai-paradise-group`, `/builders/today-group`, `/builders/runwal-group`

## Project pages (33)

Pattern: **primary** = project name (navigational, the strongest-converting intent) · **secondary** = "{BHK} flats in {locality}", "{developer} {locality}", "{project} price / floor plan / RERA".

| URL | Primary | Secondary (locality intent) | Title |
|---|---|---|---|
| `/property/mantra-one-residency` | Mantra One Residency | 2/3/4 BHK flats in Magarpatta | Mantra One Residency – 2, 3 & 4 BHK Flats in Magarpatta, Pune |
| `/property/mantra-mayfair` | Mantra Mayfair | 3/4 BHK flats in Koregaon Park | Mantra Mayfair – 3 & 4 BHK Flats in Koregaon Park, Pune |
| `/property/mantra-meridian` | Mantra Meridian | flats in Balewadi | Mantra Meridian – 2, 3 & 4 BHK Flats in Balewadi, Pune |
| `/property/mantra-magnus` | Mantra Magnus | 3 BHK flats in Mundhwa | Mantra Magnus – 3 & 3.5 BHK Flats in Mundhwa, Pune |
| `/property/mantra-milange` | Mantra Melange | 2/3 BHK flats in Kharadi | Mantra Melange – 2 & 3 BHK Flats in Kharadi, Pune |
| `/property/mantra-codename-paradise` | Mantra Codename Paradise | flats in Sus Pune | Mantra Codename Paradise – 2 & 3 BHK Flats in Sus, Pune |
| `/property/lodha-mundhwa` | Lodha Mundhwa | flats in Mundhwa | Lodha Mundhwa – 2 & 3 BHK Flats in Pune |
| `/property/birla-punya` | Birla Punya | flats in Sangamwadi | Birla Punya – 2, 3 & 4 BHK Flats in Sangamwadi, Pune |
| `/property/birla-evem` | Birla Evam | flats in Manjari | Birla Evam – 2 & 3 BHK Flats in Manjari, Pune |
| `/property/shapoorji-tree-cloud` | Shapoorji Tree Cloud | flats in Hadapsar | Shapoorji Tree Cloud – 3 & 4 BHK Flats in Hadapsar, Pune |
| `/property/shapoorji-celestia` | Shapoorji Celestia | flats in Shewalewadi | Shapoorji Celestia – 2 & 3 BHK Flats in Shewalewadi, Pune |
| `/property/shapoorji-wildernest` | Shapoorji Wildernest | 3/4 BHK Hadapsar | Shapoorji Wildernest – 3 & 4 BHK Flats in Hadapsar, Pune |
| `/property/shapoorji-tree-topia` | Shapoorji Tree Topia | plots Hadapsar–Saswad Road | Shapoorji Tree Topia – Plots in Jadhav Wadi, Hadapsar–Saswad Rd, Pune |
| `/property/shapoorji-villa` | Shapoorji Villa | flats in Undri | Shapoorji Villa – 3 & 4 BHK Flats in Undri, Pune |
| `/property/jhamtani-ace-abundance` | Jhamtani Ace Abundance | 4 BHK Mundhwa | Jhamtani Ace Abundance – 3, 4 & 4.5 BHK Flats in Mundhwa, Pune |
| `/property/kumar-prism` | Kumar Prism | flats in Magarpatta | Kumar Prism – 3 & 4 BHK Flats in Magarpatta, Pune |
| `/property/panchshil-57avenue` | Panchshil 57 Avenue | luxury flats Mundhwa | Panchshil 57 Avenue – 3, 3.5 & 4.5 BHK Flats in Mundhwa, Pune |
| `/property/panchshil-lohegaon-plotting` | Panchshil Lohegaon plots | plots in Lohegaon | Panchshil Lohegaon Plotting – Plots in Pune |
| `/property/tribeca-lulla-nagar` | Tribeca Lulla Nagar | flats in Lulla Nagar | Tribeca Lulla Nagar – 3, 4 & 5 BHK Flats in Pune |
| `/property/tribeca-trump-tower` | Trump Tower Pune | commercial space Koregaon Park | Tribeca Trump Tower – Commercial Spaces in Koregaon Park, Pune |
| `/property/magarpatta-city-nova-residency` | Nova Residency Magarpatta | ready flats Magarpatta | Magarpatta City Nova Residency – 2 & 3 BHK Flats in Pune |
| `/property/magarpatta-city-nova-elegance` | Nova Elegance | — | Magarpatta City Nova Elegance – 4.5 BHK Flats in Pune |
| `/property/magarpatta-city-rvc-hornbill` | RVC Hornbill | 2 BHK Magarpatta | Magarpatta City RVC Hornbill – 2 BHK Flats in Pune |
| `/property/magarpatta-city-rvc-flamingo` | RVC Flamingo | — | Magarpatta City RVC Flamingo – 2 & 3 BHK Flats in Pune |
| `/property/sai-world-one` | Sai World One | flats in Panvel | Sai World One – 2 & 3 BHK Flats in Panvel, Navi Mumbai |
| `/property/sai-world-empire` | Sai World Empire | flats in Kharghar | Sai World Empire – 2, 3 & 4 BHK Flats in Kharghar, Navi Mumbai |
| `/property/sai-world-dreams` | Sai World Dreams | flats Kalyan-Shil Road | Sai World Dreams – 2 & 3 BHK Flats in Kalyan-Shil Road, Dombivli |
| `/property/today-nova-vista-nerul` | Today Nova Vista Nerul | flats in Nerul | Today Nova Vista Nerul – 2 & 4 BHK Flats in Navi Mumbai |
| `/property/today-airoli` | Today Airoli | flats in Airoli | Today Airoli – 2, 3 & 4 BHK Flats in Navi Mumbai |
| `/property/today-kharghar` | Today Kharghar | flats in Kharghar | Today Kharghar – Homes in Navi Mumbai |
| `/property/runwal-gardens` | Runwal Gardens | flats in Dombivli | Runwal Gardens – 1, 2 & 3 BHK Flats in Dombivli, Kalyan |
| `/property/lodha-premier` | Lodha Premier | 1 BHK Kalyan | Lodha Premier – 1, 2 & 3 BHK Flats in Kalyan |
| `/property/lodha-opulis` | Lodha Opulis | flats in Dombivli East | Lodha Opulis – 3 & 4 BHK Flats in Dombivli East, Kalyan |

All project titles end with " | Associatte". Descriptions follow: `{Project} by {Developer} in {Area}, {City}: {BHK} flats, {price} onwards. {Status}. Possession {date}. MahaRERA {number}. See floor plans, amenities & location.` Fields are left out when missing; placeholder RERA values such as "Comming Soon" are never shown.

## Blog posts

| URL | Primary keyword | Intent | Indexed? |
|---|---|---|---|
| `/blog/factors-drive-property-appreciation` | factors that drive property appreciation | Informational | ✅ |
| `/blog/evolution-pune-mumbai-real-estate-decade` | Pune Mumbai real estate trends | Informational | ✅ |
| `/blog/sad` | signs a property in Pune will appreciate | Informational | ✅ (rename the slug, see audit) |
| `/blog/mantra-codename-paradise-sus-pune` | Mantra Codename Paradise review | Commercial investigation | ❌ until expanded |
| `/blog/budget-homes-pune-under-75-lakhs` | flats in Pune under 75 lakhs | Commercial investigation | ❌ until expanded (high-value topic) |
| `/blog/navi-mumbai-airport-impact-real-estate` | Navi Mumbai airport property impact | Informational | ❌ until expanded (high-value topic) |

## Content gaps worth filling (with real information only)

These match brief targets but have no page that can honestly serve them yet:

| Target | What's needed |
|---|---|
| Property prices in Pune | A data-backed article or section using actual listing prices (per-locality ranges from the 24 Pune projects). |
| RERA registered projects in Pune | A guide to checking MahaRERA, linking the 30 projects with verified numbers. |
| 2 BHK / 3 BHK flats in Pune | Optional filtered landing pages once there are about 8+ projects per configuration, each with unique copy. Until then `/locations/pune` covers it. |
| Flats in Wakad / Hinjewadi / Baner / Thane | Real listings in those localities first. |
| Future locality pages | Add `/locations/pune/{locality}` only for localities with roughly 4+ live projects and unique local content (connectivity, schools, price trends). Today only Mundhwa (4) and Magarpatta (6 incl. Magarpatta City) qualify. |
