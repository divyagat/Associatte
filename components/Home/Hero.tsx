"use client";
import { useState, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";

export default function Hero(): JSX.Element {
  const [search, setSearch] = useState<string>("");
  const router = useRouter();

  const handleSearch = (): void => {
    if (!search.trim()) return;
    router.push(`/properties?search=${encodeURIComponent(search)}`);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <section className="relative h-[90vh] flex items-center justify-center">

      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1568605114967-8130f3a36994')] bg-cover bg-center" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-6 text-white">

        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          Find Your Perfect <br />
          <span className="text-blue-400">Dream Home</span>
        </h1>

        <p className="mt-6 text-lg text-gray-200 max-w-xl">
          Explore premium properties in Pune, Mumbai & Bangalore.
          Buy, rent or invest with confidence.
        </p>

        {/* Category Pills */}
        <div className="flex gap-4 mt-8">
          <button className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full hover:bg-blue-600 transition">
            Buy
          </button>
          <button className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full hover:bg-blue-600 transition">
            Rent
          </button>
          <button className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full hover:bg-blue-600 transition">
            Commercial
          </button>
        </div>

        {/* Glass Search Box */}
        <div className="mt-10 bg-white/95 backdrop-blur-xl p-4 rounded-2xl flex flex-col md:flex-row gap-4 shadow-2xl max-w-3xl">

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Search city, area or project..."
            className="flex-1 p-4 rounded-lg text-black border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg font-semibold text-lg transition"
          >
            Search Property
          </button>

        </div>

        {/* Stats */}
        <div className="flex gap-10 mt-10 text-sm text-gray-300">
          <div>
            <p className="text-2xl font-bold text-white">10k+</p>
            <p>Properties</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">5k+</p>
            <p>Happy Buyers</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">15+</p>
            <p>Cities</p>
          </div>
        </div>

      </div>
    </section>
  );
}