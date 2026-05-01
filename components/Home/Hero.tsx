// @/components/sections/HeroSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Home,
  Building,
  Construction,
  Key,
  ChevronDown,
} from 'lucide-react';

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState<'residential' | 'commercial' | 'underConstruction' | 'readyToMove'>('residential');
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [showStickySearch, setShowStickySearch] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  const cities = ['Mumbai', 'Pune', 'Bangalore', 'Chennai', 'Delhi NCR', 'Hyderabad'];
  
  const locations = [
    'Navi Mumbai',
    'Thane',
    'Central Mumbai',
    'Western Mumbai',
    'South Mumbai',
    'Kalyan Dombivali'
  ];

  const categories = [
    { id: 'residential', label: 'Residential Properties', icon: Home, color: 'text-yellow-500' },
    { id: 'commercial', label: 'Commercial Properties', icon: Building, color: 'text-purple-500' },
    { id: 'underConstruction', label: 'Under Construction Properties', icon: Construction, color: 'text-blue-500' },
    { id: 'readyToMove', label: 'Ready to Move Properties', icon: Key, color: 'text-red-500' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 400) {
        setShowStickySearch(true);
      } else {
        setShowStickySearch(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const SearchBar = ({ isSticky = false }: { isSticky?: boolean }) => (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${isSticky ? 'p-2' : 'p-4'}`}>
      {/* Category Tabs - Horizontal Cards */}
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-2 mb-3 ${isSticky ? 'mb-2' : 'mb-3'}`}>
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeTab === category.id;
          return (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all border ${
                isActive
                  ? 'bg-blue-50 border-blue-300 shadow-md'
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
              } ${isSticky ? 'py-1.5' : 'py-2'}`}
            >
              <div className={`${isSticky ? 'w-7 h-7' : 'w-8 h-8'} rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0`}>
                <Icon className={`${isSticky ? 'w-4 h-4' : 'w-5 h-5'} ${category.color}`} />
              </div>
              <div className="text-left min-w-0">
                <p className={`font-semibold text-gray-900 ${isSticky ? 'text-[10px] leading-tight' : 'text-xs leading-tight'}`}>
                  {category.label}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search Input Section */}
      <div className="flex gap-2">
        {/* City Dropdown */}
        <div className="relative w-40 flex-shrink-0">
          <button
            onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
            className={`w-full flex items-center justify-between px-3 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 transition-colors ${
              isSticky ? 'py-1.5 text-xs' : 'py-2 text-sm'
            }`}
          >
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="font-bold text-gray-900 truncate">{selectedCity}</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ${isCityDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isCityDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-auto"
              >
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setSelectedCity(city);
                      setIsCityDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition-colors ${
                      selectedCity === city ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search Location, Project Here"
              className={`w-full pl-9 pr-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors ${
                isSticky ? 'py-1.5 text-sm' : 'py-2 text-sm'
              }`}
            />
          </div>
        </div>

        {/* Search Button */}
        <button className={`bg-blue-700 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-800 transition-colors shadow-lg hover:shadow-xl flex-shrink-0 ${
          isSticky ? 'text-xs py-1.5' : 'text-sm'
        }`}>
          Search
        </button>
      </div>
    </div>
  );

  return (
    <section className="relative bg-gradient-to-b from-blue-100 to-gray-50 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading - Compact */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-4"
          >
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
              Premium Real Estate Properties in
            </h1>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mt-1">
              Bangalore Chennai
            </h2>
          </motion.div>

          {/* Main Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-3"
          >
            <SearchBar />
          </motion.div>

          {/* Location Tags - Compact */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-1.5"
          >
            {locations.map((location, index) => (
              <button
                key={location}
                className={`flex items-center gap-1 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-lg text-xs text-gray-700 hover:bg-orange-100 hover:border-orange-300 transition-all ${
                  index === 0 ? 'ring-2 ring-orange-300' : ''
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                {location}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Sticky Search Bar - Appears after scrolling */}
      <AnimatePresence>
        {showStickySearch && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b border-gray-200"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
              <SearchBar isSticky />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}