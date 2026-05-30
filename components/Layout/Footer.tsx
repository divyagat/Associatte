"use client";

import Link from "next/link";
import Image from "next/image";
import { Building2, Phone, Mail, MapPin, Clock, ExternalLink, ChevronRight, Shield } from "lucide-react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialIcons = [
    { icon: FaFacebookF, href: "https://www.facebook.com/AssociatteIndia/", label: "Facebook" },
    { icon: FaTwitter, href: "https://twitter.com/Associatte", label: "Twitter" },
    { icon: FaInstagram, href: "https://www.instagram.com/vikramm.associatte?igsh=MXM5aXhmNmZsYThicg==", label: "Instagram" },
    { icon: FaLinkedinIn, href: "https://www.linkedin.com/company/associatte-proptech", label: "LinkedIn" },
  ];

  const activeLocations = [
    { name: "Pune", slug: "pune" },
    { name: "Mumbai", slug: "mumbai" },
    { name: "KDMC", slug: "kdmc" },
  ];

  // Working Google Maps link for the office address
const officeAddress = "Associatte PropTech Pvt Ltd 303 Naren Pearl Magarpatta Road Hadapsar Pune";
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(officeAddress)}`;

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        
        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          
          {/* BRAND & ABOUT */}
          <div className="space-y-4">
            
            {/* Logo Link */}
            <Link href="/" className="inline-block mb-4 group" aria-label="Associatte PropTech Home">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
                <Image
                  src="/logos/associattewhitelogo.webp"
                  alt="Associatte PropTech"
                  width={96}
                  height={96}
                  className="object-contain drop-shadow-lg"
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
                  className="logo-fallback w-10 h-10 sm:w-12 sm:h-12 text-[#005E60] absolute hidden"
                  aria-hidden="true"
                />
              </div>
            </Link>

            {/* Company Description */}
            <p className="text-sm text-gray-400 leading-relaxed">
              Associatte PropTech Pvt Ltd is one of the leading Real Estate and Property Management Company in Pune established by Mr. Vikram Malik, who has an experience of more than 25 years in the Industry. Since then we have come a long way in the real estate business.
            </p>

            {/* RERA Badge */}
            <div className="inline-flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-lg">
              <Shield size={12} className="text-[#F8C21C]" />
              <span className="text-xs text-gray-400">RERA NO.</span>
              <span className="text-xs text-[#F8C21C] font-semibold">A52100029540</span>
            </div>

            {/* Social Icons */}
            <div className="flex gap-2.5 pt-1">
              {socialIcons.map((item, i) => {
                const Icon = item.icon;
                return (
                  <a
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-gray-800 hover:bg-[#005E60] rounded-lg flex items-center justify-center transition-all duration-200 text-gray-400 hover:text-white hover:scale-105 active:scale-95"
                    aria-label={item.label}
                  >
                    <Icon size={15} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-base flex items-center gap-2">
              <ChevronRight size={16} className="text-[#F8C21C]" />
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/properties?status=sale" className="hover:text-[#F8C21C] transition-colors inline-flex items-center gap-1 group">
                  Buy Property
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                </Link>
              </li>
              <li>
                <Link href="/properties?status=rent" className="hover:text-[#F8C21C] transition-colors inline-flex items-center gap-1 group">
                  Rent Property
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                </Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-[#F8C21C] transition-colors inline-flex items-center gap-1 group">
                  New Projects
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-[#F8C21C] transition-colors inline-flex items-center gap-1 group">
                  Contact Us
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                </Link>
              </li>
            </ul>
          </div>

          {/* TOP LOCATIONS */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-base flex items-center gap-2">
              <MapPin size={16} className="text-[#F8C21C]" />
              Top Locations
            </h3>
            <ul className="space-y-3 text-sm">
              {activeLocations.map((loc) => (
                <li key={loc.slug}>
                  <Link 
                    href={`/locations/${loc.slug}`} 
                    className="hover:text-[#F8C21C] transition-colors capitalize inline-flex items-center gap-1 group"
                  >
                    Properties in {loc.name}
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT & LEGAL */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-base flex items-center gap-2">
              <Phone size={16} className="text-[#F8C21C]" />
              Contact & Support
            </h3>
            <ul className="space-y-3 text-sm mb-5">
              <li className="flex gap-2.5 items-start group">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-[#F8C21C] transition-colors group-hover:text-[#F8C21C]/80" aria-hidden="true" />
                <a 
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#F8C21C] transition-colors inline-flex items-start gap-1 flex-wrap"
                >
                  <span>302 and 303, Naren Pearl, 3rd Floor, Magarpatta Road, Above Axis and IndusInd Bank, Hadapsar, Pune - 411028</span>
                  <ExternalLink size={12} className="inline-block ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li className="flex gap-2.5 items-center group">
                <Phone size={16} className="flex-shrink-0 text-[#F8C21C]" aria-hidden="true" />
                <a 
                  href="tel:+918881188181" 
                  className="hover:text-[#F8C21C] transition-colors inline-flex items-center gap-1"
                >
                  +91 8881188181
                </a>
              </li>
              <li className="flex gap-2.5 items-center group">
                <Mail size={16} className="flex-shrink-0 text-[#F8C21C]" aria-hidden="true" />
                <a 
                  href="mailto:info@associatte.com" 
                  className="hover:text-[#F8C21C] transition-colors inline-flex items-center gap-1"
                >
                  info@associatte.com
                </a>
              </li>
              <li className="flex gap-2.5 items-center">
                <Clock size={16} className="flex-shrink-0 text-[#F8C21C]" aria-hidden="true" />
                <span className="text-gray-400">Tue-Sun: 10AM - 7PM</span>
              </li>
            </ul>
            
            <h3 className="text-white font-semibold mb-3 text-base flex items-center gap-2">
              <Shield size={14} className="text-[#F8C21C]" />
              Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy-policy" className="hover:text-[#F8C21C] transition-colors inline-flex items-center gap-1 group">
                  Privacy Policy
                  <ChevronRight size={10} className="opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-[#F8C21C] transition-colors inline-flex items-center gap-1 group">
                  Cookie Policy
                  <ChevronRight size={10} className="opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="hover:text-[#F8C21C] transition-colors inline-flex items-center gap-1 group">
                  About Us
                  <ChevronRight size={10} className="opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="hover:text-[#F8C21C] transition-colors inline-flex items-center gap-1 group">
                  Terms and Conditions
                  <ChevronRight size={10} className="opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* DISCLAIMER & CONSENT SECTION */}
        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-800">
          <div className="bg-gray-800/40 rounded-xl p-4 sm:p-5 space-y-4 text-xs text-gray-400 leading-relaxed">
            <div>
              <h4 className="font-semibold text-gray-300 mb-1.5">Disclaimer:</h4>
              <p>
                Associatte PropTech Pvt Ltd is only an intermediary offering its platform to advertise properties of Seller for a Customer/Buyer/User coming on its Website and is not and cannot be a party to or privy to or control in any manner any transactions between the Seller and the Customer/Buyer/User. All the prices or rates on this Website have been extended by various Builder(s)/Developer(s) who have advertised their products. Company shall neither be responsible nor liable to mediate or resolve any disputes or disagreements between the Customer/Buyer/User and the Seller and both Seller and Customer/Buyer/User shall settle all such disputes without involving Company in any manner.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-300 mb-1.5">Consent to Communicate:</h4>
              <p>
                You consent to receive communications from us by way of SMS/email/phone calls and RCS with respect to your transactions on our Website. Users will be required to register their valid phone numbers and e-mail addresses to facilitate such communication. We may also use your e-mail address to send you updates, newsletters, changes to features of the Service, and the like to provide You better Services.
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>© {currentYear} Associatte PropTech Pvt Ltd. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Developed and powered by 
            <span className="text-[#F8C21C] font-medium hover:text-[#F8C21C]/80 transition-colors">Associatte PropTech</span>
          </p>
        </div>
      </div>
    </footer>
  );
}