"use client";
import { useState, KeyboardEvent, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface HeroSearchProps {
  className?: string;
  headerHeight?: number;
}

type PropertyType = "apartments" | "plots";

interface Suggestion {
  id: string;
  label: string;
  type: "locality" | "project" | "builder";
}

export default function HeroSearch({ className = "", headerHeight = 64 }: HeroSearchProps): JSX.Element {
  const [search, setSearch] = useState<string>("");
  const [propertyType, setPropertyType] = useState<PropertyType>("apartments");
  const [isSticky, setIsSticky] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // Mock suggestions - replace with API call in production
  const suggestions: Suggestion[] = [
    { id: "1", label: "Kharghar", type: "locality" },
    { id: "2", label: "Panvel", type: "locality" },
    { id: "3", label: "Paradise Sai World Empire", type: "project" },
    { id: "4", label: "Mantra Codename Paradise", type: "project" },
  ].filter(s => s.label.toLowerCase().includes(search.toLowerCase()));

  // Sync scroll state
  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 280);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (): void => {
    if (!search.trim()) return;
    setShowSuggestions(false);
    router.push(`/properties?search=${encodeURIComponent(search)}&type=${propertyType}`);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") handleSearch();
    if (e.key === "Escape") setShowSuggestions(false);
  };

  const executeSearch = (query: string) => {
    setSearch(query);
    setShowSuggestions(false);
    router.push(`/properties?search=${encodeURIComponent(query)}&type=${propertyType}`);
  };

  const handleSuggestionClick = (suggestion: string) => {
    executeSearch(suggestion);
  };

  // ─────────────────────────────────────────────────────────────
  // 🔹 Reusable UI Components
  // ─────────────────────────────────────────────────────────────

  const PropertyTabs = ({ compact = false }: { compact?: boolean }) => (
    <div className={`inline-flex items-center gap-1 p-1 bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl border border-gray-200/60 ${compact ? "scale-90 origin-left" : ""}`}>
      {(["apartments", "plots"] as PropertyType[]).map((type) => {
        const isDisabled = type === "plots";
        const isActive = propertyType === type;
        
        return (
          <button
            key={type}
            type="button"
            disabled={isDisabled}
            onClick={() => !isDisabled && setPropertyType(type)}
            className={`
              relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
              flex items-center gap-2 min-w-[100px] justify-center
              ${isActive 
                ? "bg-white text-[#005E60] shadow-sm ring-1 ring-gray-200" 
                : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
              }
              ${isDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
              focus:outline-none focus:ring-2 focus:ring-[#005E60]/30
            `}
            aria-pressed={isActive}
          >
            {/* Active indicator dot */}
            {isActive && (
              <span className="absolute -left-0.5 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#005E60] rounded-full" />
            )}
            
            {/* Icons */}
            {type === "apartments" ? (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="8" width="18" height="12" rx="2" className={isActive ? "stroke-[#005E60]" : ""}/>
                <path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" className={isActive ? "stroke-[#005E60]" : ""}/>
                <path d="M9 21v-4h6v4" className={isActive ? "stroke-[#005E60]" : ""}/>
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 21h18M5 21V7l7-4 7 4v14"/>
                <path d="M9 10h.01M15 10h.01M9 14h.01M15 14h.01"/>
              </svg>
            )}
            
            <span className={`capitalize ${compact ? "hidden sm:inline" : ""}`}>
              {type}
            </span>
            
            {/* "Soon" badge for plots */}
            {isDisabled && (
              <span className="absolute -top-1.5 -right-1.5 text-[9px] bg-gradient-to-r from-rose-500 to-rose-600 text-white px-1.5 py-0.5 rounded-full font-bold shadow-sm whitespace-nowrap">
                Soon
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  const SearchInput = ({ compact = false }: { compact?: boolean }) => (
    <div ref={searchRef} className={`relative ${compact ? "" : "lg:max-w-xl"}`}>
      {/* Search Field */}
      <div className={`
        relative flex items-center transition-all duration-200
        ${isFocused ? "ring-2 ring-[#005E60]/20" : ""}
        bg-white border border-gray-200 rounded-xl overflow-hidden
        hover:border-gray-300 focus-within:border-[#005E60]
      `}>
        {/* Search Icon */}
        <div className="absolute left-4 pointer-events-none">
          <svg className={`text-gray-400 transition-colors ${isFocused ? "text-[#005E60]" : ""} ${compact ? "w-4 h-4" : "w-5 h-5"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35" strokeLinecap="round"/>
          </svg>
        </div>
        
        {/* Input */}
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(true);
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyPress}
          placeholder={compact ? "Search..." : "Search projects, localities, or builders..."}
          className={`
            w-full bg-transparent text-gray-900 placeholder-gray-400
            pl-11 pr-10 text-sm font-medium
            focus:outline-none py-3
            ${compact ? "py-2.5" : ""}
          `}
          aria-label="Search properties"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
        />
        
        {/* Clear Button */}
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-150"
            aria-label="Clear search"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && search.trim() && (
        <div 
          id="search-suggestions"
          role="listbox"
          className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {suggestions.length > 0 ? (
            <ul className="max-h-60 overflow-auto py-1">
              {suggestions.map((suggestion, index) => (
                <li key={suggestion.id}>
                  <button
                    type="button"
                    role="option"
                    onClick={() => handleSuggestionClick(suggestion.label)}
                    className={`
                      w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-[#005E60]/5 transition-colors
                      ${index === suggestions.length - 1 ? "" : "border-b border-gray-50"}
                    `}
                  >
                    {/* Type Icon */}
                    <span className={`
                      w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold
                      ${suggestion.type === "locality" ? "bg-emerald-100 text-emerald-700" : ""}
                      ${suggestion.type === "project" ? "bg-blue-100 text-blue-700" : ""}
                      ${suggestion.type === "builder" ? "bg-purple-100 text-purple-700" : ""}
                    `}>
                      {suggestion.type[0].toUpperCase()}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{suggestion.label}</p>
                      <p className="text-xs text-gray-400 capitalize">{suggestion.type}</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              No results for "{search}"
            </div>
          )}
          
          {/* Footer hint */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 flex items-center gap-2">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M1 12h4M19 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            Press <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-600 font-mono">Enter</kbd> to search
          </div>
        </div>
      )}
    </div>
  );

  const SearchButton = ({ compact = false, variant = "primary" }: { compact?: boolean; variant?: "primary" | "ghost" }) => {
    const baseClasses = `
      flex items-center justify-center gap-2 font-semibold text-sm rounded-xl
      transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#005E60]/30
      ${compact ? "px-4 py-2.5" : "px-6 py-3 min-w-[140px]"}
    `;
    
    if (variant === "ghost") {
      return (
        <button
          type="button"
          onClick={handleSearch}
          disabled={!search.trim()}
          className={`
            ${baseClasses}
            text-[#005E60] bg-[#005E60]/10 hover:bg-[#005E60]/20
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <span className={compact ? "hidden sm:inline" : ""}>Search</span>
        </button>
      );
    }
    
    return (
      <button
        type="button"
        onClick={handleSearch}
        disabled={!search.trim()}
        className={`
          ${baseClasses}
          bg-gradient-to-r from-[#005E60] to-[#007a7d] 
          hover:from-[#004a4c] hover:to-[#006365]
          text-white shadow-lg shadow-[#005E60]/20 hover:shadow-xl hover:shadow-[#005E60]/30
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg
          active:scale-[0.98]
        `}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <span className={compact ? "hidden sm:inline" : ""}>Search</span>
      </button>
    );
  };

  // ─────────────────────────────────────────────────────────────
  // 🔹 Main Render
  // ─────────────────────────────────────────────────────────────

  return (
    <div className={className}>
      
      {/* 🔹 Sticky Header Version (appears on scroll) */}
      <div
        className={`
          fixed left-0 right-0 z-40 transition-all duration-300 ease-out
          bg-white/95 backdrop-blur-xl border-b border-gray-100/80
          ${isSticky 
            ? "opacity-100 translate-y-0 shadow-sm pointer-events-auto" 
            : "opacity-0 -translate-y-4 pointer-events-none"
          }
        `}
        style={{ top: `${headerHeight}px` }}
        role="search"
        aria-label="Property search"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            <PropertyTabs compact />
            <div className="flex-1 min-w-0"><SearchInput compact /></div>
            <SearchButton compact variant="ghost" />
          </div>
        </div>
      </div>

      {/* 🔹 Hero Version (main search, fades when sticky activates) */}
      <div 
        className={`
          transition-all duration-500 ease-out transform-gpu
          ${isSticky ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"}
        `}
      >
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100/80 p-4 sm:p-5">
            
            {/* Search Row */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <PropertyTabs />
              <div className="flex-1 min-w-0"><SearchInput /></div>
              <SearchButton />
            </div>
            
            {/* Popular Localities */}
            <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 border-t border-gray-100">
              <span className="text-xs font-medium text-gray-400">Popular:</span>
              {["Kharghar", "Panvel", "Navi Mumbai", "Thane"].map((loc, idx) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => executeSearch(loc)}
                  className={`
                    group relative px-3.5 py-1.5 text-xs font-medium rounded-full
                    bg-gray-50 text-gray-600 hover:text-white
                    hover:bg-gradient-to-r hover:from-[#005E60] hover:to-[#007a7d]
                    transition-all duration-200 shadow-sm hover:shadow-md
                    focus:outline-none focus:ring-2 focus:ring-[#005E60]/30
                    active:scale-95
                  `}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {loc}
                  {/* Subtle hover glow */}
                  <span className="absolute inset-0 rounded-full bg-[#005E60]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
            
            {/* Helper Text */}
            <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
              <p>Search for projects, localities, or builders</p>
              <div className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                </svg>
                <span>Tip: Use filters after searching</span>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}