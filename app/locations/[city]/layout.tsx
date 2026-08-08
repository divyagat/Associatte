import type { Metadata } from "next";
import { CITY_METADATA } from "./cityMetadata";
import { getSeoOverride, keywordsToArray } from "@/lib/seo-store";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.associatte.com";

export const dynamic = "force-dynamic";

// The page itself is a Client Component (Google Maps + interactive filters),
// so it cannot export metadata. This server layout supplies real per-city
// <title>/description/canonical/OG tags via the App Router Metadata API —
// replacing the old `next/head` block, which was a no-op in the App Router.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const data = CITY_METADATA[city?.toLowerCase()] || CITY_METADATA.default;
  const canonical = `/locations/${city}`;

  // Admin SEO override (by path) wins over the per-city defaults.
  const override = await getSeoOverride(canonical);
  const title = override?.title?.trim() || data.title;
  const description = override?.description?.trim() || data.description;
  const keywords = keywordsToArray(override?.keywords) || data.keywords;

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${SITE_URL}${canonical}`,
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function CityLocationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
