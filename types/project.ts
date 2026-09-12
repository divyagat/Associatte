// types/project.ts

/** A property configuration row, e.g. one "2 BHK" line in a project's price table. */
export interface ProjectConfiguration {
  type: string;
  area: string;
  price: string;
  description?: string;
}

export interface ProjectFloorPlan {
  type: string;
  area: string;
  image: string;
}

export interface ProjectNearbyPlace {
  type: string;
  name: string;
  distance: string;
}

// `/projects` and `/properties` listings are persisted the same way (see
// lib/data-store.ts and lib/visibility.ts's "every property & project carries
// a status" note) and are read interchangeably in places like the project
// detail page's fallback lookup, so both share this one record shape.
export interface Project {
  id?: string | number;
  _id?: string;
  slug: string;
  name: string;
  description?: string;
  about?: string;
  location: string;
  city?: 'pune' | 'mumbai' | 'kdmc';
  fullLocation?: {
    area?: string;
    city?: string;
    state?: string;
    pincode?: string;
    landmark?: string;
  };
  price: string;
  priceNumeric?: number;
  priceDetails?: {
    range?: string;
    perSqft?: string;
    configurations?: ProjectConfiguration[];
  };
  area?: string;
  bhk?: string[];
  propertyType?: 'Apartment' | 'Villa' | 'Plot' | 'Studio' | 'Penthouse' | 'Office Space' | string;
  builder?: string;
  developer?: string | { name: string; established?: string; projectsCount?: number; description?: string };
  image: string;
  images?: string[];
  masterPlan?: string;
  locationMap?: string;
  gallery?: string[];
  mapCoords?: { lat: number; lng: number };
  rating?: number;
  amenities?: string[];
  floorPlans?: ProjectFloorPlan[];
  nearbyPlaces?: ProjectNearbyPlace[];
  emi?: { startingFrom?: string; downPayment?: string; interestRate?: string; tenure?: string };
  soldOut?: boolean;
  // Extra admin-entered keywords the listing should surface for in site search.
  searchKeywords?: string[];
  isTopSelling?: boolean;
  isFeatured?: boolean;
  launchDate?: string;
  possessionDate?: string;
  reraId?: string;
  reraNumber?: string;
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
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown; // Allow additional fields from JSON not modeled above
}

export type ProjectSlug = string;