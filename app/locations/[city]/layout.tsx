import type { Metadata } from "next";
import { CITY_METADATA } from "./cityMetadata";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.associatte.com";

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

  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: data.title,
      description: data.description,
      url: `${SITE_URL}${canonical}`,
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.description,
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
