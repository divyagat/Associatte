"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Home, IndianRupee } from "lucide-react";

interface SearchBarProps {
  variant?: "hero" | "compact";
  initialValues?: {
    location?: string;
    type?: string;
    budget?: string;
    status?: string;
  };
}

const LOCATIONS = [
  "Mumbai","Pune","Bangalore","Hyderabad","Chennai",
  "Delhi","Kolkata","Lucknow","Kalyani Nagar","Baner",
  "Wakad","Kharadi","Hadapsar","Viman Nagar","Andheri West",
  "Koramangala","HSR Layout","Whitefield","Marathahalli","Gachibowli",
];

const PROPERTY_TYPES = [
  { value: "all", label: "All Types" },
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "house", label: "Independent House" },
  { value: "plot", label: "Plot / Land" },
  { value: "commercial", label: "Commercial" },
  { value: "studio", label: "Studio" },
  { value: "penthouse", label: "Penthouse" },
];

const BUDGETS = [
  { value: "all", label: "Any Budget" },
  { value: "0-25", label: "Under ₹25 Lac" },
  { value: "25-50", label: "₹25–50 Lac" },
  { value: "50-100", label: "₹50 Lac–1 Cr" },
  { value: "100-200", label: "₹1–2 Cr" },
  { value: "200-500", label: "₹2–5 Cr" },
  { value: "500-+", label: "₹5 Cr+" },
];

export default function SearchBar({ variant="hero", initialValues }: SearchBarProps) {
  const router = useRouter();

  const [location, setLocation] = useState(initialValues?.location || "");
  const [type, setType] = useState(initialValues?.type || "all");
  const [budget, setBudget] = useState(initialValues?.budget || "all");
  const [status, setStatus] = useState(initialValues?.status || "sale");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const isHero = variant === "hero";

  const handleLocationInput = (val: string) => {
    setLocation(val);
    if (!val) return setShowSuggestions(false);

    const filtered = LOCATIONS.filter(l =>
      l.toLowerCase().includes(val.toLowerCase())
    );
    setSuggestions(filtered);
    setShowSuggestions(true);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (type !== "all") params.set("type", type);
    if (budget !== "all") params.set("budget", budget);
    if (status) params.set("status", status);

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className={`w-full ${isHero ? "max-w-4xl" : "max-w-full"}`}>
      
      {/* Tabs */}
      <div className="flex gap-1 mb-3">
        {["sale","rent"].map(s => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-5 py-2 text-sm font-semibold rounded-t-lg
            ${status===s ? "bg-white text-blue-700 shadow" :
            isHero ? "bg-white/20 text-white hover:bg-white/30" :
            "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {s==="sale"?"Buy":"Rent"}
          </button>
        ))}
      </div>

      {/* Form */}
      <div className={`bg-white rounded-2xl p-2 flex flex-col md:flex-row gap-2 shadow-xl`}>
        
        {/* Location */}
        <div className="flex-1 relative px-4 py-3 md:border-r">
          <div className="flex gap-2 items-center">
            <MapPin className="w-4 h-4 text-blue-600"/>
            <input
              placeholder="City or locality"
              value={location}
              onChange={(e)=>handleLocationInput(e.target.value)}
              onBlur={()=>setTimeout(()=>setShowSuggestions(false),150)}
              className="w-full outline-none"
            />
          </div>

          {showSuggestions && suggestions.length>0 && (
            <div className="absolute bg-white shadow rounded-xl mt-2 w-full z-50">
              {suggestions.map(s=>(
                <button
                  key={s}
                  onClick={()=>{setLocation(s);setShowSuggestions(false)}}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Type */}
        <select
          value={type}
          onChange={(e)=>setType(e.target.value)}
          className="px-4 py-3"
        >
          {PROPERTY_TYPES.map(t=>(
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        {/* Budget */}
        <select
          value={budget}
          onChange={(e)=>setBudget(e.target.value)}
          className="px-4 py-3"
        >
          {BUDGETS.map(b=>(
            <option key={b.value} value={b.value}>{b.label}</option>
          ))}
        </select>

        {/* Button */}
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl flex items-center gap-2"
        >
          <Search className="w-5 h-5"/>
          Search
        </button>

      </div>
    </div>
  );
}