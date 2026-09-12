'use client';

interface PropertySchemaData {
  name: string;
  images?: string[];
  description?: string;
  builder?: string;
  price: number;
  status?: string;
  slug: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  area?: string | number;
  bhk?: string | number;
  amenities?: string[];
}

const PropertySchema = ({ property }: { property: PropertySchemaData }) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product", // or "Residence" / "Place"
    "name": property.name,
    "image": property.images || [],
    "description": property.description,
    "brand": {
      "@type": "Brand",
      "name": property.builder,
      "url": `/builders/${property.builder?.toLowerCase()?.replace(/\s+/g, '-')}`
    },
    "provider": {
      "@type": "Organization",
      "name": "Associatte PropTech Pvt Ltd",
      "url": "https://www.associatte.com",
      "logo": "https://www.associatte.com/logos/associattewhitelogo.webp"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": property.price * 10000000, // Convert Cr to numeric price
      "priceValidUntil": new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0],
      "availability": property.status === 'Ready to Move' 
        ? "https://schema.org/InStock" 
        : "https://schema.org/PreOrder",
      "url": `https://www.associatte.com/property/${property.slug}`
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": property.address,
      "addressLocality": property.city,
      "addressRegion": property.state || "Maharashtra",
      "postalCode": property.pincode,
      "addressCountry": "IN"
    },
    "geo": property.latitude && property.longitude ? {
      "@type": "GeoCoordinates",
      "latitude": property.latitude,
      "longitude": property.longitude
    } : undefined,
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": property.area,
      "unitCode": "FTK" // Square Feet
    },
    "numberOfRooms": property.bhk,
    "amenityFeature": property.amenities?.map((amenity: string) => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity,
      "value": true
    })) || []
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default PropertySchema;