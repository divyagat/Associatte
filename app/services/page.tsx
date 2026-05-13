// client/app/services/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { Handshake, FileText, Scale, ClipboardList, TrendingUp, CheckCircle2, ArrowRight, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Services | Property Consultation, Home Loans, Legal & More | Associatte PropTech',
  description: 'End-to-end real estate services: Property Consultation, Home Loans, Legal Assistance, Property Management & Investment Advisory in Pune, Mumbai & KDMC.',
  keywords: ['property consultation', 'home loans', 'legal assistance', 'property management', 'investment advisory', 'Pune', 'Mumbai', 'KDMC'],
};

// 🎨 Brand Colors
const BRAND = {
  green: '#005E60',
  red: '#8B0000',
  yellow: '#F8C21C',
};

// 🔹 Service Configuration
const SERVICES = [
  {
    id: 'consultation',
    title: 'Property Consultation',
    icon: Handshake,
    color: BRAND.green,
    description: 'Get personalized guidance from our expert consultants to find the perfect property that matches your needs, budget & lifestyle.',
    features: [
      'One-on-one consultation with property experts',
      'Personalized shortlists based on your criteria',
      'Site visits & virtual tours arranged',
      'Negotiation support & price analysis',
      'Post-purchase assistance',
    ],
    cta: 'Book Free Consultation',
    ctaHref: '/contact-us?service=consultation',
  },
  {
    id: 'home-loans',
    title: 'Home Loans',
    icon: FileText,
    color: BRAND.yellow,
    description: 'Connect with our partner banks & NBFCs to get the best home loan deals with competitive interest rates & minimal paperwork.',
    features: [
      'Pre-approved loan eligibility check',
      'Comparison of 15+ bank offers',
      'Documentation support & application assistance',
      'Fast-track processing for Associatte customers',
      'Balance transfer guidance',
    ],
    cta: 'Check Loan Eligibility',
    ctaHref: '/contact-us?service=home-loans',
  },
  {
    id: 'legal',
    title: 'Legal Assistance',
    icon: Scale,
    color: BRAND.red,
    description: 'Ensure hassle-free property transactions with our empanelled legal experts handling documentation, verification & registration.',
    features: [
      'Title verification & due diligence',
      'Agreement drafting & review',
      'RERA compliance check',
      'Registration & stamp duty guidance',
      'Dispute resolution support',
    ],
    cta: 'Consult Legal Expert',
    ctaHref: '/contact-us?service=legal',
  },
  {
    id: 'management',
    title: 'Property Management',
    icon: ClipboardList,
    color: BRAND.yellow,
    description: 'Let us manage your property while you relax. From tenant screening to maintenance, we handle everything professionally.',
    features: [
      'Tenant screening & background checks',
      'Rent collection & financial reporting',
      'Maintenance & repair coordination',
      'Legal notice handling for defaults',
      'Periodic property inspections',
    ],
    cta: 'Manage My Property',
    ctaHref: '/contact-us?service=management',
  },
  {
    id: 'investment',
    title: 'Investment Advisory',
    icon: TrendingUp,
    color: BRAND.red,
    description: 'Make informed investment decisions with our data-driven market analysis, ROI projections & portfolio diversification strategies.',
    features: [
      'Market trend analysis & reports',
      'ROI & rental yield calculations',
      'Portfolio diversification strategies',
      'Pre-launch & early-bird opportunity alerts',
      'Exit strategy planning',
    ],
    cta: 'Get Investment Plan',
    ctaHref: '/contact-us?service=investment',
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      
      {/* 🔹 Hero Section */}
      <section className="bg-gradient-to-br from-[#005E60] to-[#004a4d] text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-lg lg:text-xl text-white/90 max-w-3xl mx-auto mb-8">
            End-to-end real estate solutions for buyers, sellers, investors & landlords in Pune, Mumbai & KDMC.
          </p>
          
          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-3">
            {SERVICES.map((service) => {
              const Icon = service.icon;
              return (
                <a
                  key={service.id}
                  href={`#${service.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  {service.title}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* 🔹 Services Sections */}
      {SERVICES.map((service, index) => {
        const Icon = service.icon;
        const isEven = index % 2 === 0;
        
        return (
          <section 
            key={service.id} 
            id={service.id}
            className={`py-16 lg:py-20 ${isEven ? 'bg-white' : 'bg-gray-50'} scroll-mt-24`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`grid lg:grid-cols-2 gap-12 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                
                {/* Content */}
                <div className={isEven ? '' : 'lg:order-2'}>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#005E60]/10 rounded-full mb-4">
                    <Icon className="w-4 h-4" style={{ color: service.color }} />
                    <span className="text-sm font-semibold" style={{ color: service.color }}>{service.title}</span>
                  </div>
                  
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">{service.title}</h2>
                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">{service.description}</p>
                  
                  {/* Features List */}
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#005E60] flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* CTA Button */}
                  <Link 
                    href={service.ctaHref}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#005E60] text-white font-semibold rounded-xl hover:bg-[#004a4d] transition-colors shadow-lg shadow-[#005E60]/20"
                  >
                    {service.cta} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                
                {/* Visual/Image Placeholder */}
                <div className={`relative ${isEven ? 'lg:order-2' : ''}`}>
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center border border-gray-200">
                    <div className="text-center p-6">
                      <Icon className="w-16 h-16 mx-auto mb-4" style={{ color: service.color }} />
                      <p className="text-gray-500 font-medium">{service.title} Illustration</p>
                      <p className="text-sm text-gray-400 mt-1">Replace with custom image</p>
                    </div>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#F8C21C]/20 rounded-full blur-2xl" />
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#005E60]/10 rounded-full blur-2xl" />
                </div>
                
              </div>
            </div>
          </section>
        );
      })}

      {/* 🔹 CTA Section */}
      <section className="bg-[#8B0000] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">Need Help Choosing a Service?</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Our experts are ready to guide you. Get a free 15-minute consultation to understand which service fits your needs best.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="tel:+918668695995"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#F8C21C] text-[#8B0000] font-semibold rounded-xl hover:bg-[#d4a017] transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call: +91 866 869 5995
            </a>
            <Link 
              href="/contact-us"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20"
            >
              Contact Us Online
            </Link>
          </div>
        </div>
      </section>

      {/* 🔹 FAQ Section (Optional) */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'Is the property consultation free?', a: 'Yes! Our initial consultation is completely free with no obligation.' },
              { q: 'Which banks do you partner with for home loans?', a: 'We partner with 15+ leading banks & NBFCs including SBI, HDFC, ICICI, Axis & more.' },
              { q: 'Do you handle legal work for properties outside Pune/Mumbai?', a: 'Yes, we provide legal assistance across Maharashtra with empanelled local experts.' },
              { q: 'What is your property management fee?', a: 'Our management fee is 5-8% of monthly rent, depending on services selected. Contact us for a custom quote.' },
            ].map((faq, i) => (
              <details key={i} className="group bg-gray-50 rounded-xl p-4 cursor-pointer">
                <summary className="font-semibold text-gray-900 flex items-center justify-between list-none">
                  {faq.q}
                  <span className="ml-4 text-[#005E60] group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-3 text-gray-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      
    </main>
  );
}