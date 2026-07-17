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
  // Classification used by the Projects (type) & Properties (deal) navigation.
  category?: 'residential' | 'commercial' | 'plots' | 'warehouse' | 'industry' | string;
  dealType?: 'sale' | 'rent';
  // Approval / visibility state. Absent = published (legacy records).
  status?: 'published' | 'pending' | 'hidden';
  // Sale/Rent listing facts.
  ageOfConstruction?: string;
  builtUpArea?: string;
  expectedPrice?: string;
  [key: string]: any; // Allow additional fields from JSON
}

export type ProjectSlug = string;