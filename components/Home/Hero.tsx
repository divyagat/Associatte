// app/components/Home/Hero.tsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
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
  ArrowRight,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Users,
} from 'lucide-react';

interface HeroProps {
  initialCity?: string;
  onSearch?: (params: { tab: string; city: string; query: string }) => void;
}

// Premium color system via CSS variables (add to globals.css)
const colors = {
  primary: 'oklch(0.55 0.22 270)',    // Indigo
  primaryHover: 'oklch(0.5 0.24 270)',
  accent: 'oklch(0.7 0.18 180)',      // Cyan
  surface: 'oklch(0.98 0.01 270)',    // Light bg
  surfaceDark: 'oklch(0.15 0.02 270)', // Dark bg
  text: 'oklch(0.15 0.01 270)',
  textMuted: 'oklch(0.5 0.01 270)',
};

export default function Hero({ initialCity = 'Mumbai', onSearch }: HeroProps) {
  const [activeTab, setActiveTab] = useState<'residential' | 'commercial' | 'underConstruction' | 'readyToMove' | 'rental' | 'reselling'>('residential');
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [showStickySearch, setShowStickySearch] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 200], [1, 0.95]);
  const heroScale = useTransform(scrollY, [0, 200], [1, 0.98]);

  const cities = useMemo(() => ['Mumbai', 'Pune', 'Bangalore', 'Chennai', 'Delhi NCR', 'Hyderabad'], []);
  const locations = useMemo(() => ['Navi Mumbai', 'Thane', 'Bandra', 'Andheri', 'Powai', 'Worli'], []);
  const searchSuggestions = useMemo(() => [
    '3 BHK in Kharghar', 'Luxury villas Pune', 'Commercial space Mumbai', 
    'Ready to move Bangalore', 'Plots under 50L'
  ], []);

  const categories = useMemo(() => [
    { id: 'residential', label: 'Buy', icon: Home, color: '#6366f1', gradient: 'from-indigo-500 to-violet-600' },
    { id: 'commercial', label: 'Commercial', icon: Building2, color: '#8b5cf6', gradient: 'from-violet-500 to-purple-600' },
    { id: 'underConstruction', label: 'Pre-Launch', icon: Construction, color: '#06b6d4', gradient: 'from-cyan-500 to-teal-600' },
    { id: 'readyToMove', label: 'Ready', icon: KeyRound, color: '#f43f5e', gradient: 'from-rose-500 to-pink-600' },
    { id: 'rental', label: 'Rent', icon: Handshake, color: '#10b981', gradient: 'from-emerald-500 to-green-600' },
    { id: 'reselling', label: 'Resale', icon: RefreshCcw, color: '#f59e0b', gradient: 'from-amber-500 to-orange-600' },
  ], []);

  // Track mouse for subtle parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Sticky header logic
  useEffect(() => {
    const handleScroll = () => setShowStickySearch(window.scrollY > 120);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = useCallback(() => {
    if (searchQuery.trim() || selectedCity) {
      onSearch?.({ tab: activeTab, city: selectedCity, query: searchQuery.trim() });
    }
  }, [activeTab, selectedCity, searchQuery, onSearch]);

  // Auto-suggest on focus
  const [showSuggestions, setShowSuggestions] = useState(false);
  const filteredSuggestions = useMemo(() => {
    if (!searchQuery) return searchSuggestions;
    return searchSuggestions.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 4);
  }, [searchQuery, searchSuggestions]);

  // Premium animated background component
  const AnimatedBackground = () => {
    const x = (mousePosition.x / window.innerWidth - 0.5) * 20;
    const y = (mousePosition.y / window.innerHeight - 0.5) * 20;

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950" />
        
        {/* Animated gradient orbs with parallax */}
        <motion.div
          className="absolute top-[-10%] right-[-10%] w-[700px] h-[700px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
            x,
            y: y * 0.5,
          }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
            x: x * 0.7,
            y: -y * 0.3,
          }}
          animate={{
            scale: [1.05, 1, 1.05],
            opacity: [0.25, 0.35, 0.25],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        
        {/* Subtle noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Animated grid lines */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Bottom fade for seamless content transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent" />
      </div>
    );
  };

  // Premium search bar component
  const SearchBar = ({ isSticky = false }: { isSticky?: boolean }) => (
    <motion.div
      layout
      className={`bg-white/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 ${
        isFocused ? 'ring-2 ring-indigo-500/30 shadow-indigo-500/10' : ''
      } ${isSticky ? 'p-2' : 'p-4 lg:p-5'} transition-all duration-300`}
    >
      {/* Elegant Category Tabs */}
      <div className={`${isSticky ? 'mb-2' : 'mb-4'} overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1`}>
        <div className="flex gap-1.5 min-w-max">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeTab === category.id;
            
            return (
              <motion.button
                key={category.id}
                onClick={() => setActiveTab(category.id as any)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 min-w-[72px] justify-center group ${
                  isActive
                    ? `bg-gradient-to-r ${category.gradient} text-white shadow-lg shadow-${category.color}/20`
                    : 'bg-slate-50/80 text-slate-600 hover:bg-slate-100/80 border border-slate-200/60 hover:border-slate-300'
                } ${isSticky ? 'px-2.5 py-1.5 text-[10px] min-w-[64px]' : ''}`}
              >
                {/* Subtle shine effect on active */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-white/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : ''}`} 
                  style={!isActive ? { color: category.color } : {}} 
                />
                <span className={isSticky ? 'hidden sm:inline' : ''}>{category.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Search Input Row */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        {/* City Selector with Animation */}
        <div className="relative w-full sm:w-40 flex-shrink-0">
          <motion.button
            onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`w-full flex items-center justify-between px-4 py-3 bg-slate-50/80 border border-slate-200/60 rounded-xl hover:border-indigo-400/60 hover:bg-indigo-50/30 transition-all duration-200 text-sm group ${
              isCityDropdownOpen ? 'border-indigo-400 bg-indigo-50/50 ring-2 ring-indigo-500/20' : ''
            } ${isSticky ? 'py-2 text-xs' : ''}`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <motion.div 
                className="p-1.5 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.3 }}
              >
                <MapPin className="w-4 h-4 text-indigo-500" />
              </motion.div>
              <span className="font-semibold text-slate-700 truncate">{selectedCity}</span>
            </div>
            <motion.div
              animate={{ rotate: isCityDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-500" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {isCityDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden"
              >
                <div className="p-1.5">
                  {cities.map((city, index) => (
                    <motion.button
                      key={city}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => { setSelectedCity(city); setIsCityDropdownOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-all duration-150 ${
                        selectedCity === city 
                          ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <MapPin className={`w-4 h-4 flex-shrink-0 ${selectedCity === city ? 'text-white/90' : 'text-slate-400'}`} />
                      <span className={`font-medium ${selectedCity === city ? 'text-white' : ''}`}>{city}</span>
                      {selectedCity === city && (
                        <CheckCircle2 className="w-4 h-4 ml-auto text-white/90" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Smart Search Input with Suggestions */}
        <div className="flex-1 relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <motion.div
              animate={{ scale: isFocused ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <Search className={`w-5 h-5 transition-colors ${isFocused ? 'text-indigo-500' : 'text-slate-400 group-hover:text-slate-500'}`} />
            </motion.div>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
            onFocus={() => { setIsFocused(true); setShowSuggestions(true); }}
            onBlur={() => { setIsFocused(false); setTimeout(() => setShowSuggestions(false), 150); }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
              if (e.key === 'Escape') setShowSuggestions(false);
            }}
            placeholder="Search projects, localities, builders, or landmarks..."
            className={`w-full pl-11 pr-4 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100/50 transition-all duration-200 text-sm placeholder:text-slate-400 ${
              isSticky ? 'py-2' : 'py-3'
            }`}
          />
          
          {/* Smart Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && searchQuery && filteredSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-40 overflow-hidden"
              >
                {filteredSuggestions.map((suggestion, index) => (
                  <motion.button
                    key={suggestion}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => { setSearchQuery(suggestion); setShowSuggestions(false); handleSearch(); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-indigo-50/50 transition-colors group"
                  >
                    <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                    <span className="text-slate-600 group-hover:text-slate-800">{suggestion}</span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Premium Search Button */}
        <motion.button 
          onClick={handleSearch}
          whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -12px rgba(79, 70, 229, 0.5)" }}
          whileTap={{ scale: 0.98 }}
          className={`bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 flex-shrink-0 relative overflow-hidden ${
            isSticky ? 'py-2 text-xs' : 'py-3 text-sm'
          }`}
        >
          {/* Button shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.4 }}
          />
          
          <Search className="w-4 h-4 relative z-10" />
          <span className="relative z-10">{isSticky ? 'Go' : 'Search'}</span>
          <ArrowRight className="w-4 h-4 relative z-10 opacity-80" />
        </motion.button>
      </div>

      {/* Trust Signals - Minimal & Elegant */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 pt-3 border-t border-slate-100/60"
      >
        {[
          { icon: CheckCircle2, text: 'Verified listings', color: 'text-emerald-500' },
          { icon: TrendingUp, text: 'Best prices', color: 'text-indigo-500' },
          { icon: Users, text: 'Expert guidance', color: 'text-cyan-500' },
        ].map((item, i) => (
          <motion.span
            key={item.text}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500"
          >
            <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
            {item.text}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );

  return (
    <motion.section 
      style={{ opacity: heroOpacity, scale: heroScale }}
      className="relative min-h-[400px] lg:min-h-[440px] overflow-hidden"
    >
      {/* Premium Animated Background */}
      <AnimatedBackground />

      {/* Content Layer */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="grid lg:grid-cols-12 gap-8 items-end">
          
          {/* Left: Premium Branding + Headline */}
          <div className="lg:col-span-5 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Premium badge with sparkle animation */}
              <motion.div 
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/15 mb-5"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </motion.div>
                <span className="text-xs font-semibold text-white/90 tracking-wide">
                  Trusted by 50,000+ families
                </span>
              </motion.div>
              
              {/* Headline with gradient text + animation */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.08] mb-4">
                <span className="block">Discover Your</span>
                <motion.span 
                  className="block bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent"
                  initial={{ backgroundPosition: '0% 50%' }}
                  animate={{ backgroundPosition: '100% 50%' }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  Perfect Home
                </motion.span>
              </h1>
              
              {/* Subheadline */}
              <motion.p 
                className="text-sm sm:text-base text-slate-300 mb-6 max-w-sm mx-auto lg:mx-0 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Explore <span className="text-white font-medium">10,000+ verified properties</span> from India's most trusted builders
              </motion.p>

              {/* Location Quick Picks with Hover Effects */}
              <motion.div 
                className="flex flex-wrap justify-center lg:justify-start gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {locations.map((loc, i) => (
                  <motion.button
                    key={loc}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.04 }}
                    whileHover={{ 
                      scale: 1.05, 
                      backgroundColor: 'rgba(99, 102, 241, 0.2)',
                      borderColor: 'rgba(99, 102, 241, 0.4)',
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setSearchQuery(loc); handleSearch(); }}
                    className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-indigo-500/20 border border-white/10 rounded-full transition-all duration-200 backdrop-blur-sm"
                  >
                    {loc}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Right: Premium Search Card */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
            >
              <SearchBar />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pointer-events-none" />

      {/* Sticky Search Bar - Ultra Compact */}
      <AnimatePresence>
        {showStickySearch && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-2xl shadow-xl border-b border-slate-200/50"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
              <div className="flex items-center gap-3">
                {/* Compact Tabs */}
                <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-hide">
                  {categories.slice(0, 4).map((cat) => {
                    const Icon = cat.icon;
                    const isActive = activeTab === cat.id;
                    return (
                      <motion.button
                        key={cat.id}
                        onClick={() => setActiveTab(cat.id as any)}
                        whileTap={{ scale: 0.95 }}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all whitespace-nowrap ${
                          isActive 
                            ? `bg-gradient-to-r ${cat.gradient} text-white shadow-sm` 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <Icon className="w-3 h-3 inline mr-1" />
                        {cat.label}
                      </motion.button>
                    );
                  })}
                </div>
                
                {/* Ultra Compact Search */}
                <div className="flex-1 flex gap-2 min-w-0">
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg flex-1 min-w-0 border border-slate-200">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="text-xs text-slate-600 truncate">{selectedCity}</span>
                  </div>
                  <div className="flex-1 relative min-w-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 rounded-lg outline-none text-xs placeholder:text-slate-400 border border-slate-200 focus:border-indigo-400"
                    />
                  </div>
                  <motion.button 
                    onClick={handleSearch}
                    whileTap={{ scale: 0.95 }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors shadow-sm"
                  >
                    Search
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}