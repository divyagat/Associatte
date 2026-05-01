// @/components/sections/NavigationSection.tsx
'use client';

import { useState } from 'react';
import { Building2, Phone, Menu, X } from 'lucide-react';

export default function NavigationSection() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#', active: true },
    { name: 'About Us', href: '#' },
    { name: 'Projects', href: '#' },
    { name: 'Services', href: '#' },
    { name: 'Builders', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Contact Us', href: '#' },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-yellow-500 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">ASSOCIATTE</h1>
                  <p className="text-xs text-gray-600">PROP TECH PVT LTD</p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`font-medium transition-colors ${
                  link.active
                    ? 'text-yellow-600 border-b-2 border-yellow-600 pb-1'
                    : 'text-gray-700 hover:text-yellow-600'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Phone Button */}
          <div className="hidden md:flex items-center">
            <a
              href="tel:+918668695995"
              className="bg-red-800 text-white px-6 py-2.5 rounded-md flex items-center gap-2 hover:bg-red-900 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>+91 866 869 5995</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-gray-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`block px-3 py-2 ${
                  link.active ? 'text-yellow-600 font-medium' : 'text-gray-700 hover:text-yellow-600'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}