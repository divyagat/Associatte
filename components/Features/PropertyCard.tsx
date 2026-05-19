"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, MapPin, BedDouble, Bath, Maximize, Building } from "lucide-react";

export interface Property {
  id: string;
  slug: string;
  title: string;
  thumbnailUrl: string;
  type: string;
  locality: string;
  city: string;
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  priceLabel: string;
  price: number;
  priceUnit?: "total" | "monthly";
  status: "sale" | "rent";
  listedBy?: string;
  isFeatured?: boolean;
  isNew?: boolean;
}

interface PropertyCardProps {
  property: Property;
  variant?: "default" | "horizontal";
}

const TYPE_COLORS: Record<string, string> = {
  apartment: "bg-blue-100 text-blue-700",
  villa: "bg-purple-100 text-purple-700",
  plot: "bg-amber-100 text-amber-700",
  commercial: "bg-orange-100 text-orange-700",
  house: "bg-teal-100 text-teal-700",
  studio: "bg-indigo-100 text-indigo-700",
  penthouse: "bg-rose-100 text-rose-700",
};

export default function PropertyCard({ property, variant = "default" }: PropertyCardProps) {
  const [fav, setFav] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFav(!fav);
  };

  /* ---------------- HORIZONTAL CARD ---------------- */

  if (variant === "horizontal") {
    return (
      <Link
        href={`/property/${property.slug}`}
        className="flex bg-white rounded-2xl shadow hover:shadow-lg overflow-hidden transition"
      >
        <img
          src={property.thumbnailUrl}
          alt={property.title}
          className="w-56 object-cover"
        />

        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between mb-2">
              <span className={`text-xs px-2 py-1 rounded ${TYPE_COLORS[property.type]}`}>
                {property.type.toUpperCase()}
              </span>

              <button onClick={toggleFavorite}>
                <Heart className={`w-5 h-5 ${fav ? "text-red-500 fill-red-500" : "text-gray-400"}`} />
              </button>
            </div>

            <h3 className="font-semibold">{property.title}</h3>
            <p className="text-sm text-gray-500 flex gap-1 mt-1">
              <MapPin className="w-4 h-4"/> {property.locality}, {property.city}
            </p>
          </div>

          <p className="text-xl font-bold text-blue-700">{property.priceLabel}</p>
        </div>
      </Link>
    );
  }

  /* ---------------- DEFAULT CARD ---------------- */

  return (
    <Link
      href={`/property/${property.slug}`}
      className="bg-white rounded-2xl shadow hover:shadow-xl overflow-hidden transition group"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={property.thumbnailUrl}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />

        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow"
        >
          <Heart className={`w-4 h-4 ${fav ? "text-red-500 fill-red-500" : "text-gray-400"}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <span className={`text-xs px-2 py-1 rounded ${TYPE_COLORS[property.type]}`}>
          {property.type.toUpperCase()}
        </span>

        <h3 className="font-semibold mt-2 line-clamp-2">{property.title}</h3>

        <p className="text-sm text-gray-500 flex gap-1 mt-1">
          <MapPin className="w-4 h-4"/> {property.locality}, {property.city}
        </p>

        <div className="flex gap-3 text-sm text-gray-500 mt-3">
          {property.bedrooms && <span className="flex gap-1"><BedDouble className="w-4 h-4"/> {property.bedrooms} BHK</span>}
          {property.bathrooms && <span className="flex gap-1"><Bath className="w-4 h-4"/> {property.bathrooms}</span>}
          <span className="flex gap-1"><Maximize className="w-4 h-4"/> {property.area} sqft</span>
        </div>

        <div className="border-t mt-4 pt-3 flex justify-between items-center">
          <p className="text-xl font-bold text-blue-700">{property.priceLabel}</p>
          <span className="text-xs text-gray-400 flex gap-1">
            <Building className="w-3 h-3"/> {property.listedBy || "Builder"}
          </span>
        </div>
      </div>
    </Link>
  );
}