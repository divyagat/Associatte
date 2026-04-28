// app/properties/page.tsx
"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("search");
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      const fetchProperties = async () => {
        try {
          // ✅ Fetch from API route
          const res = await fetch(`/api/properties?search=${encodeURIComponent(query)}`, {
            cache: 'no-store' // Prevent stale cached responses
          });

          // ✅ Validate response before parsing JSON
          const contentType = res.headers.get('content-type');
          if (!contentType?.includes('application/json')) {
            const text = await res.text();
            console.error('Expected JSON, got:', text.substring(0, 200));
            throw new Error(`Invalid response format: ${res.status}`);
          }

          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }

          const result = await res.json();
          
          if (result.success) {
            setProperties(result.data);
            setError(null);
          } else {
            throw new Error(result.error || 'Search failed');
          }
          
        } catch (err) {
          console.error("Search error:", err);
          setError(err instanceof Error ? err.message : 'Failed to load properties');
          setProperties([]);
        } finally {
          setLoading(false);
        }
      };
      fetchProperties();
    } else {
      setLoading(false);
    }
  }, [query]);

  if (loading) return <div className="p-8 text-center">Loading properties...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">
        {query ? `Results for "${query}"` : "All Properties"}
      </h1>
      
      {properties.length === 0 ? (
        <p className="text-gray-600">No properties found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="border rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold">{property.title}</h3>
              <p className="text-gray-600">{property.location}</p>
              <p className="text-primary font-bold">{property.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}