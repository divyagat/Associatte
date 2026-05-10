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
        
        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* BRAND & ABOUT */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-[#005E60] rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white leading-tight">
                Associatte<span className="text-[#F8C21C]"> PropTech</span>
              </span>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed">
              Associatte PropTech Pvt Ltd is one of the leading Real Estate and Property Management Company in Pune established by Mr. Vikram Malik, who has an experience of more than 20 years in the Industry. Since then we have come a long way in the real estate business.
            </p>

            <div className="text-xs text-gray-500 bg-gray-800/50 px-3 py-1.5 rounded-lg inline-block">
              RERA NO. <span className="text-[#F8C21C] font-semibold">A52100029540</span>
            </div>

            <div className="flex gap-3 pt-1">
              {socialIcons.map((item, i) => {
                const Icon = item.icon;
                return (
                  <a
                    key={i}
                    href={item.href}
                    className="w-9 h-9 bg-gray-800 hover:bg-[#005E60] rounded-lg flex items-center justify-center transition text-gray-400 hover:text-white"
                    aria-label="Social Link"
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
            <ul className="space-y-3 text-sm">
              <li><Link href="/properties?status=sale" className="hover:text-[#F8C21C] transition">Buy Property</Link></li>
              <li><Link href="/properties?status=rent" className="hover:text-[#F8C21C] transition">Rent Property</Link></li>
              <li><Link href="/properties" className="hover:text-[#F8C21C] transition">New Projects</Link></li>
              <li><Link href="/contact" className="hover:text-[#F8C21C] transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* TOP CITIES */}
          <div>
            <h3 className="text-white font-semibold mb-5">Top Cities</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/city/pune" className="hover:text-[#F8C21C] transition">Properties in Pune</Link></li>
              <li><Link href="/city/mumbai" className="hover:text-[#F8C21C] transition">Properties in Mumbai</Link></li>
              <li><Link href="/city/bangalore" className="hover:text-[#F8C21C] transition">Properties in Bangalore</Link></li>
              <li><Link href="/city/hyderabad" className="hover:text-[#F8C21C] transition">Properties in Hyderabad</Link></li>
            </ul>
          </div>

          {/* CONTACT & LEGAL */}
          <div>
            <h3 className="text-white font-semibold mb-5">Contact & Support</h3>
            <ul className="space-y-3 text-sm mb-5">
              <li className="flex gap-2 items-start"><MapPin size={16} className="mt-0.5 flex-shrink-0 text-[#F8C21C]"/> Pune, India</li>
              <li className="flex gap-2 items-start"><Phone size={16} className="mt-0.5 flex-shrink-0 text-[#F8C21C]"/> +91 80080 01234</li>
              <li className="flex gap-2 items-start"><Mail size={16} className="mt-0.5 flex-shrink-0 text-[#F8C21C]"/> hello@associatteproptech.com</li>
            </ul>
            
            <h3 className="text-white font-semibold mb-3">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy-policy" className="hover:text-[#F8C21C] transition">Privacy Policy</Link></li>
              <li><Link href="/about" className="hover:text-[#F8C21C] transition">About Us</Link></li>
              <li><Link href="/terms-conditions" className="hover:text-[#F8C21C] transition">Terms and Conditions</Link></li>
            </ul>
          </div>
        </div>

        {/* DISCLAIMER & CONSENT SECTION */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="bg-gray-800/40 rounded-xl p-5 space-y-4 text-xs text-gray-400 leading-relaxed">
            <div>
              <h4 className="font-semibold text-gray-300 mb-1">Disclaimer:</h4>
              <p>Associatte PropTech Pvt Ltd is only an intermediary offering its platform to advertise properties of Seller for a Customer/Buyer/User coming on its Website and is not and cannot be a party to or privy to or control in any manner any transactions between the Seller and the Customer/Buyer/User. All the prices or rates on this Website have been extended by various Builder(s)/Developer(s) who have advertised their products. Company shall neither be responsible nor liable to mediate or resolve any disputes or disagreements between the Customer/Buyer/User and the Seller and both Seller and Customer/Buyer/User shall settle all such disputes without involving Company in any manner.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-300 mb-1">Consent to Communicate:</h4>
              <p>You consent to receive communications from us by way of SMS/email/phone calls and RCS with respect to your transactions on our Website. Users will be required to register their valid phone numbers and e-mail addresses to facilitate such communication. We may also use your e-mail address to send you updates, newsletters, changes to features of the Service, and the like to provide You better Services.</p>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {currentYear} Associatte PropTech Pvt Ltd. All rights reserved.</p>
          <p>Developed and powered by Associatte PropTech Pvt Ltd.</p>
        </div>
      </div>
    </footer>
  );
}