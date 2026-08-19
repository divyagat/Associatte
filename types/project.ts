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
  // Extra admin-entered keywords the listing should surface for in site search.
  searchKeywords?: string[];
  isTopSelling?: boolean;
  isFeatured?: boolean;
  launchDate?: string;
  possessionDate?: string;
  reraId?: string;
  // Classification used by the Projects (type) & Properties (deal) navigation.
  category?: 'residential' | 'commercial' | 'plots' | 'warehouse' | 'industry' | string;
  dealType?: 'sale' | 'rent';
  // Approval / visibility state. Absent = published (legacy records).
  // Two-stage approval: pending → manager_approved → published (see lib/visibility.ts).
  status?: 'published' | 'manager_approved' | 'pending' | 'hidden';
  // Sale/Rent listing facts.
  ageOfConstruction?: string;
  builtUpArea?: string;
  expectedPrice?: string;
  [key: string]: any; // Allow additional fields from JSON
}

export type ProjectSlug = string;