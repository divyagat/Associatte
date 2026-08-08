import type { Metadata } from "next";
import properties from "../../../data/projects.json";
import { getSeoOverride, keywordsToArray } from "@/lib/seo-store";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.associatte.com";

export const dynamic = "force-dynamic";

// The property page is a Client Component (interactive gallery, EMI calc, popups),
// so it can't export metadata and its old `next/head` block was a no-op in the
// App Router. This server layout derives real per-property SEO tags from the same
// properties.json the page renders.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = (properties as any[]).find((p) => p?.slug === slug);

  if (!project) {
    return {
      title: "Property Not Found",
      robots: { index: false, follow: false },
    };
  }

  const area = project.fullLocation?.area || project.location || "";
  const city =
    project.fullLocation?.city ||
    (project.location === "pune"
      ? "Pune"
      : project.location === "mumbai"
        ? "Navi Mumbai"
        : "Kalyan");
  const configType = project.priceDetails?.configurations?.[0]?.type || "";
  const priceRange = project.priceDetails?.range || project.price || "";
  const developer = project.developer?.name || "";
  const canonical = `/property/${slug}`;

  // Admin SEO override (set in the admin SEO panel) wins over the derived defaults.
  const override = await getSeoOverride(canonical);

  const title =
    override?.title?.trim() ||
    `${project.name}${configType ? ` - ${configType}` : ""} in ${area}, ${city}`;
  const description =
    override?.description?.trim() ||
    (`${project.name}${developer ? ` by ${developer}` : ""}.` +
      `${configType ? ` ${configType}` : ""}${priceRange ? ` starting from ${priceRange}.` : ""} ` +
      `${(project.about || "").substring(0, 150)}`).trim();
  const keywords = keywordsToArray(override?.keywords);

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${SITE_URL}${canonical}`,
      images: project.image ? [{ url: project.image }] : undefined,
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: project.image ? [project.image] : undefined,
    },
  };
}

export default function PropertyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
