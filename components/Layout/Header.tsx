'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Building2, Phone, Menu, X, ChevronDown, 
  Home, Building, Construction, KeyRound, Tag, MapPin,
  Handshake, FileText, Scale, ClipboardList, TrendingUp 
} from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [buildersDropdownOpen, setBuildersDropdownOpen] = useState(false);
  const [propertiesDropdownOpen, setPropertiesDropdownOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
    { 
      name: 'Properties', 
      href: '/properties',
      dropdown: [
        { label: 'Residential', href: '/properties?type=residential', icon: Home, color: '#005E60' },
        { label: 'Commercial', href: '/properties?type=commercial', icon: Building, color: '#8B0000' },
        { label: 'Pre-Launch', href: '/properties?type=pre-launch', icon: Construction, color: '#F8C21C' },
        { label: 'Ready', href: '/properties?type=ready', icon: KeyRound, color: '#005E60' },
        { label: 'Rent', href: '/properties?type=rent', icon: Tag, color: '#8B0000' },
        { label: 'Plots', href: '/properties?type=plots', icon: MapPin, color: '#F8C21C' },
      ]
    },
    { name: 'About Us', href: '/about-us' },
    { 
      name: 'Services', 
      href: '/services',
      dropdown: [
        { label: 'Property Consultation', href: '/services#consultation', icon: Handshake, color: '#005E60' },
        { label: 'Home Loans', href: '/services#home-loans', icon: FileText, color: '#F8C21C' },
        { label: 'Legal Assistance', href: '/services#legal', icon: Scale, color: '#8B0000' },
        { label: 'Property Management', href: '/services#management', icon: ClipboardList, color: '#F8C21C' },
        { label: 'Investment Advisory', href: '/services#investment', icon: TrendingUp, color: '#8B0000' },
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

  const handleNavMouseLeave = (dropdown: 'builders' | 'properties' | 'services') => {
    setTimeout(() => {
      if (dropdown === 'builders') setBuildersDropdownOpen(false);
      if (dropdown === 'properties') setPropertiesDropdownOpen(false);
      if (dropdown === 'services') setServicesDropdownOpen(false);
    }, 150);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      {/* ✅ Taller header on desktop to accommodate bigger logo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 lg:h-24">
          
          {/* ✅ BIG & RESPONSIVE LOGO - YOUR IMAGE ONLY */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group" aria-label="Home">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-200">
                
                {/* 🔁 REPLACE THIS WITH YOUR ACTUAL LOGO PATH */}
             <Image
  src="/logos/Asoociattelogo.jpg"
  alt="Associatte PropTech"
  width={96}
  height={96}
  className="object-contain w-auto h-auto"  // ✅ Added w-auto h-auto
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
                
                {/* Fallback Icon (scales with logo) */}
                <Building2 
                  className="logo-fallback w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-[#005E60] absolute hidden"
                  aria-hidden="true"
                />
                
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link: any) => {
              const isActive = pathname === link.href || pathname?.startsWith(link.href + '?') || pathname?.startsWith(link.href + '/');
              const hasDropdown = link.dropdown?.length > 0;
              
              const isPropertiesDropdown = link.name === 'Properties';
              const isBuildersDropdown = link.name === 'Know Your Developer';
              const isServicesDropdown = link.name === 'Services';
              
              const dropdownOpen = isPropertiesDropdown 
                ? propertiesDropdownOpen 
                : isBuildersDropdown 
                  ? buildersDropdownOpen 
                  : isServicesDropdown 
                    ? servicesDropdownOpen 
                    : false;
                    
              const setDropdownOpen = isPropertiesDropdown 
                ? setPropertiesDropdownOpen 
                : isBuildersDropdown 
                  ? setBuildersDropdownOpen 
                  : isServicesDropdown 
                    ? setServicesDropdownOpen 
                    : () => {};
              
              return (
                <div 
                  key={link.name} 
                  className="relative"
                  onMouseEnter={() => hasDropdown && setDropdownOpen(true)}
                  onMouseLeave={() => hasDropdown && handleNavMouseLeave(
                    isPropertiesDropdown ? 'properties' : isBuildersDropdown ? 'builders' : 'services'
                  )}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1 px-3 py-2 font-medium transition-colors rounded-lg ${
                      isActive
                        ? 'text-[#F8C21C] bg-[#F8C21C]/10'
                        : 'text-gray-700 hover:text-[#005E60] hover:bg-gray-50'
                    }`}
                  >
                    {link.name}
                    {hasDropdown && (
                      <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                    )}
                  </Link>
                  
                  {hasDropdown && dropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      {link.dropdown.map((item: any) => {
                        const isSubActive = pathname === item.href || pathname?.includes(item.href.split('#')[1] || item.href.split('=')[1]);
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setDropdownOpen(false)}
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
            })}
          </div>

          {/* Phone Button */}
          <div className="hidden lg:flex items-center">
            <a href="tel:+918881188181" className="bg-[#8B0000] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#6a0000] transition-colors font-medium text-sm shadow-sm">
              <Phone className="w-4 h-4" />
              <span>+91 8881188181</span>
            </a>
          </div>

          {/* Mobile/Tablet menu button */}
          <div className="lg:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-700 hover:text-gray-900 p-2" aria-label="Toggle menu">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link: any) => {
              const isActive = pathname === link.href || pathname?.startsWith(link.href + '?') || pathname?.startsWith(link.href + '/');
              const hasDropdown = link.dropdown?.length > 0;
              const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
              
              return (
                <div key={link.name}>
                  <Link href={link.href} onClick={() => { if (!hasDropdown) setMobileMenuOpen(false); }}
                    className={`flex items-center justify-between px-3 py-3 rounded-lg ${isActive ? 'text-[#F8C21C] font-medium bg-[#F8C21C]/10' : 'text-gray-700 hover:text-[#005E60] hover:bg-gray-50'}`}>
                    <span>{link.name}</span>
                    {hasDropdown && (
                      <button type="button" onClick={(e) => { e.preventDefault(); setMobileDropdownOpen(!mobileDropdownOpen); }} className="p-1">
                        <ChevronDown className={`w-4 h-4 transition-transform ${mobileDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </Link>
                  
                  {hasDropdown && mobileDropdownOpen && (
                    <div className="ml-4 mt-1 pl-3 border-l-2 border-gray-100 space-y-1">
                      {link.dropdown.map((item: any) => {
                        const isSubActive = pathname === item.href || pathname?.includes(item.href.split('#')[1] || item.href.split('=')[1]);
                        const Icon = item.icon;
                        return (
                          <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md ${isSubActive ? 'text-[#005E60] font-medium bg-[#005E60]/5' : 'text-gray-600 hover:text-[#005E60] hover:bg-gray-50'}`}>
                            {Icon && <Icon className="w-4 h-4 flex-shrink-0" style={{ color: item.color }} />}
                            <span>{item.label}</span>
                            {isSubActive && <span className="w-1.5 h-1.5 rounded-full ml-auto" style={{ backgroundColor: item.color }} />}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
            <div className="pt-3 mt-3 border-t border-gray-100">
              <a href="tel:+918881188181" className="flex items-center justify-center gap-2 w-full py-3 bg-[#8B0000] text-white rounded-lg font-medium hover:bg-[#6a0000] transition-colors">
                <Phone className="w-4 h-4" />
                <span>+91 8881188181</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}