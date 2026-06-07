// components/SEO/OrganizationSchema.tsx
'use client';

export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Associatte PropTech Pvt Ltd",
    "alternateName": "Associatte",
    "url": "https://www.associatte.com",
    "logo": "https://www.associatte.com/logos/associattewhitelogo.webp",
    "description": "Leading real estate agent in Magarpatta, Pune. Trusted since 25+ years with 10,000+ happy clients.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "302 & 303, Naren Pearl, Magarpatta Road",
      "addressLocality": "Hadapsar",
      "addressRegion": "Maharashtra",
      "postalCode": "411028",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "18.5204",
      "longitude": "73.8567"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-8881188181",
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["English", "Hindi", "Marathi"]
    },
    "sameAs": [
      "https://www.facebook.com/AssociatteIndia/",
      "https://twitter.com/Associatte",
      "https://www.instagram.com/vikramm.associatte/",
      "https://www.linkedin.com/company/associatte-proptech"
    ],
    "priceRange": "₹75L - ₹5Cr+",
    "openingHours": "Tue-Sun 10:00-19:00",
    "areaServed": [
      { "@type": "City", "name": "Pune" },
      { "@type": "City", "name": "Mumbai" },
      { "@type": "City", "name": "Kharghar" },
      { "@type": "City", "name": "Magarpatta" }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}