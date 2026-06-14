// Shared per-city SEO + map metadata.
// Imported by both the server `layout.tsx` (for the Metadata API) and the
// client `page.tsx` (for JSON-LD + the Google Map view).

export interface CityData {
  lat: number;
  lng: number;
  zoom: number;
  title: string;
  description: string;
  keywords: string[];
}

export const CITY_METADATA: Record<string, CityData> = {
  pune: {
    lat: 18.5204,
    lng: 73.8567,
    zoom: 11,
    title: "Properties in Pune | 2, 3, 4 BHK Flats & Apartments",
    description: "Find verified 2, 3, 4 BHK properties in Pune. Browse new launches & ready-to-move projects by top builders. Starting ₹75L. Associatte PropTech.",
    keywords: ["properties in Pune", "flats in Pune", "3 BHK Pune", "new launch Pune", "ready to move Pune", "Associatte PropTech"]
  },
  mumbai: {
    lat: 19.0760,
    lng: 72.8777,
    zoom: 11,
    title: "Properties in Mumbai | 2, 3, 4 BHK Flats & Apartments",
    description: "Discover premium 2, 3, 4 BHK properties in Mumbai. Verified listings, transparent pricing, RERA registered projects. Starting ₹75L. Associatte PropTech.",
    keywords: ["properties in Mumbai", "flats in Mumbai", "3 BHK Mumbai", "new launch Mumbai", "ready to move Mumbai", "Associatte PropTech"]
  },
  kharghar: {
    lat: 19.0433,
    lng: 73.0636,
    zoom: 13,
    title: "Properties in Kharghar | 3 BHK Flats Under 1 Crore",
    description: "Find affordable 2, 3, 4 BHK properties in Kharghar, Navi Mumbai. Ready to move & under construction projects. Starting ₹75L. Associatte PropTech.",
    keywords: ["properties in Kharghar", "3 BHK Kharghar", "flats under 1 crore Kharghar", "Navi Mumbai properties", "Associatte PropTech", "Paradise Sai World Empire", "Mantra 1 Residences"]
  },
  "sus-pune": {
    lat: 18.5912,
    lng: 73.7389,
    zoom: 13,
    title: "Properties in Sus, Pune | New Launch Projects",
    description: "Explore new launch & under construction projects in Sus, Pune. 2, 3, 4 BHK homes by trusted builders. Associatte PropTech.",
    keywords: ["properties in Sus Pune", "new launch Sus", "Mantra Codename Paradise", "flats in Sus", "Associatte PropTech"]
  },
  kdmc: {
    lat: 19.2183,
    lng: 73.0789,
    zoom: 12,
    title: "Properties in Kalyan-Dombivli | Affordable 2, 3 BHK Flats",
    description: "Find affordable 2, 3 BHK properties in Kalyan-Dombivli. RERA registered projects, transparent pricing. Starting ₹40L. Associatte PropTech.",
    keywords: ["properties in Kalyan", "flats in Dombivli", "affordable homes KDMC", "2 BHK Kalyan", "Associatte PropTech"]
  },
  default: {
    lat: 19.0760,
    lng: 72.8777,
    zoom: 10,
    title: "Properties in Maharashtra | Find Your Dream Home",
    description: "Browse verified real estate projects across Maharashtra. 2, 3, 4 BHK homes in Mumbai, Pune, Navi Mumbai & more. Associatte PropTech.",
    keywords: ["properties in Maharashtra", "real estate Maharashtra", "flats in Maharashtra", "Associatte PropTech"]
  }
};
