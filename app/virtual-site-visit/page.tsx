import type { Metadata } from "next";
import VirtualSiteVisitSection from "@/components/sections/VirtualSiteVisitSection";

export const metadata: Metadata = {
  title: "Virtual Site Visit | Explore Properties From Home",
  description:
    "Experience your future home virtually with our 6-step online site visit process. Save time, compare options, and book with confidence.",
  openGraph: {
    title: "Virtual Site Visit | Zero Travel, Full Clarity",
    description:
      "Tour properties, view plans, and check pricing without leaving home.",
    url: "https://associatte.com/virtual-site-visit",
    siteName: "Associatte",
    type: "website",
  },
};

export default function VirtualSiteVisitPage() {
  return <VirtualSiteVisitSection />;
}