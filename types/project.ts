// types/project.ts

export interface Project {
  id: string | number;
  slug: string;
  name: string;
  description?: string;
  location: string;
  city: 'pune' | 'mumbai' | 'kdmc';
  price: string;
  priceNumeric?: number;
  area: string;
  bhk: string[];
  propertyType: 'Apartment' | 'Villa' | 'Plot' | 'Studio' | 'Penthouse' | 'Office Space' | string;
  builder?: string;
  developer?: { name: string };
  image: string;
  images?: string[];
  rating?: number;
  amenities?: string[];
  isTopSelling?: boolean;
  isFeatured?: boolean;
  launchDate?: string;
  possessionDate?: string;
  reraId?: string;
  [key: string]: any; // Allow additional fields from JSON
}

export type ProjectSlug = string;