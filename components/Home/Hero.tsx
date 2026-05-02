// @/components/sections/HeroSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Home,
  Building2,
  Construction,
  KeyRound,
  ChevronDown,
  Handshake,
  RefreshCcw,
  Sparkles,
} from 'lucide-react';

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState<'residential' | 'commercial' | 'underConstruction' | 'readyToMove' | 'rental' | 'reselling'>('residential');
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [showStickySearch, setShowStickySearch] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
    { 
      id: 'residential', 
      label: 'Residential', 
      sublabel: 'Buy Homes',
      icon: Home, 
      gradient: 'from-amber-400 to-orange-500',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-600'
    },
    { 
      id: 'commercial', 
      label: 'Commercial', 
      sublabel: 'Offices & Shops',
      icon: Building2, 
      gradient: 'from-violet-400 to-purple-500',
      bg: 'bg-violet-50',
      border: 'border-violet-200',
      text: 'text-violet-600'
    },
    { 
      id: 'underConstruction', 
      label: 'Under Construction', 
      sublabel: 'Pre-Launch Deals',
      icon: Construction, 
      gradient: 'from-sky-400 to-blue-500',
      bg: 'bg-sky-50',
      border: 'border-sky-200',
      text: 'text-sky-600'
    },
    { 
      id: 'readyToMove', 
      label: 'Ready to Move', 
      sublabel: 'Instant Possession',
      icon: KeyRound, 
      gradient: 'from-rose-400 to-red-500',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      text: 'text-rose-600'
    },
    { 
      id: 'rental', 
      label: 'Rental', 
      sublabel: 'Rent Properties',
      icon: Handshake, 
      gradient: 'from-emerald-400 to-green-500',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-600'
    },
    { 
      id: 'reselling', 
      label: 'Resale', 
      sublabel: 'Second Hand',
      icon: RefreshCcw, 
      gradient: 'from-teal-400 to-cyan-500',
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      text: 'text-teal-600'
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowStickySearch(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = () => {
    // Implement search logic here
    console.log({ activeTab, selectedCity, searchQuery });
  };

  const SearchBar = ({ isSticky = false }: { isSticky?: boolean }) => (
    <div className={`bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 ${isSticky ? 'p-2' : 'p-5'}`}>
      
      {/* Category Tabs - Modern Card Style */}
      <div className={`${isSticky ? 'mb-2' : 'mb-4'}`}>
        <div className="overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
          <div className="flex gap-2 min-w-max">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeTab === category.id;
              
              return (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveTab(category.id as any)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative flex flex-col items-start gap-1.5 px-4 py-2.5 rounded-xl transition-all duration-200 border-2 min-w-[140px] ${
                    isActive
                      ? `${category.bg} ${category.border} shadow-lg`
                      : 'bg-gray-50 border-gray-100 hover:border-gray-200 hover:bg-gray-100'
                  } ${isSticky ? 'py-2 min-w-[110px]' : ''}`}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className={`absolute inset-0 rounded-xl bg-gradient-to-r ${category.gradient} opacity-10`}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  <div className={`relative z-10 flex items-center gap-2`}>
                    <div className={`p-1.5 rounded-lg ${isActive ? `bg-gradient-to-r ${category.gradient}` : 'bg-white'} shadow-sm`}>
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : category.text}`} />
                    </div>
                    <div className="text-left">
                      <p className={`font-bold ${isSticky ? 'text-[11px]' : 'text-xs'} ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                        {category.label}
                      </p>
                      {!isSticky && (
                        <p className={`text-[10px] ${isActive ? category.text : 'text-gray-400'} font-medium`}>
                          {category.sublabel}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Search Input Section */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* City Dropdown */}
        <div className="relative w-full sm:w-48 flex-shrink-0">
          <motion.button
            onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`w-full flex items-center justify-between px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 ${
              isSticky ? 'py-2.5 text-xs' : ''
            } ${isCityDropdownOpen ? 'border-blue-400 bg-blue-50/50' : ''}`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 bg-white rounded-lg shadow-sm">
                <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
              </div>
              <span className="font-semibold text-gray-800 truncate">{selectedCity}</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${isCityDropdownOpen ? 'rotate-180' : ''}`} />
          </motion.button>

          <AnimatePresence>
            {isCityDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 overflow-hidden"
              >
                <div className="p-2">
                  {cities.map((city, index) => (
                    <motion.button
                      key={city}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => {
                        setSelectedCity(city);
                        setIsCityDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 text-left px-4 py-2.5 rounded-lg transition-all duration-150 ${
                        selectedCity === city 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <MapPin className={`w-4 h-4 flex-shrink-0 ${selectedCity === city ? 'text-white/90' : 'text-gray-400'}`} />
                      <span className={`font-medium ${selectedCity === city ? 'text-white' : ''}`}>{city}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search Input */}
        <div className="flex-1 relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search by location, project, or builder..."
            className={`w-full pl-11 pr-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder:text-gray-400 ${
              isSticky ? 'py-2.5 text-sm' : 'py-3'
            }`}
          />
        </div>

        {/* Search Button */}
        <motion.button 
          onClick={handleSearch}
          whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
          whileTap={{ scale: 0.98 }}
          className={`bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 flex-shrink-0 ${
            isSticky ? 'text-xs py-2.5' : ''
          }`}
        >
          <Search className={`w-4 h-4 ${isSticky ? 'hidden' : ''}`} />
          <span>Search</span>
        </motion.button>
      </div>
    </div>
  );

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-amber-200/30 to-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-100/20 to-cyan-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="max-w-5xl mx-auto">
          
          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm mb-4">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-gray-700">Trusted by 50,000+ Home Buyers</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              Find Your Dream Property in
            </h1>
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {['Bangalore', 'Chennai', 'Mumbai', 'Pune'].map((city, i) => (
                <motion.span
                  key={city}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-sm font-semibold border border-blue-200"
                >
                  {city}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Main Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-5"
          >
            <SearchBar />
          </motion.div>

          {/* Location Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-2"
          >
            <span className="text-sm text-gray-500 mr-2 flex items-center">Popular:</span>
            {locations.map((location, index) => (
              <motion.button
                key={location}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className={`flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700 transition-all duration-200 shadow-sm hover:shadow-md ${
                  index === 0 ? 'ring-2 ring-orange-200 border-orange-200 bg-orange-50 text-orange-700' : ''
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                {location}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Sticky Search Bar */}
      <AnimatePresence>
        {showStickySearch && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <SearchBar isSticky />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}