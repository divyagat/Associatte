"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, LogOut, Menu, X, Building2 } from "lucide-react";

export default function Header() {
  const router = useRouter();

  // TEMP FAKE USER (until we build auth)
  const user = null;

  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Buy", href: "/properties?status=sale" },
    { label: "Rent", href: "/properties?status=rent" },
    { label: "Commercial", href: "/properties?type=commercial" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-lg bg-white/80 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#005E60] rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Prop<span className="text-[#005E60]">Finder</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#005E60] hover:bg-[#e6f1f1] rounded-lg transition"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-[#8B0000] hover:bg-[#fff0f0] rounded-lg">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Sign In
                </Link>

                <Link
                  href="/register"
                  className="bg-[#005E60] hover:bg-[#004a4c] text-white px-5 py-2 rounded-lg text-sm font-semibold transition"
                >
                  Post Property
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t px-6 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-gray-700 hover:text-[#005E60]"
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 border-t flex gap-2">
            <Link
              href="/login"
              className="flex-1 text-center py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="flex-1 text-center py-2 bg-[#005E60] hover:bg-[#004a4c] text-white rounded-lg font-medium"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}