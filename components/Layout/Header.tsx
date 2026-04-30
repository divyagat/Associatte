"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Building2, Phone } from "lucide-react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Buy", href: "/properties?status=sale" },
    { label: "Commercial", href: "/properties?type=commercial" },
    { label: "Projects", href: "/projects" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-lg bg-white/90 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* 🏢 Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#005E60] to-[#008B8B] rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Prop<span className="text-[#005E60]">Finder</span>
            </span>
          </Link>

          {/* 🧭 Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#005E60] hover:bg-[#e6f1f1] rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* 📞 Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a 
              href="tel:+918743563546"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#005E60] transition-colors"
            >
              <Phone size={16} className="text-[#005E60]" />
              <span className="font-medium">+91 87435 63546</span>
            </a>
            
            <Link
              href="/contact"
              className="bg-gradient-to-r from-[#005E60] to-[#008B8B] hover:from-[#004a4c] hover:to-[#007a7c] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md"
            >
              Post Property
            </Link>
          </div>

          {/* 📱 Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* 📱 Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-3 px-2 text-gray-700 hover:text-[#005E60] hover:bg-[#e6f1f1] rounded-lg font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile Contact */}
            <div className="pt-4 mt-4 border-t border-gray-100">
              <a 
                href="tel:+918743563546"
                className="flex items-center gap-3 py-3 px-2 text-gray-700 hover:text-[#005E60]"
                onClick={() => setMobileOpen(false)}
              >
                <Phone size={18} className="text-[#005E60]" />
                <span className="font-medium">+91 87435 63546</span>
              </a>
              
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="block w-full mt-3 text-center py-3 bg-[#005E60] hover:bg-[#004a4c] text-white rounded-xl font-semibold transition-colors"
              >
                Post Property
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}