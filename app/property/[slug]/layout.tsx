import type { Metadata } from "next";
import properties from "../../../data/properties.json";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.associatte.com";

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

  const title = `${project.name}${configType ? ` - ${configType}` : ""} in ${area}, ${city}`;
  const description =
    `${project.name}${developer ? ` by ${developer}` : ""}.` +
    `${configType ? ` ${configType}` : ""}${priceRange ? ` starting from ${priceRange}.` : ""} ` +
    `${(project.about || "").substring(0, 150)}`.trim();

  return {
    title,
    description,
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
