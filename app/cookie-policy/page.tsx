// app/cookie-policy/page.tsx
import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | Associatte',
  description: 'Cookie Policy for Associatte PropTech Private Limited - Learn about how we use cookies to improve your experience on our website.',
};

export default function CookiePolicyPage() {
  const sections = [
    {
      id: 'introduction',
      title: 'Cookie Policy',
      content: (
        <p>
          This is the Cookie Policy for <strong>Associatte PropTech Private Limited</strong>, accessible from{' '}
          <a href="https://associatte.com" className="text-[#005E60] hover:text-[#8B0000] hover:underline transition-colors font-medium">
            https://associatte.com
          </a>
        </p>
      ),
    },
    {
      id: 'what-are-cookies',
      title: 'What Are Cookies',
      content: (
        <>
          <p className="mb-3">
            As is common practice with almost all professional websites this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it and why we sometimes need to store these cookies. We will also share how you can prevent these cookies from being stored however this may downgrade or &apos;break&apos; certain elements of the sites functionality.
          </p>
          <p>
            For more general information on cookies see the{' '}
            <a href="https://en.wikipedia.org/wiki/HTTP_cookie" target="_blank" rel="noopener noreferrer" className="text-[#005E60] hover:text-[#8B0000] hover:underline transition-colors">
              Wikipedia article on HTTP Cookies
            </a>.
          </p>
        </>
      ),
    },
    {
      id: 'how-we-use',
      title: 'How We Use Cookies',
      content: (
        <p>
          We use cookies for a variety of reasons detailed below. Unfortunately in most cases there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.
        </p>
      ),
    },
    {
      id: 'disabling-cookies',
      title: 'Disabling Cookies',
      content: (
        <div className="bg-[#F8C21C]/10 border-l-4 border-[#F8C21C] p-4 rounded-r-lg">
          <p className="text-gray-700">
            You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of the this site. Therefore it is recommended that you do not disable cookies.
          </p>
        </div>
      ),
    },
    {
      id: 'cookies-we-set',
      title: 'The Cookies We Set',
      content: null, // Section header only, subsections follow
    },
    {
      id: 'forms-cookies',
      title: 'Forms Related Cookies',
      isSubsection: true,
      content: (
        <p>
          When you submit data to through a form such as those found on contact pages or comment forms cookies may be set to remember your user details for future correspondence.
        </p>
      ),
    },
    {
      id: 'preferences-cookies',
      title: 'Site Preferences Cookies',
      isSubsection: true,
      content: (
        <p>
          In order to provide you with a great experience on this site we provide the functionality to set your preferences for how this site runs when you use it. In order to remember your preferences we need to set cookies so that this information can be called whenever you interact with a page is affected by your preferences.
        </p>
      ),
    },
    {
      id: 'third-party-cookies',
      title: 'Third Party Cookies',
      content: (
        <p className="mb-4">
          In some special cases we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site.
        </p>
      ),
    },
    {
      id: 'google-analytics',
      title: 'Google Analytics',
      isSubsection: true,
      content: (
        <>
          <p className="mb-3">
            This site uses Google Analytics which is one of the most widespread and trusted analytics solution on the web for helping us to understand how you use the site and ways that we can improve your experience. These cookies may track things such as how long you spend on the site and the pages that you visit so we can continue to produce engaging content.
          </p>
          <p>
            For more information on Google Analytics cookies, see the{' '}
            <a href="https://marketingplatform.google.com/about/analytics/terms/" target="_blank" rel="noopener noreferrer" className="text-[#005E60] hover:text-[#8B0000] hover:underline transition-colors">
              official Google Analytics page
            </a>.
          </p>
        </>
      ),
    },
    {
      id: 'feature-testing',
      title: 'Feature Testing Cookies',
      isSubsection: true,
      content: (
        <p>
          From time to time we test new features and make subtle changes to the way that the site is delivered. When we are still testing new features these cookies may be used to ensure that you receive a consistent experience whilst on the site whilst ensuring we understand which optimisations our users appreciate the most.
        </p>
      ),
    },
    {
      id: 'ecommerce-cookies',
      title: 'E-commerce Statistics Cookies',
      isSubsection: true,
      content: (
        <p>
          As we sell products it&apos;s important for us to understand statistics about how many of the visitors to our site actually make a purchase and as such this is the kind of data that these cookies will track. This is important to you as it means that we can accurately make business predictions that allow us to monitor our advertising and product costs to ensure the best possible price.
        </p>
      ),
    },
    {
      id: 'google-adsense',
      title: 'Google AdSense',
      isSubsection: true,
      content: (
        <>
          <p className="mb-3">
            The Google AdSense service we use to serve advertising uses a DoubleClick cookie to serve more relevant ads across the web and limit the number of times that a given ad is shown to you.
          </p>
          <p>
            For more information on Google AdSense see the{' '}
            <a href="https://support.google.com/adsense/answer/48182" target="_blank" rel="noopener noreferrer" className="text-[#005E60] hover:text-[#8B0000] hover:underline transition-colors">
              official Google AdSense privacy FAQ
            </a>.
          </p>
        </>
      ),
    },
    {
      id: 'social-media',
      title: 'Social Media Cookies',
      isSubsection: true,
      content: (
        <p>
          We also use social media buttons and/or plugins on this site that allow you to connect with your social network in various ways. For these to work the following social media sites to set cookies through our site which may be used to enhance your profile on their site or contribute to the data they hold for various purposes outlined in their respective privacy policies.
        </p>
      ),
    },
    {
      id: 'more-information',
      title: 'More Information',
      content: (
        <>
          <p className="mb-4">
            Hopefully that has clarified things for you and as was previously mentioned if there is something that you aren&apos;t sure whether you need or not it&apos;s usually safer to leave cookies enabled in case it does interact with one of the features you use on our site.
          </p>
          <p className="mb-4">
            However if you are still looking for more information then you can contact us through one of our preferred contact methods:
          </p>
          <address className="not-italic bg-[#005E60]/5 p-5 rounded-xl border border-[#005E60]/20">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#8B0000] rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-[#8B0000] mb-1">Email Support</p>
                <a href="mailto:info@associatte.com" className="text-[#005E60] hover:text-[#8B0000] hover:underline transition-colors text-lg font-medium">
                  info@associatte.com
                </a>
                <p className="text-sm text-gray-500 mt-1">We typically respond within 1-2 business days</p>
              </div>
            </div>
          </address>
        </>
      ),
    },
  ];

  // Filter out section headers that are just containers
  const mainSections = sections.filter(s => !s.isSubsection);
  const allSections = sections;

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <header className="bg-gradient-to-r from-[#8B0000] to-[#005E60] text-white px-6 py-8 sm:px-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-block w-2 h-8 bg-[#F8C21C] rounded-full"></span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Cookie Policy</h1>
          </div>
          <p className="mt-2 text-white/90 text-sm sm:text-base">
            Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </header>

        {/* Content */}
        <div className="px-6 py-8 sm:px-10 sm:py-10">
          {/* Introduction Box */}
          <div className="mb-8 p-4 bg-[#F8C21C]/10 border-l-4 border-[#F8C21C] rounded-r-lg">
            <p className="text-gray-700">
              This policy explains how <strong className="text-[#8B0000]">Associatte PropTech Private Limited</strong> uses cookies and similar technologies on our website.
            </p>
          </div>

          {sections.map((section, index) => {
            // Skip container sections that only have subsections
            if (section.id === 'cookies-we-set' || section.id === 'third-party-cookies') {
              return (
                <div key={section.id} id={section.id} className="scroll-mt-24 mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex-shrink-0 w-1 h-6 bg-[#F8C21C] rounded-full"></span>
                    <h2 className="text-xl sm:text-2xl font-semibold text-[#8B0000]">
                      {section.title}
                    </h2>
                  </div>
                  {section.content && (
                    <div className="text-gray-700 leading-relaxed mb-6">
                      {section.content}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <section 
                key={section.id} 
                id={section.id} 
                className={`scroll-mt-24 ${section.isSubsection ? 'ml-0 sm:ml-6 border-l-2 border-[#005E60]/20 pl-4 sm:pl-6 py-4' : 'py-4'} ${index < sections.length - 1 && !section.isSubsection ? 'border-b border-gray-100 pb-6 mb-6' : ''}`}
              >
                {!section.isSubsection && (
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex-shrink-0 w-1 h-6 bg-[#F8C21C] rounded-full"></span>
                    <h2 className="text-xl sm:text-2xl font-semibold text-[#8B0000]">
                      {section.title}
                    </h2>
                  </div>
                )}
                {section.isSubsection && (
                  <h3 className="text-lg font-semibold text-[#005E60] mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#F8C21C] rounded-full"></span>
                    {section.title}
                  </h3>
                )}
                <div className="text-gray-700 leading-relaxed space-y-3">
                  {section.content}
                </div>
              </section>
            );
          })}
        </div>

        {/* Footer Note */}
        <footer className="bg-[#005E60] px-6 py-6 sm:px-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/90">
              © {new Date().getFullYear()} Associatte PropTech Private Limited. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-xs text-white/70">
              <span className="w-2 h-2 bg-[#F8C21C] rounded-full animate-pulse"></span>
              <span>Cookie Policy v1.0</span>
            </div>
          </div>
        </footer>
      </article>

      {/* Table of Contents - Desktop */}
      <nav className="hidden lg:block fixed top-24 right-8 w-64 max-h-[calc(100vh-8rem)] overflow-y-auto bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-[#8B0000] mb-3 pb-2 border-b border-[#F8C21C]/30 sticky top-0 bg-white/95">
          On This Page
        </h3>
        <ul className="space-y-1.5 text-sm">
          {mainSections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="text-gray-600 hover:text-[#005E60] hover:bg-[#F8C21C]/10 px-2 py-1.5 rounded transition-all block font-medium"
              >
                {section.title}
              </a>
            </li>
          ))}
          {/* Subsections for Third Party Cookies */}
          <li className="pl-4 mt-2 border-l-2 border-[#005E60]/20">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Third Party</p>
            {[
              { id: 'google-analytics', title: 'Google Analytics' },
              { id: 'feature-testing', title: 'Feature Testing' },
              { id: 'ecommerce-cookies', title: 'E-commerce Stats' },
              { id: 'google-adsense', title: 'Google AdSense' },
              { id: 'social-media', title: 'Social Media' },
            ].map((sub) => (
              <a
                key={sub.id}
                href={`#${sub.id}`}
                className="block text-gray-500 hover:text-[#005E60] hover:bg-[#F8C21C]/10 px-2 py-1 rounded transition-all text-xs"
              >
                {sub.title}
              </a>
            ))}
          </li>
        </ul>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg z-50">
        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer list-none">
            <span className="text-sm font-medium text-[#8B0000]">Navigate Sections</span>
            <span className="text-[#F8C21C] group-open:rotate-180 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </summary>
          <ul className="mt-3 space-y-1.5 max-h-56 overflow-y-auto pr-2">
            {mainSections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="block text-sm text-gray-600 hover:text-[#005E60] hover:bg-[#F8C21C]/10 px-3 py-2 rounded transition-colors font-medium"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </details>
      </div>

      {/* Cookie Notice Banner (Optional - for UX enhancement) */}
      <div className="fixed bottom-20 lg:bottom-8 left-1/2 -translate-x-1/2 z-40 max-w-md w-full px-4">
        <div className="bg-[#8B0000] text-white rounded-xl shadow-xl p-4 flex items-start gap-3 border border-[#F8C21C]/30">
          <span className="flex-shrink-0 w-8 h-8 bg-[#F8C21C] rounded-full flex items-center justify-center text-[#8B0000] font-bold text-sm">
            ⓘ
          </span>
          <div className="flex-1 text-sm">
            <p className="font-medium mb-1">Cookie Preferences</p>
            <p className="text-white/90 text-xs">
              You can manage your cookie settings anytime via your browser preferences.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}