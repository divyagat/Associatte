"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, ChevronRight, Shield, ChevronDown } from "lucide-react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { useState } from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const socialIcons = [
    { icon: FaFacebookF, href: "https://www.facebook.com/AssociatteIndia/", label: "Facebook" },
    { icon: FaTwitter, href: "https://twitter.com/Associatte", label: "Twitter" },
    { icon: FaInstagram, href: "https://www.instagram.com/vikramm.associatte?igsh=MXM5aXhmNmZsYThicg==", label: "Instagram" },
    { icon: FaLinkedinIn, href: "https://www.linkedin.com/company/associatte-proptech", label: "LinkedIn" },
  ];

  const quickLinks = [
    { name: "Buy Property", href: "/properties?status=sale" },
    { name: "Rent Property", href: "/properties?status=rent" },
    { name: "New Projects", href: "/properties" },
    { name: "Contact Us", href: "/contact-us" },
  ];

  const activeLocations = [
    { name: "Pune", slug: "pune" },
    { name: "Mumbai", slug: "mumbai" },
    { name: "KDMC", slug: "kdmc" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Cookie Policy", href: "/cookie-policy" },
    { name: "About Us", href: "/about-us" },
    { name: "Terms and Conditions", href: "/terms-conditions" },
  ];

  const officeAddress = "Associatte PropTech Pvt Ltd 303 Naren Pearl Magarpatta Road Hadapsar Pune";
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(officeAddress)}`;

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  // Extracted disclaimer content
  const disclaimerContent = (
    <div className="bg-white/5 rounded-xl p-4 space-y-4">
      <div>
        <h4 className="font-semibold text-gray-300 text-sm mb-2">Disclaimer:</h4>
        <p className="text-xs text-gray-500 leading-relaxed">
          Associatte PropTech Pvt Ltd is only an intermediary offering its platform to advertise properties of Seller for a Customer/Buyer/User coming on its Website and is not and cannot be a party to or privy to or control in any manner any transactions between the Seller and the Customer/Buyer/User. All the prices or rates on this Website have been extended by various Builder(s)/Developer(s) who have advertised their products. Company shall neither be responsible nor liable to mediate or resolve any disputes or disagreements between the Customer/Buyer/User and the Seller and both Seller and Customer/Buyer/User shall settle all such disputes without involving Company in any manner.
        </p>
      </div>
      <div>
        <h4 className="font-semibold text-gray-300 text-sm mb-2">Consent to Communicate:</h4>
        <p className="text-xs text-gray-500 leading-relaxed">
          You consent to receive communications from us by way of SMS/email/phone calls and RCS with respect to your transactions on our Website. Users will be required to register their valid phone numbers and e-mail addresses to facilitate such communication. We may also use your e-mail address to send you updates, newsletters, changes to features of the Service, and the like to provide You better Services.
        </p>
      </div>
    </div>
  );

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-gray-300">
      {/* Top Border */}
      <div className="h-1 bg-gradient-to-r from-[#F8C21C] via-[#005E60] to-[#F8C21C]" />

      {/* Reduced overall vertical padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">

        {/* Mobile Layout (Visible only on mobile) */}
        <div className="md:hidden space-y-4">
          {/* Brand Section - Always visible */}
          <div className="text-center pb-6 border-b border-gray-800">
            <Link href="/" className="inline-block mb-4">
              <div className="w-20 h-20 bg-white/5 rounded-xl p-2 flex items-center justify-center mx-auto">
                <Image
                  src="/logos/associattewhitelogo.webp"
                  alt="Associatte PropTech"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto">
              Associatte PropTech Pvt Ltd is one of the leading Real Estate and Property Management Company in Pune established by Mr. Vikram Malik, who has an experience of more than 25 years in the Industry.
            </p>
            <div className="flex items-center justify-center gap-2 bg-white/5 px-3 py-2 rounded-lg w-fit mx-auto mt-4">
              <Shield size={14} className="text-[#F8C21C]" />
              <span className="text-xs text-gray-400">RERA:</span>
              <span className="text-xs text-[#F8C21C] font-mono">A52100029540</span>
            </div>
            <div className="flex gap-2 justify-center mt-4">
              {socialIcons.map((item, i) => {
                const Icon = item.icon;
                return (
                  <a
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-white/5 hover:bg-[#F8C21C] rounded-lg flex items-center justify-center transition-all hover:text-gray-900 text-gray-400"
                  >
                    <Icon size={15} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links Accordion */}
          <div className="border-b border-gray-800">
            <button
              onClick={() => toggleSection('quick')}
              className="w-full flex justify-between items-center py-4 text-white font-semibold"
            >
              Quick Links
              <ChevronDown size={18} className={`transition-transform ${openSection === 'quick' ? 'rotate-180' : ''}`} />
            </button>
            {openSection === 'quick' && (
              <ul className="pb-4 space-y-3">
                {quickLinks.map((link, idx) => (
                  <li key={idx}>
                    <Link href={link.href} className="text-gray-400 hover:text-[#F8C21C] transition-colors text-sm flex items-center gap-2">
                      <ChevronRight size={12} className="text-[#F8C21C]" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Locations Accordion */}
          <div className="border-b border-gray-800">
            <button
              onClick={() => toggleSection('locations')}
              className="w-full flex justify-between items-center py-4 text-white font-semibold"
            >
              Top Locations
              <ChevronDown size={18} className={`transition-transform ${openSection === 'locations' ? 'rotate-180' : ''}`} />
            </button>
            {openSection === 'locations' && (
              <ul className="pb-4 space-y-3">
                {activeLocations.map((loc) => (
                  <li key={loc.slug}>
                    <Link href={`/locations/${loc.slug}`} className="text-gray-400 hover:text-[#F8C21C] transition-colors text-sm flex items-center gap-2 capitalize">
                      <MapPin size={12} className="text-[#F8C21C]" />
                      Properties in {loc.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Contact Accordion */}
          <div className="border-b border-gray-800">
            <button
              onClick={() => toggleSection('contact')}
              className="w-full flex justify-between items-center py-4 text-white font-semibold"
            >
              Get in Touch
              <ChevronDown size={18} className={`transition-transform ${openSection === 'contact' ? 'rotate-180' : ''}`} />
            </button>
            {openSection === 'contact' && (
              <ul className="pb-4 space-y-4">
                <li className="flex gap-3">
                  <MapPin size={16} className="text-[#F8C21C] mt-0.5 flex-shrink-0" />
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm leading-relaxed">
                    302 & 303, Naren Pearl, Magarpatta Road, Hadapsar, Pune - 411028
                  </a>
                </li>
                <li className="flex gap-3">
                  <Phone size={16} className="text-[#F8C21C] flex-shrink-0" />
                  <a href="tel:+918881188181" className="text-gray-400 text-sm">+91 8881188181</a>
                </li>
                <li className="flex gap-3">
                  <Mail size={16} className="text-[#F8C21C] flex-shrink-0" />
                  <a href="mailto:info@associatte.com" className="text-gray-400 text-sm break-all">info@associatte.com</a>
                </li>
                <li className="flex gap-3">
                  <Clock size={16} className="text-[#F8C21C] flex-shrink-0" />
                  <span className="text-gray-400 text-sm">Tue-Sun: 10AM - 7PM</span>
                </li>
              </ul>
            )}
          </div>

          {/* Facebook Posts - Mobile */}
          <div className="border-b border-gray-800 pb-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2 pt-4">
              <FaFacebookF className="text-[#1877F2]" size={18} />
              Follow Us on Facebook
            </h3>
            <div className="bg-white rounded-xl overflow-hidden shadow-lg w-full">
              <iframe
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FAssociatteIndia%2F&tabs=timeline&width=400&height=350&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false"
                width="100%"
                height="350"
                style={{ border: "none", overflow: "hidden" }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title="Facebook Page"
              ></iframe>
            </div>
          </div>

          {/* Disclaimer Section - Mobile */}
          <div>
            {disclaimerContent}
          </div>
        </div>


        {/* Reduced gap from gap-8 lg:gap-12 to gap-6 lg:gap-8 */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Column 1 - Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <div className="w-20 h-20 bg-white/5 rounded-xl p-2 flex items-center justify-center hover:bg-white/10 transition-all">
                <Image
                  src="/logos/associattewhitelogo.webp"
                  alt="Associatte PropTech"
                  width={80}
                  height={80}
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed">
              Associatte PropTech Pvt Ltd is one of the leading Real Estate and Property Management Company in Pune established by Mr. Vikram Malik, who has an experience of more than 25 years in the Industry.
            </p>

            <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg w-fit">
              <Shield size={14} className="text-[#F8C21C]" />
              <span className="text-xs text-gray-400">RERA:</span>
              <span className="text-xs text-[#F8C21C] font-mono">A52100029540</span>
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
                    className="w-9 h-9 bg-white/5 hover:bg-[#F8C21C] rounded-lg flex items-center justify-center transition-all hover:text-gray-900 text-gray-400 hover:scale-105"
                  >
                    <Icon size={15} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2 - Quick Links & Locations */}
          <div className="space-y-6 ml-17">
            <div>
              <h3 className="text-white font-semibold mb-3 text-base ml-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {quickLinks.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-[#F8C21C] transition-colors text-sm flex items-center gap-2 group"
                    >
                      <ChevronRight size={12} className="text-[#F8C21C] opacity-0 group-hover:opacity-100 transition-all" />
                      <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              {/* <h3 className="text-white font-semibold mb-3 text-base">Top Locations</h3> */}
              <h3 className="text-white font-semibold mb-3 text-base ml-4">Top Locations</h3>
              <ul className="space-y-2">
                {activeLocations.map((loc) => (
                  <li key={loc.slug}>
                    <Link
                      href={`/locations/${loc.slug}`}
                      className="text-gray-400 hover:text-[#F8C21C] transition-colors text-sm flex items-center gap-2 group"
                    >
                      <MapPin size={12} className="text-[#F8C21C] opacity-0 group-hover:opacity-100 transition-all" />
                      <span className="group-hover:translate-x-1 transition-transform capitalize">Properties in {loc.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3 - Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-base">Get in Touch</h3>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <MapPin size={16} className="text-[#F8C21C] mt-0.5 flex-shrink-0" />
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#F8C21C] transition-colors text-sm leading-relaxed">
                  302 & 303, Naren Pearl, Magarpatta Road, Hadapsar, Pune - 411028
                </a>
              </li>
              <li className="flex gap-3">
                <Phone size={16} className="text-[#F8C21C] flex-shrink-0" />
                <a href="tel:+918881188181" className="text-gray-400 hover:text-[#F8C21C] transition-colors text-sm">
                  +91 8881188181
                </a>
              </li>
              <li className="flex gap-3">
                <Mail size={16} className="text-[#F8C21C] flex-shrink-0" />
                <a href="mailto:info@associatte.com" className="text-gray-400 hover:text-[#F8C21C] transition-colors text-sm break-all">
                  info@associatte.com
                </a>
              </li>
              <li className="flex gap-3">
                <Clock size={16} className="text-[#F8C21C] flex-shrink-0" />
                <span className="text-gray-400 text-sm">Tue-Sun: 10AM - 7PM</span>
              </li>
            </ul>
          </div>

          {/* Column 4 - Facebook */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-base flex items-center gap-2">
              <FaFacebookF className="text-[#1877F2]" size={16} />
              Follow Us
            </h3>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg w-full">
              <iframe
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FAssociatteIndia%2F&tabs=timeline&width=300&height=350&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false"
                width="100%"
                height="350"
                style={{ border: "none", overflow: "hidden" }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title="Facebook Page"
              ></iframe>
            </div>
          </div>

          {/* Disclaimer Section - Desktop (Moved up with negative margin and no top padding) */}
          <div className="md:col-span-2 lg:col-span-3  -mt-12 lg:-mt-16">
            {disclaimerContent}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p className="text-center md:text-left">© {currentYear} Associatte PropTech Pvt Ltd. All rights reserved.</p>

          {/* Legal Links moved to the middle */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {legalLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="text-gray-400 hover:text-[#F8C21C] transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <p className="text-center md:text-right">
            Developed and powered by
            <span className="text-[#F8C21C] font-medium ml-1">Associatte PropTech</span>
          </p>
        </div>
      </div>
    </footer>
  );
}