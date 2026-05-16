"use client";

import Link from "next/link";
import { Building2, Phone, Mail, MapPin, ChevronUp, ArrowRight } from "lucide-react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const socialIcons = [
    { icon: FaFacebookF, href: "https://www.facebook.com/AssociatteIndia/", label: "Facebook", color: "#1877F2" },
    { icon: FaTwitter, href: "https://twitter.com/Associatte", label: "Twitter", color: "#1DA1F2" },
    { icon: FaInstagram, href: "https://instagram.com/vikramm.associatte?igsh=MXM5aXhmNmZsYThicg==", label: "Instagram", color: "#E4405F" },
    { icon: FaLinkedinIn, href: "https://www.linkedin.com/company/associatteindia/posts/?feedView=all", label: "LinkedIn", color: "#0A66C2" },
  ];

  const quickLinks = [
    { label: "Buy Property", href: "/properties?status=sale" },
    { label: "Rent Property", href: "/properties?status=rent" },
    { label: "New Projects", href: "/properties" },
    { label: "Contact Us", href: "/contact" },
  ];

  const topLocations = [
    { label: "Properties in Pune", href: "/locations/pune" },
    { label: "Properties in Mumbai", href: "/locations/mumbai" },
    { label: "Properties in KDMC", href: "/locations/kdmc" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "About Us", href: "/about-us" },
    { label: "Terms and Conditions", href: "/terms-conditions" },
    { label: "Cookie Policy", href: "/cookie-policy" },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-slate-900 via-[#0d1117] to-black text-gray-300 mt-20 overflow-hidden">
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(248,194,28,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Glow Effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#005E60]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-[#F8C21C]/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">

        {/* BRAND HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pb-8 border-b border-gray-800/60 mb-10">
          <Link href="/" className="flex items-center gap-3 group mb-6 lg:mb-0">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-[#005E60] to-[#007a7d] rounded-xl flex items-center justify-center shadow-lg shadow-[#005E60]/30 group-hover:shadow-[#005E60]/50 transition-all duration-300 group-hover:scale-105">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#F8C21C] rounded-full border-2 border-[#0d1117]"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white tracking-tight">
                Associatte<span className="text-[#F8C21C]">.</span>
              </span>
              <span className="text-xs text-gray-500 font-medium">PropTech Pvt Ltd</span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full border border-gray-700/50">
              <span className="text-xs text-gray-400">RERA:</span>
              <span className="text-sm font-bold text-[#F8C21C]">A52100029540</span>
            </div>
            <div className="flex gap-2">
              {socialIcons.map((item, i) => {
                const Icon = item.icon;
                return (
                  <a
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative w-10 h-10 bg-gray-800/60 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                    style={{ '--hover-color': item.color } as React.CSSProperties}
                    aria-label={item.label}
                  >
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                         style={{ backgroundColor: 'var(--hover-color)' }}></div>
                    <Icon size={16} className="relative z-10 text-gray-400 group-hover:text-white transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">

          {/* ABOUT */}
          <div className="lg:col-span-1">
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#F8C21C] rounded-full"></span>
              About Us
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Associatte PropTech Pvt Ltd is one of the leading Real Estate and Property Management Company in Pune established by Mr. Vikram Malik, who has an experience of more than 20 years in the Industry. Since then we have come a long way in the real estate business.
            </p>
            <Link href="/about-us" className="inline-flex items-center gap-1.5 text-sm text-[#F8C21C] hover:text-[#ffc947] transition-colors group">
              Learn more about us
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#005E60] rounded-full"></span>
              Quick Links
            </h4>
            <ul className="space-y-1">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <Link 
                    href={link.href} 
                    className="group flex items-center justify-between py-2.5 px-3 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-200"
                  >
                    {link.label}
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200 text-[#F8C21C]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* LOCATIONS */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#005E60] rounded-full"></span>
              Top Locations
            </h4>
            <ul className="space-y-1">
              {topLocations.map((loc, i) => (
                <li key={i}>
                  <Link 
                    href={loc.href} 
                    className="group flex items-center justify-between py-2.5 px-3 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-200"
                  >
                    <span className="flex items-center gap-2">
                      <MapPin size={14} className="text-gray-600 group-hover:text-[#F8C21C] transition-colors" />
                      {loc.label}
                    </span>
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200 text-[#F8C21C]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#005E60] rounded-full"></span>
              Get in Touch
            </h4>
            <div className="space-y-4">
              <a href="tel:+918881188181" className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/30 hover:bg-gray-800/60 border border-gray-700/30 hover:border-[#005E60]/50 transition-all duration-200 group">
                <div className="w-9 h-9 rounded-lg bg-[#005E60]/20 flex items-center justify-center group-hover:bg-[#005E60] transition-colors">
                  <Phone size={16} className="text-[#F8C21C] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Call Us</p>
                  <p className="text-sm font-medium text-white group-hover:text-[#F8C21C] transition-colors">+91 88 8118 8181</p>
                </div>
              </a>
              
              <a href="mailto:info@associatte.co.in" className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/30 hover:bg-gray-800/60 border border-gray-700/30 hover:border-[#005E60]/50 transition-all duration-200 group">
                <div className="w-9 h-9 rounded-lg bg-[#005E60]/20 flex items-center justify-center group-hover:bg-[#005E60] transition-colors">
                  <Mail size={16} className="text-[#F8C21C] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email Us</p>
                  <p className="text-sm font-medium text-white group-hover:text-[#F8C21C] transition-colors">info@associatte.co.in</p>
                </div>
              </a>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-800/30 border border-gray-700/30">
                <div className="w-9 h-9 rounded-lg bg-[#005E60]/20 flex items-center justify-center flex-shrink-0">
                  <MapPin size={16} className="text-[#F8C21C]" />
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  302 and 303, Naren Pearl, 3rd Floor, Magarpatta Road, Above Axis and IndusInd Bank, Hadapsar, Pune - 411028
                </p>
              </div>
            </div>

            {/* Legal Links */}
            <div className="mt-6 pt-4 border-t border-gray-800">
              <div className="flex flex-wrap gap-2">
                {legalLinks.map((link, i) => (
                  <Link 
                    key={i}
                    href={link.href} 
                    className="text-xs text-gray-500 hover:text-[#F8C21C] transition-colors px-2 py-1 rounded hover:bg-gray-800/50"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* DISCLAIMER SECTION */}
        <div className="mt-14 pt-8 border-t border-gray-800/60">
          <div className="bg-gradient-to-r from-gray-800/20 to-gray-900/20 rounded-2xl p-5 border border-gray-700/30">
            <div className="grid md:grid-cols-2 gap-6 text-xs leading-relaxed">
              <div className="space-y-2">
                <h5 className="font-semibold text-gray-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F8C21C] animate-pulse"></span>
                  Disclaimer
                </h5>
                <p className="text-gray-400 pl-4 border-l-2 border-gray-700/40">
                  Associatte PropTech Private Limited is only an intermediary offering its platform to advertise properties of Seller for a Customer/Buyer/User coming on its Website and is not and cannot be a party to or privy to or control in any manner any transactions between the Seller and the Customer/Buyer/User. All the prices or rates on this Website have been extended by various Builder(s)/Developer(s) who have advertised their products. Company shall neither be responsible nor liable to mediate or resolve any disputes or disagreements between the Customer/Buyer/User and the Seller and both Seller and Customer/Buyer/User shall settle all such disputes without involving Company in any manner.
                </p>
              </div>
              <div className="space-y-2">
                <h5 className="font-semibold text-gray-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#005E60] animate-pulse"></span>
                  Consent to Communicate
                </h5>
                <p className="text-gray-400 pl-4 border-l-2 border-gray-700/40">
                  You consent to receive communications from us by way of SMS/email/phone calls and RCS with respect to your transactions on our Website. Users will be required to register their valid phone numbers and e-mail addresses to facilitate such communication. We may also use your e-mail address to send you updates, newsletters, changes to features of the Service, and the like to provide You better Services.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-10 pt-6 border-t border-gray-800/60">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F8C21C]"></span>
              © {currentYear} Associatte PropTech Pvt Ltd. All rights reserved.
            </p>
            <p className="flex items-center gap-1.5">
              Developed & powered by 
              <span className="text-white font-medium">Associatte PropTech</span>
              <Building2 size={12} className="text-[#005E60]" />
            </p>
          </div>
        </div>

      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 w-11 h-11 bg-gradient-to-br from-[#005E60] to-[#007a7d] text-white rounded-full shadow-xl shadow-[#005E60]/25 flex items-center justify-center transition-all duration-300 hover:shadow-[#005E60]/40 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#F8C21C]/50 z-50 ${
          showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
        }`}
        aria-label="Back to top"
      >
        <ChevronUp size={18} className="transition-transform duration-200 hover:-translate-y-0.5" />
      </button>

      {/* Decorative Corner Accent */}
      <div className="absolute bottom-0 left-0 w-32 h-32 pointer-events-none">
        <div className="absolute bottom-4 left-4 w-20 h-0.5 bg-gradient-to-r from-[#F8C21C]/50 to-transparent"></div>
        <div className="absolute bottom-4 left-4 w-0.5 h-20 bg-gradient-to-t from-[#F8C21C]/50 to-transparent"></div>
      </div>
    </footer>
  );
}