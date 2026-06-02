// app/terms-conditions/page.tsx
import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Associatte',
  description: 'Terms of Service for Associatte PropTech Private Limited - Read our terms and conditions for using our website and services.',
};

export default function TermsConditionsPage() {
  const terms = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      content: (
        <p>
          Any person logging on to or using the site ("the Visitor") has unconditionally accepted the terms and conditions of use and these constitute a binding and enforceable agreement between the visitor and the <strong className="text-[#8B0000]">Associatte PropTech Private Limited</strong>.
        </p>
      ),
    },
    {
      id: 'information-accuracy',
      title: 'Information Accuracy',
      content: (
        <p>
          The information on this website is presented as general information and no representation or warranty is expressly or impliedly given as to it accuracy, completeness or correctness.
        </p>
      ),
    },
    {
      id: 'visitor-agreement',
      title: 'Visitor Agreement & Jurisdiction',
      content: (
        <p>
          The visitor is presumed to have read the terms and conditions of the website and is deemed to have agreed, understood and accepted unconditionally all the terms, conditions, procedure and risks of logging onto the website and cannot claim, at anytime, ignorance of any or all of them. All relationships of any visitor of this website wheresoever's situated is governed by and in accordance with the laws and jurisdiction of <strong>Pune, India</strong>.
        </p>
      ),
    },
    {
      id: 'no-warranty',
      title: 'No Warranty & Disclaimer',
      content: (
        <p>
          The Associatte PropTech Private Limited uses all diligence, skill and expertise available to provide information on this website but does not accept or undertake any express or implied warranty of any nature whatsoever and the Associatte PropTech Private Limited disclaims all or any errors and mistakes to the fullest extent. The Associatte PropTech Private Limited does not warrant that the information offered will be error-free, or that the defects will be corrected, or that this site or the server that makes it available are or will be free of viruses or other harmful components. The Associatte PropTech Private Limited shall not be under any obligation to ensure compliance or handle complaints.
        </p>
      ),
    },
    {
      id: 'property-information',
      title: 'Property Information Disclaimer',
      content: (
        <p>
          The Associatte PropTech Private Limited website may unintentionally include inaccuracies or errors with respect to the description of a plot/flat size, site plan, floor plan, a rendering, a photo, the elevation, prices, taxes, adjacent properties, amenities, design guidelines, completion dates, features, zoning, buyer incentives etc. Square footage and room sizes are approximate and may vary.
        </p>
      ),
    },
    {
      id: 'indicative-plans',
      title: 'Indicative Plans & Limitation of Liability',
      content: (
        <>
          <p className="mb-3">
            The plans, specifications, images and other details herein are only indicative and the Associatte PropTech Private Limited reserves the right to change any or all of these in the interest of the project/development. The Website does not constitute an offer and/or contract of any nature whatsoever. Any purchase/leave and license in any project shall be governed by the terms of the agreement entered into between the parties and no details mentioned on this website shall govern the transaction.
          </p>
          <p>
            The Associatte PropTech Private Limited and its respective subsidiaries and affiliates, and their respective officers, directors, partners, employees, agents, managers, trustees, representatives or contractors of any of them, related thereto and any successors or assigns of any of the foregoing shall not be liable for any direct, indirect, actual, punitive, incidental, special, consequential damages or economic loss whatsoever, arising from or related to the use of or reliance on this Web site. The Associatte PropTech Private Limited reserves the right to alter, amend and vary the layout, plans, and specifications or feature without prior notice or obligation, but subject to the approval of the competent authorities as applicable.
          </p>
        </>
      ),
    },
    {
      id: 'consent-to-use-data',
      title: 'Consent to Use Personal Information',
      content: (
        <p>
          The visitor has, by the act of logging onto the website and/or submitting information or giving his name, address, email addresses as identification to the Associatte PropTech Private Limited through the website, on phone, fax or e-mail, deemed to have consented and has expressly and irrevocably authorized Associatte PropTech Private Limited to use, reveal, analyze or display and transmit all information and documents as may be required by it. The visitor represents and warrants that he has provided true, accurate, current and complete information about himself and if any information is found to be untrue, inaccurate, not current or incomplete, the Associatte PropTech Private Limited has the right to take any action it deems appropriate without any limitation.
        </p>
      ),
    },
    {
      id: 'legal-compliance',
      title: 'Legal Compliance Warranty',
      content: (
        <p>
          The visitor represents and warrants that he/she is fully aware of the laws of the country/state he/she resides in and also those of India particularly those governing use, sale, lease, transfer of real estate and the visitor is neither violating nor attempting to violate any law.
        </p>
      ),
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property Rights',
      content: (
        <p>
          The contents, information and material contain in this website are the exclusive property of the Associatte PropTech Private Limited and are protected by copyright and intellectual property laws. No person shall use, copy, reproduce, distribute, initiate, publish, display, modify, create derivative works or database, use, transmit, upload, exploit, sell or distribute the same in whole or in part or any part thereof without prior express written permission from the Associatte PropTech Private Limited. Facility to print an article or portion of text or material on this website through computer/electronic device does not tantamount to prior written consent.
        </p>
      ),
    },
    {
      id: 'no-offer',
      title: 'No Offer or Contract',
      content: (
        <p>
          Notwithstanding anything stated hereinabove or in this website, it is clarified, understood and agreed that the Associatte PropTech Private Limited through this website does not intend to make any offer, proposal or contract as per prevailing laws in India or any similar or relevant law in the country of residence or access of the visitor.
        </p>
      ),
    },
    {
      id: 'communication-consent',
      title: 'Communication & Contact',
      content: (
        <p>
          The Associatte PropTech Private Limited has the right to reproduce, monitor, disclose any transmission or information received and made to this website. Visitors may be sent information or contacted through the email addresses, phone numbers and postal addresses provided by the visitor on the website. Any visitor who may not desire to receive email from the Associatte PropTech Private Limited may give clear instructions.
        </p>
      ),
    },
    {
      id: 'prohibited-activities',
      title: 'Prohibited Activities',
      content: (
        <p>
          The visitor shall not use or post any computer programs in connection with his/her use of the website that contain destructive features such as viruses anomalies, self-destruct mechanisms, time/logic bombs, worm, Trojan horses etc.
        </p>
      ),
    },
    {
      id: 'liability-limitation',
      title: 'Limitation of Liability',
      content: (
        <p>
          Notwithstanding anything, in no event shall the Associatte PropTech Private Limited, their promoters, directors, employees and agents be liable to the visitor for any or all damages, losses and causes of action (including but not limited to negligence), errors, injury, whether direct, indirect, consequential or incidental, suffered or incurred by any person/s or due to any use and/or inability to use this site or information or its links, hyperlinks, action taken or abstained or any transmission made through this website.
        </p>
      ),
    },
    {
      id: 'external-links',
      title: 'External Links Disclaimer',
      content: (
        <p>
          Any links to off-site pages or other sites may be accepted by the visitor at his/her option and own risk and the Associatte PropTech Private Limited assumes no liability for and shall be held harmless from any resulting damages. The Associatte PropTech Private Limited strongly recommends that the visitors carefully reads the terms and conditions of such linked site(s).
        </p>
      ),
    },
    {
      id: 'modification-terms',
      title: 'Modification of Terms',
      content: (
        <p>
          The Associatte PropTech Private Limited reserves the right to terminate, revoke, modify, alter, add, and delete any one or more of the terms and conditions of the website. The Associatte PropTech Private Limited shall be under no obligation to notify the visitor of the amendment to the terms and conditions and the visitor shall be bound by such amended terms and conditions.
        </p>
      ),
    },
    {
      id: 'pricing-disclaimer',
      title: 'Pricing Disclaimer',
      content: (
        <p>
          Product cost listed on the website is indicative in nature, actual product cost might be different.
        </p>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <header className="bg-gradient-to-r from-[#8B0000] to-[#005E60] text-white px-6 py-8 sm:px-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-block w-2 h-8 bg-[#F8C21C] rounded-full"></span>
            <h1 className="page-title">Terms of Service</h1>
          </div>
          <p className="mt-2 text-white/90 text-sm sm:text-base">
            Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </header>

        {/* Important Notice Banner */}
        <div className="px-6 py-4 bg-[#F8C21C]/15 border-b border-[#F8C21C]/30">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-[#8B0000] text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">!</span>
            <p className="text-sm text-gray-700">
              <strong className="text-[#8B0000]">Please read carefully:</strong> By using this website, you agree to be legally bound by these Terms of Service. If you do not agree, please do not use this site.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-8 sm:px-10 sm:py-10 space-y-6">
          {terms.map((term, index) => (
            <section 
              key={term.id} 
              id={term.id} 
              className="scroll-mt-24 group"
            >
              <div className="flex items-start gap-4">
                {/* Term Number Badge */}
                <span className="flex-shrink-0 w-8 h-8 bg-[#8B0000] text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                  {index + 1}
                </span>
                
                {/* Term Content */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#8B0000] mb-3 group-hover:text-[#005E60] transition-colors">
                    {term.title}
                  </h2>
                  <div className="text-gray-700 leading-relaxed space-y-3 pl-1">
                    {term.content}
                  </div>
                </div>
              </div>
              
              {/* Section Divider */}
              {index < terms.length - 1 && (
                <div className="mt-6 ml-12 border-t border-gray-100"></div>
              )}
            </section>
          ))}

          {/* Communication Consent Notice */}
          <section id="communication-consent-notice" className="scroll-mt-24 mt-8 pt-6 border-t-2 border-[#005E60]">
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-[#005E60] text-white rounded-full flex items-center justify-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#005E60] mb-2">Communication Consent</h3>
                <p className="text-gray-700 leading-relaxed">
                  You consent to receive communications from us by way of SMS/email/phone calls and RCS with respect to your transactions on our Website. Users will be required to register their valid phone numbers and e-mail addresses to facilitate such communication. We may also use your e-mail address to send you updates, newsletters, changes to features of the Service, and the like to provide You better Services.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section id="contact" className="scroll-mt-24 mt-10 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-[#8B0000] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#F8C21C] rounded-full"></span>
              Questions? Contact Us
            </h2>
            <address className="not-italic bg-gradient-to-br from-[#005E60]/5 to-[#F8C21C]/5 p-6 rounded-xl border border-[#005E60]/20">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold text-[#8B0000] mb-2">Associatte PropTech Private Limited</p>
                  <p className="text-gray-700">302 and 303, Naren Pearl*, 3rd Floor</p>
                  <p className="text-gray-700">Magarpatta Road, Above Axis and IndusInd Bank</p>
                  <p className="text-gray-700">Hadapsar, Pune - 411028</p>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-sm text-gray-500 mb-2">Email Support</p>
                  <a 
                    href="mailto:info@associatte.co.in" 
                    className="inline-flex items-center gap-2 text-[#005E60] hover:text-[#8B0000] font-medium transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    info@associatte.co.in
                  </a>
                </div>
              </div>
            </address>
          </section>
        </div>

        {/* Footer */}
        <footer className="bg-[#8B0000] px-6 py-6 sm:px-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/90">
              © {new Date().getFullYear()} Associatte PropTech Private Limited. All rights reserved.
            </p>
            <div className="flex items-center gap-3 text-xs text-white/70">
              <span className="px-2 py-1 bg-[#F8C21C]/20 rounded text-[#F8C21C] font-medium">
                Terms v1.0
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Jurisdiction: Pune, India</span>
            </div>
          </div>
        </footer>
      </article>

      {/* Table of Contents - Desktop */}
      <nav className="hidden lg:block fixed top-24 right-8 w-72 max-h-[calc(100vh-8rem)] overflow-y-auto bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-[#8B0000] mb-3 pb-2 border-b border-[#F8C21C]/30 sticky top-0 bg-white/95 flex items-center gap-2">
          <span className="w-1.5 h-4 bg-[#F8C21C] rounded-full"></span>
          Table of Contents
        </h3>
        <ul className="space-y-1 text-sm">
          {terms.map((term, index) => (
            <li key={term.id}>
              <a
                href={`#${term.id}`}
                className="flex items-start gap-2 text-gray-600 hover:text-[#005E60] hover:bg-[#F8C21C]/10 px-2 py-1.5 rounded transition-all group"
              >
                <span className="flex-shrink-0 w-5 h-5 bg-[#8B0000]/10 text-[#8B0000] rounded-full flex items-center justify-center text-xs font-medium group-hover:bg-[#8B0000] group-hover:text-white transition-colors">
                  {index + 1}
                </span>
                <span className="line-clamp-1">{term.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg z-50">
        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer list-none">
            <span className="text-sm font-medium text-[#8B0000]">View All Sections</span>
            <span className="text-[#F8C21C] group-open:rotate-180 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </summary>
          <ul className="mt-3 space-y-1 max-h-64 overflow-y-auto pr-2">
            {terms.map((term, index) => (
              <li key={term.id}>
                <a
                  href={`#${term.id}`}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#005E60] hover:bg-[#F8C21C]/10 px-3 py-2 rounded transition-colors"
                >
                  <span className="flex-shrink-0 w-5 h-5 bg-[#8B0000]/10 text-[#8B0000] rounded-full flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  {term.title}
                </a>
              </li>
            ))}
          </ul>
        </details>
      </div>

      {/* Quick Action Floating Button */}
      <a
        href="#contact"
        className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 z-40 inline-flex items-center gap-2 bg-[#8B0000] hover:bg-[#8B0000]/90 text-white px-4 py-3 rounded-full shadow-lg transition-all hover:shadow-xl group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className="text-sm font-medium hidden sm:inline">Contact Us</span>
      </a>
    </main>
  );
}