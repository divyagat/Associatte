"use client";

import Link from "next/link";
import { Building2, Phone, Mail, MapPin } from "lucide-react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer(): JSX.Element {
  const currentYear = new Date().getFullYear();

  const socialIcons = [
    { icon: FaFacebookF, href: "#" },
    { icon: FaTwitter, href: "#" },
    { icon: FaInstagram, href: "#" },
    { icon: FaLinkedinIn, href: "#" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* BRAND */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">
                Prop<span className="text-primary-400">Finder</span>
              </span>
            </Link>

            <p className="text-sm text-gray-400 mb-5">
              India’s trusted real estate portal. Find your dream home across 50+ cities.
            </p>

            <div className="flex gap-3">
              {socialIcons.map((item, i) => {
                const Icon = item.icon;
                return (
                  <a
                    key={i}
                    href={item.href}
                    className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-white font-semibold mb-5">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/properties?status=sale">Buy Property</Link></li>
              <li><Link href="/properties?status=rent">Rent Property</Link></li>
              <li><Link href="/properties">New Projects</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* TOP CITIES */}
          <div>
            <h3 className="text-white font-semibold mb-5">Top Cities</h3>
            <ul className="space-y-3">
              <li><Link href="/city/pune">Properties in Pune</Link></li>
              <li><Link href="/city/mumbai">Properties in Mumbai</Link></li>
              <li><Link href="/city/bangalore">Properties in Bangalore</Link></li>
              <li><Link href="/city/hyderabad">Properties in Hyderabad</Link></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-white font-semibold mb-5">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-2"><MapPin size={16}/> Pune, India</li>
              <li className="flex gap-2"><Phone size={16}/> +91 80080 01234</li>
              <li className="flex gap-2"><Mail size={16}/> hello@propfinder.in</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
          © {currentYear} PropFinder. All rights reserved.
        </div>
      </div>
    </footer>
  );
}