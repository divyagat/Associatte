// components/Layout/Header.tsx
'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  Building2, Phone, Menu, X, ChevronDown,
  Home, Building, KeyRound, Tag, MapPin, Warehouse, Factory,
  Handshake, FileText, Scale, ClipboardList, TrendingUp
} from 'lucide-react';

import {
  PROJECT_TYPES, DEAL_TYPES, getProjectType, getDealType,
  type ProjectTypeId, type DealTypeId,
} from '@/lib/categories';

// ✅ Brand Colors
const COLORS = {
  red: '#8B0000',
  green: '#005E60',
  yellow: '#F8C21C',
};

// Icon per project-type / deal-type id (nav dropdowns)
const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  residential: Home,
  commercial: Building,
  plots: MapPin,
  warehouse: Warehouse,
  industry: Factory,
  rental: KeyRound,
  sale: Tag,
};

// ✅ STEP 1: Renamed from Header to HeaderContent (removed 'export default')
function HeaderContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const [desktopDropdown, setDesktopDropdown] = useState<string | null>(null);
  const desktopTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Which project-types / deal-types actually have listings. `null` = not loaded
  // yet, in which case we optimistically show every category (avoids an empty nav
  // flash). Once loaded, categories with zero listings are hidden.
  const [availableTypes, setAvailableTypes] = useState<Set<ProjectTypeId> | null>(null);
  // Which property TYPES exist under each DEAL — drives the Sale / Rent dropdowns.
  const [typesByDeal, setTypesByDeal] = useState<Record<DealTypeId, Set<ProjectTypeId>> | null>(null);

  // Categories an admin has explicitly hidden from the public nav (site-config).
  const [hiddenTypes, setHiddenTypes] = useState<Set<string>>(new Set());
  const [hiddenDeals, setHiddenDeals] = useState<Set<string>>(new Set());

  const pathname = usePathname();
  const searchParams = useSearchParams(); // ✅ Added to properly read query params

  // Highlight a nav link / sub-link from the current path + query params, applying
  // each page's default tab when the relevant param is absent from the URL.
  const isHrefActive = (href: string): boolean => {
    if (href.includes('#')) return pathname === href.split('#')[0];
    const [path, query] = href.split('?');
    if (!query) return pathname === path || (pathname?.startsWith(path + '/') ?? false);
    if (pathname !== path) return false;
    for (const [key, val] of Array.from(new URLSearchParams(query).entries())) {
      const current = searchParams.get(key);
      if (current === null) {
        // No param in the URL → treat the page's default tab as active.
        if (path === '/properties' && key === 'deal' && val === 'sale') continue;
        if (path === '/projects' && key === 'type' && val === 'residential') continue;
        return false;
      }
      if (current !== val) return false;
    }
    return true;
  };

  // Fetch listings once to determine which categories are non-empty.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [propsRes, projectsRes, configRes] = await Promise.all([
          fetch('/api/properties'),
          fetch('/api/projects'),
          fetch('/api/site-config'),
        ]);
        const props = await propsRes.json().catch(() => []);
        const projects = await projectsRes.json().catch(() => []);
        const config = await configRes.json().catch(() => ({}));
        const all = [
          ...(Array.isArray(props) ? props : []),
          ...(Array.isArray(projects) ? projects : []),
        ];
        if (cancelled) return;
        setAvailableTypes(new Set(all.map(getProjectType)));
        // Group the property types present under each deal (Sale / Rent).
        const byDeal = {
          sale: new Set<ProjectTypeId>(),
          rent: new Set<ProjectTypeId>(),
        } as Record<DealTypeId, Set<ProjectTypeId>>;
        all.forEach((item) => {
          const deal = getDealType(item);
          (byDeal[deal] ?? (byDeal[deal] = new Set())).add(getProjectType(item));
        });
        setTypesByDeal(byDeal);
        setHiddenTypes(new Set(Array.isArray(config?.hiddenTypes) ? config.hiddenTypes : []));
        setHiddenDeals(new Set(Array.isArray(config?.hiddenDeals) ? config.hiddenDeals : []));
      } catch {
        // On failure leave both null so all categories remain visible.
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ✅ Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const nav = document.getElementById('mobile-nav');
      const menuButton = document.getElementById('mobile-menu-button');
      if (mobileMenuOpen && nav && !nav.contains(event.target as Node) && menuButton && !menuButton.contains(event.target as Node)) {
        setMobileMenuOpen(false);
        setOpenMobileDropdown(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  // ✅ Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Projects dropdown → by property TYPE; Properties dropdown → by DEAL type.
  // Empty categories are hidden once the listing data has loaded.
  const projectsDropdown = PROJECT_TYPES
    .filter((t) => (!availableTypes || availableTypes.has(t.id)) && !hiddenTypes.has(t.id))
    .map((t) => ({
      label: t.label,
      href: `/projects?type=${t.id}`,
      icon: TYPE_ICONS[t.id],
      color: t.color,
    }));

  // Sale and Rent each get their own nav dropdown, listing the property types
  // available under that deal. Types with no listing (once loaded) or hidden by
  // an admin are dropped; a deal whose dropdown ends up empty is hidden entirely.
  const buildDealDropdown = (dealId: DealTypeId) =>
    PROJECT_TYPES
      .filter((t) => (!typesByDeal || typesByDeal[dealId]?.has(t.id)) && !hiddenTypes.has(t.id))
      .map((t) => ({
        label: t.label,
        href: `/properties?deal=${dealId}&type=${t.id}`,
        icon: TYPE_ICONS[t.id],
        color: t.color,
      }));

  const dealNavItems = DEAL_TYPES
    .filter((d) => !hiddenDeals.has(d.id))
    .map((d) => ({
      name: d.label,
      href: `/properties?deal=${d.id}`,
      dropdown: buildDealDropdown(d.id),
    }))
    .filter((item) => item.dropdown.length > 0);

  const navLinks = [
    { name: 'Home', href: '/' },
    {
      name: 'Projects',
      href: '/projects',
      ...(projectsDropdown.length ? { dropdown: projectsDropdown } : {}),
    },
    ...dealNavItems,
    { name: 'About Us', href: '/about-us' },
    { 
      name: 'Services', 
      href: '/services',
      dropdown: [
        { label: 'Property Consultation', href: '/services#consultation', icon: Handshake, color: COLORS.green },
        { label: 'Home Loans', href: '/services#home-loans', icon: FileText, color: COLORS.yellow },
        { label: 'Legal Assistance', href: '/services#legal', icon: Scale, color: COLORS.red },
        { label: 'Property Management', href: '/services#management', icon: ClipboardList, color: COLORS.yellow },
        { label: 'Investment Advisory', href: '/services#investment', icon: TrendingUp, color: COLORS.red },
      ]
    },
    { 
      name: 'Know Your Developer', 
      href: '/builders',
      dropdown: [
        { label: 'All Builders', href: '/builders' },
        { label: 'Pune Builders', href: '/builders?location=pune' },
        { label: 'Mumbai Builders', href: '/builders?location=mumbai' },
        { label: 'KDMC Builders', href: '/builders?location=kdmc' },
      ]
    },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact Us', href: '/contact-us' },
  ];

  const toggleMobileDropdown = (linkName: string) => {
    setOpenMobileDropdown(prev => prev === linkName ? null : linkName);
  };

  const handleDesktopDropdownEnter = (linkName: string) => {
    if (desktopTimeoutRef.current) {
      clearTimeout(desktopTimeoutRef.current);
    }
    setDesktopDropdown(linkName);
  };
  
  const handleDesktopDropdownLeave = () => {
    desktopTimeoutRef.current = setTimeout(() => {
      setDesktopDropdown(null);
    }, 150);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setOpenMobileDropdown(null);
  };

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 lg:h-24">
            
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center group" aria-label="Home">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-200">
                  <Image
                    src="/logos/Asoociattelogo.jpg"
                    alt="Associatte PropTech"
                    width={96}
                    height={96}
                    className="object-contain w-auto h-auto"
                    priority
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.parentElement?.querySelector('.logo-fallback');
                      if (fallback) {
                        (fallback as HTMLElement).style.display = 'flex';
                      }
                    }}
                  />
                  <Building2 
                    className="logo-fallback w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10" 
                    style={{ color: COLORS.green }}
                    aria-hidden="true"
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link: any) => {
                const isActive = isHrefActive(link.href);
                const hasDropdown = link.dropdown?.length > 0;
                const isDropdownOpen = desktopDropdown === link.name;
                
                if (hasDropdown) {
                  return (
                    <div 
                      key={link.name} 
                      className="relative"
                      onMouseEnter={() => handleDesktopDropdownEnter(link.name)}
                      onMouseLeave={handleDesktopDropdownLeave}
                    >
                      {/* Grouped Link and Toggle Button */}
                      <div className="flex items-center rounded-lg transition-colors hover:bg-gray-50">
                        <Link
                          href={link.href}
                          className={`flex items-center gap-1 px-3 py-2 font-medium transition-colors rounded-l-lg ${
                            isActive
                              ? 'text-[#F8C21C] bg-[#F8C21C]/10'
                              : 'text-gray-700 hover:text-[#005E60]'
                          }`}
                        >
                          {link.name}
                        </Link>
                        <button
                          onClick={() => setDesktopDropdown(isDropdownOpen ? null : link.name)}
                          className={`p-2 rounded-r-lg transition-colors ${
                            isActive
                              ? 'text-[#F8C21C] bg-[#F8C21C]/10'
                              : 'text-gray-700 hover:text-[#005E60]'
                          }`}
                          aria-label={`Toggle ${link.name} menu`}
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                      
                      {isDropdownOpen && (
                        <div 
                          className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                          onMouseEnter={() => handleDesktopDropdownEnter(link.name)}
                          onMouseLeave={handleDesktopDropdownLeave}
                        >
                          {link.dropdown.map((item: any) => {
                            const isSubActive = isHrefActive(item.href);

                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                                  isSubActive
                                    ? 'text-[#005E60] font-medium bg-[#005E60]/5'
                                    : 'text-gray-700 hover:text-[#005E60] hover:bg-gray-50'
                                }`}
                              >
                                {Icon && <Icon className="w-4 h-4 flex-shrink-0" style={{ color: item.color }} />}
                                <span className="flex-1">{item.label}</span>
                                {isSubActive && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }
                
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 font-medium transition-colors rounded-lg ${
                      isActive
                        ? 'text-[#F8C21C] bg-[#F8C21C]/10'
                        : 'text-gray-700 hover:text-[#005E60] hover:bg-gray-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Phone Button - Desktop */}
            <div className="hidden lg:flex items-center">
              <a 
                href="tel:+918881188181" 
                className="px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium text-sm shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105"
                style={{ backgroundColor: COLORS.red, color: 'white' }}
              >
                <Phone className="w-4 h-4" />
                <span>+91 8881188181</span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button 
                id="mobile-menu-button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="text-gray-700 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 transition-opacity duration-300"
            onClick={closeMobileMenu}
          />
          
          {/* Menu Panel */}
          <div 
            id="mobile-nav"
            className="fixed top-20 left-0 right-0 bottom-0 bg-white shadow-xl overflow-y-auto animate-in slide-in-from-top-2 duration-300"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link: any) => {
                const isActive = isHrefActive(link.href);
                const hasDropdown = link.dropdown?.length > 0;
                const isMobileDropdownOpen = openMobileDropdown === link.name;
                
                return (
                  <div key={link.name} className="border-b border-gray-100 last:border-0">
                    {hasDropdown ? (
                      <>
                        {/* Separated Link and Toggle Button for Mobile */}
                        <div className="flex items-center justify-between w-full">
                          <Link
                            href={link.href}
                            onClick={closeMobileMenu}
                            className={`flex-1 px-4 py-4 rounded-lg text-left transition-colors text-base font-medium ${
                              isActive 
                                ? 'text-[#F8C21C] bg-[#F8C21C]/10' 
                                : 'text-gray-700 hover:text-[#005E60] hover:bg-gray-50'
                            }`}
                          >
                            {link.name}
                          </Link>
                          <button 
                            onClick={() => toggleMobileDropdown(link.name)}
                            className="p-4 text-gray-500 hover:text-[#005E60] transition-colors"
                            aria-label={`Toggle ${link.name} submenu`}
                          >
                            <ChevronDown className={`w-5 h-5 transition-all duration-300 ${isMobileDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                        
                        {isMobileDropdownOpen && (
                          <div className="ml-4 mb-2 pl-4 border-l-2 border-[#F8C21C]/30 space-y-1 animate-in slide-in-from-left-2 duration-200">
                            {link.dropdown.map((item: any) => {
                              const isSubActive = isHrefActive(item.href);

                              const Icon = item.icon;
                              return (
                                <Link 
                                  key={item.href} 
                                  href={item.href} 
                                  onClick={closeMobileMenu}
                                  className={`flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors ${
                                    isSubActive 
                                      ? 'text-[#005E60] font-medium bg-[#005E60]/5' 
                                      : 'text-gray-600 hover:text-[#005E60] hover:bg-gray-50'
                                  }`}
                                >
                                  {Icon && <Icon className="w-4 h-4 flex-shrink-0" style={{ color: item.color }} />}
                                  <span className="flex-1">{item.label}</span>
                                  {isSubActive && <span className="w-1.5 h-1.5 rounded-full ml-auto" style={{ backgroundColor: item.color }} />}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link 
                        href={link.href} 
                        onClick={closeMobileMenu}
                        className={`block px-4 py-4 rounded-lg text-base font-medium transition-colors ${
                          isActive 
                            ? 'text-[#F8C21C] bg-[#F8C21C]/10' 
                            : 'text-gray-700 hover:text-[#005E60] hover:bg-gray-50'
                        }`}
                      >
                        {link.name}
                      </Link>
                    )}
                  </div>
                );
              })}
              
              {/* Mobile Phone Button */}
              <div className="pt-4 mt-4">
                <a 
                  href="tel:+918881188181" 
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-medium transition-all duration-300 shadow-md"
                  style={{ backgroundColor: COLORS.red, color: 'white' }}
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Us: +91 8881188181</span>
                </a>
              </div>
              
              {/* Mobile Footer Text */}
              <div className="pt-6 pb-8 text-center">
                <p className="text-xs text-gray-400">
                  Associatte PropTech Pvt Ltd<br />
                  Your Trusted Real Estate Partner
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ✅ STEP 2: New default export wraps HeaderContent in Suspense
export default function Header() {
  return (
    <Suspense fallback={null}>
      <HeaderContent />
    </Suspense>
  );
}