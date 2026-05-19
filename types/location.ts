// types/location.ts

/**
 * Centralized location configuration with strict typing
 * All city-related types are derived from this single source of truth
 */

export const LOCATION_CONFIG = {
  pune: {
    name: 'Pune' as const,
    slug: 'pune' as const,
    heroTitle: 'Find Your Dream Home in Pune',
    heroSubtitle: 'Explore premium projects in Wakad, Hinjewadi, Baner & Sus',
    metaTitle: 'Properties in Pune | 2, 3 BHK Flats Starting ₹75L | Associatte PropTech',
    metaDescription: 'Find verified 2, 3, 4 BHK properties in Pune. Browse projects in Wakad, Hinjewadi, Sus by Mantra, Lodha & more. RERA registered.',
    metaKeywords: 'properties in Pune, flats in Wakad, 3 BHK Hinjewadi, Mantra Codename Paradise, Sus real estate, Associatte PropTech',
    featuredLocalities: ['Wakad', 'Hinjewadi', 'Baner', 'Sus', 'Kharadi'] as const,
    priceRange: { min: '₹75L', max: '₹4.5Cr' },
    coordinates: { lat: 18.5204, lng: 73.8567 },
  },
  mumbai: {
    name: 'Mumbai' as const,
    slug: 'mumbai' as const,
    heroTitle: 'Find Your Dream Home in Mumbai',
    heroSubtitle: 'Explore premium projects in Kharghar, Panvel, Thane & Navi Mumbai',
    metaTitle: 'Properties in Mumbai | 1, 2, 3 BHK Flats Starting ₹75L | Associatte PropTech',
    metaDescription: 'Find verified 1, 2, 3 BHK properties in Mumbai & Navi Mumbai. Browse projects in Kharghar, Panvel by Paradise Group, Today Global & more. RERA registered.',
    metaKeywords: 'properties in Mumbai, flats in Kharghar, 3 BHK Panvel, Sai World Empire, Navi Mumbai real estate, Associatte PropTech',
    featuredLocalities: ['Kharghar', 'Panvel', 'Thane', 'Andheri', 'Navi Mumbai'] as const,
    priceRange: { min: '₹75L', max: '₹4.5Cr' },
    coordinates: { lat: 19.0760, lng: 72.8777 },
  },
  kdmc: {
    name: 'KDMC' as const,
    slug: 'kdmc' as const,
    heroTitle: 'Find Your Dream Home in Kalyan-Dombivli',
    heroSubtitle: 'Explore affordable & premium projects in Kalyan, Dombivli, Badlapur & Ulhasnagar',
    metaTitle: 'Properties in KDMC | 2, 3 BHK Flats Starting ₹40L | Associatte PropTech',
    metaDescription: 'Find verified 2, 3 BHK properties in Kalyan-Dombivli (KDMC). Browse projects by Paradise Group, Today Global & more. RERA registered, transparent pricing.',
    metaKeywords: 'properties in KDMC, flats in Kalyan, 2 BHK Dombivli, affordable homes Kalyan-Dombivli, Paradise Sai World Empire, Associatte PropTech',
    featuredLocalities: ['Kalyan', 'Dombivli', 'Ulhasnagar', 'Badlapur', 'Ambarnath'] as const,
    priceRange: { min: '₹40L', max: '₹1.5Cr' },
    coordinates: { lat: 19.2403, lng: 73.1305 },
  },
} as const;

// ✅ Auto-generated types from config - NEVER manually update these
export type CitySlug = keyof typeof LOCATION_CONFIG;
export type CityName = typeof LOCATION_CONFIG[CitySlug]['name'];
export type CityConfig = typeof LOCATION_CONFIG[CitySlug];
export type FeaturedLocality = typeof LOCATION_CONFIG[CitySlug]['featuredLocalities'][number];

// ✅ Type guards
export function isValidCitySlug(slug: string): slug is CitySlug {
  return slug in LOCATION_CONFIG;
}

export function isValidCityName(name: string): name is CityName {
  return Object.values(LOCATION_CONFIG).some(config => config.name === name);
}

// ✅ Helper functions
export function getLocationConfig(slug: CitySlug): CityConfig {
  return LOCATION_CONFIG[slug];
}

export function getCitySlugByName(name: CityName): CitySlug {
  return Object.keys(LOCATION_CONFIG).find(
    key => LOCATION_CONFIG[key as CitySlug].name === name
  ) as CitySlug;
}

export function getAllCityNames(): CityName[] {
  return Object.values(LOCATION_CONFIG).map(config => config.name);
}

export function getAllCitySlugs(): CitySlug[] {
  return Object.keys(LOCATION_CONFIG) as CitySlug[];
}