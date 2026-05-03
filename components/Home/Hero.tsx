// @/components/sections/HeroSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState<'buy' | 'rent' | 'commercial' | 'pg' | 'plots'>('buy');
  const [searchQuery, setSearchQuery] = useState('');
  const [showStickySearch, setShowStickySearch] = useState(false);

  const tabs = [
    { id: 'buy', label: 'BUY' },
    { id: 'rent', label: 'RENT' },
    { id: 'commercial', label: 'COMMERCIAL' },
    { id: 'pg', label: 'PG/CO-LIVING' },
    { id: 'plots', label: 'PLOTS' },
  ] as const;

  useEffect(() => {
    const handleScroll = () => {
      setShowStickySearch(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = () => {
    console.log({ activeTab, searchQuery });
  };

  return (
    <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 overflow-hidden min-h-[600px]">
      {/* City Skyline Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-blue-900/40" />
        
        {/* City buildings silhouette */}
        <svg className="absolute bottom-0 left-0 right-0 h-64 w-full opacity-20" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="currentColor" className="text-slate-900" d="M0,224L80,213.3C160,203,320,181,480,181.3C640,181,800,203,960,224C1120,245,1280,267,1360,277.3L1440,288L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
        
        {/* Building shapes */}
        <div className="absolute bottom-0 left-10 w-16 h-48 bg-slate-800/30 rounded-t-lg" />
        <div className="absolute bottom-0 left-32 w-20 h-64 bg-slate-800/30 rounded-t-lg" />
        <div className="absolute bottom-0 left-56 w-14 h-40 bg-slate-800/30 rounded-t-lg" />
        <div className="absolute bottom-0 right-20 w-24 h-56 bg-slate-800/40 rounded-t-lg" />
        <div className="absolute bottom-0 right-52 w-16 h-36 bg-slate-800/30 rounded-t-lg" />
        
        {/* Decorative circles */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute top-40 right-40 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
            >
              Properties to buy in India
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-lg sm:text-xl text-purple-100 mb-8 font-medium"
            >
              8K+ listings added daily and 76K+ total verified
            </motion.p>

            {/* Navigation Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex bg-slate-900/80 backdrop-blur-sm rounded-t-xl p-1 mb-0 overflow-x-auto"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-sm font-semibold rounded-t-lg transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-white border-b-2 border-purple-400 bg-white/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white rounded-b-xl rounded-tr-xl shadow-2xl p-2"
            >
              <div className="flex flex-col sm:flex-row gap-2">
                {/* Location Input */}
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg sm:flex-1">
                  <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search for locality, landmark, project, or builder"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-sm"
                  />
                </div>

                {/* Search Button */}
                <motion.button
                  onClick={handleSearch}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30"
                >
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Property Owner Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-6 inline-flex items-center gap-2 bg-slate-900/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-gray-200">
                Are you a Property Owner?{' '}
                <button className="text-white font-semibold hover:text-purple-300 transition-colors underline underline-offset-2">
                  Sell / Rent for FREE
                </button>
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </motion.div>
          </div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="hidden lg:block relative"
          >
            <div className="relative">
              {/* Decorative frame */}
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-400 to-blue-400 rounded-3xl opacity-30 blur-lg" />
              
              {/* Image container */}
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                <div className="relative rounded-xl overflow-hidden aspect-[4/3]">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-50" />
                  {/* Placeholder for couple image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center">
                        <span className="text-6xl">🏠</span>
                      </div>
                      <p className="text-gray-600 font-medium">Couple viewing property</p>
                    </div>
                  </div>
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 bg-white rounded-xl p-3 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-semibold text-gray-700">Verified Listings</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-4 -left-4 bg-white rounded-xl p-3 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">76K+</p>
                    <p className="text-[10px] text-gray-500">Properties</p>
                  </div>
                </div>
              </motion.div>
            </div>
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
            className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1 overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="flex-1 flex gap-2">
                  <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search locality, project..."
                      className="flex-1 bg-transparent outline-none text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                    Search
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}