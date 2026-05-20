// app/privacy-policy/page.tsx
import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Associatte',
  description: 'Privacy Policy for Associatte PropTech Pvt Ltd - Learn how we collect, protect, and use your personal information.',
};

export default function PrivacyPolicyPage() {
  const sections = [
    {
      id: 'introduction',
      title: 'Privacy Policy',
      content: (
        <p>
          This privacy policy ("Policy") describes how we collect, protect and use the personally identifiable information ("Personal Information") you ("User", "you" or "your") provide on the{' '}
          <a href="https://associatte.co.in" className="text-[#005E60] hover:text-[#8B0000] hover:underline transition-colors">
            https://associatte.co.in
          </a>{' '}
          website and any of its products or services (collectively, "Website" or "Services"). It also describes the choices available to you regarding our use of your personal information and how you can access and update this information. This Policy does not apply to the practices of companies that we do not own or control, or to individuals that we do not employ or manage.
        </p>
      ),
    },
    {
      id: 'collection-personal',
      title: 'Collection of Personal Information',
      content: (
        <p>
          We receive and store any information you knowingly provide to us when you publish content, fill any online forms on the Website. You can choose not to provide us with certain information, but then you may not be able to take advantage of some of the Website&apos;s features.
        </p>
      ),
    },
    {
      id: 'collection-non-personal',
      title: 'Collection of Non-Personal Information',
      content: (
        <p>
          When you visit the Website our servers automatically record information that your browser sends. This data may include information such as your computer&apos;s IP address, browser type and version, operating system type and version, language preferences or the webpage you were visiting before you came to our Website, pages of our Website that you visit, the time spent on those pages, information you search for on our Website, access times and dates, and other statistics.
        </p>
      ),
    },
    {
      id: 'use-of-information',
      title: 'Use of Collected Information',
      content: (
        <p>
          Any of the information we collect from you may be used to personalize your experience; improve our website; improve customer service and respond to queries and emails of our customers; send notification emails such as password reminders, updates, etc; run and operate our Website and Services. Non-personal information collected is used only to identify potential cases of abuse and establish statistical information regarding Website traffic and usage. This statistical information is not otherwise aggregated in such a way that would identify any particular user of the system.
        </p>
      ),
    },
    {
      id: 'children',
      title: 'Children',
      content: (
        <p>
          We do not knowingly collect any personal information from children under the age of 13. If you are under the age of 13, please do not submit any personal information through our Website or Service. We encourage parents and legal guardians to monitor their children&apos;s Internet usage and to help enforce this Policy by instructing their children never to provide personal information through our Website or Service without their permission. If you have reason to believe that a child under the age of 13 has provided personal information to us through our Website or Service, please contact us.
        </p>
      ),
    },
    {
      id: 'newsletters',
      title: 'Newsletters',
      content: (
        <p>
          We offer electronic newsletters to which you may voluntarily subscribe at any time. You may choose to stop receiving our newsletter or marketing emails by following the unsubscribe instructions included in these emails or by contacting us.
        </p>
      ),
    },
    {
      id: 'cookies',
      title: 'Cookies',
      content: (
        <p>
          The Website uses "cookies" to help personalize your online experience. A cookie is a text file that is placed on your hard disk by a web page server. Cookies cannot be used to run programs or deliver viruses to your computer. Cookies are uniquely assigned to you, and can only be read by a web server in the domain that issued the cookie to you. We may use cookies to collect, store, and track information for statistical purposes to operate our Website and Services. You have the ability to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer.
        </p>
      ),
    },
    {
      id: 'information-security',
      title: 'Information Security',
      content: (
        <>
          <p className="mb-4">
            We secure information you provide on computer servers in a controlled, secure environment, protected from unauthorized access, use, or disclosure. We maintain reasonable administrative, technical, and physical safeguards in an effort to protect against unauthorized access, use, modification, and disclosure of personal information in its control and custody. However, no data transmission over the Internet or wireless network can be guaranteed. Therefore, while we strive to protect your personal information, you acknowledge that:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>There are security and privacy limitations of the Internet which are beyond our control;</li>
            <li>The security, integrity, and privacy of any and all information and data exchanged between you and our Website cannot be guaranteed;</li>
            <li>Any such information and data may be viewed or tampered with in transit by a third party, despite best efforts.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'data-breach',
      title: 'Data Breach',
      content: (
        <p>
          In the event we become aware that the security of the Website has been compromised or users Personal Information has been disclosed to unrelated third parties as a result of external activity, including, but not limited to, security attacks or fraud, we reserve the right to take reasonably appropriate measures, including, but not limited to, investigation and reporting, as well as notification to and cooperation with law enforcement authorities. In the event of a data breach, we will make reasonable efforts to notify affected individuals if we believe that there is a reasonable risk of harm to the user as a result of the breach or if notice is otherwise required by law. When we do we will send you an email.
        </p>
      ),
    },
    {
      id: 'changes-amendments',
      title: 'Changes and Amendments',
      content: (
        <p>
          We reserve the right to modify this privacy policy relating to the Website or Services at any time, effective upon posting of an updated version of this privacy policy on the Website. When we do we will send you an email to notify you. Continued use of the Website after any such changes shall constitute your consent to such changes.
        </p>
      ),
    },
    {
      id: 'acceptance',
      title: 'Acceptance of This Policy',
      content: (
        <p>
          You acknowledge that you have read this Policy and agree to all its terms and conditions. By using the Website or its Services you agree to be bound by this Policy. If you do not agree to abide by the terms of this Policy, you are not authorized to use or access the Website and its Services.
        </p>
      ),
    },
    {
      id: 'contact',
      title: 'Contacting Us',
      content: (
        <>
          <p className="mb-4">
            If you have any questions about this Policy, please contact us:
          </p>
          <address className="not-italic bg-[#F8C21C]/10 p-4 rounded-lg border-l-4 border-[#F8C21C]">
            <p className="font-medium text-[#8B0000]">Associatte PropTech Pvt Ltd</p>
            <p className="text-gray-700">302 and 303, Naren Pearl*, 3rd Floor</p>
            <p className="text-gray-700">Magarpatta Road, Above Axis and IndusInd Bank</p>
            <p className="text-gray-700">Hadapsar, Pune - 411028</p>
            <p className="mt-2">
              <strong className="text-[#005E60]">Email:</strong>{' '}
              <a href="mailto:info@associatte.co.in" className="text-[#005E60] hover:text-[#8B0000] hover:underline transition-colors">
                info@associatte.co.in
              </a>
            </p>
          </address>
          <p className="mt-6 text-sm text-gray-600 bg-[#005E60]/5 p-4 rounded-lg">
            You consent to receive communications from us by way of SMS/email/phone calls and RCS with respect to your transactions on our Website. Users will be required to register their valid phone numbers and e-mail addresses to facilitate such communication. We may also use your e-mail address to send you updates, newsletters, changes to features of the Service, and the like to provide You better Services.
          </p>
        </>
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
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Privacy Policy</h1>
          </div>
          <p className="mt-2 text-white/90 text-sm sm:text-base">Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </header>

        {/* Content */}
        <div className="px-6 py-8 sm:px-10 sm:py-10 space-y-8">
          {sections.map((section, index) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex-shrink-0 w-1 h-6 bg-[#F8C21C] rounded-full"></span>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#8B0000]">
                  {section.title}
                </h2>
              </div>
              <div className={`text-gray-700 leading-relaxed space-y-3 ${index < sections.length - 1 ? 'pb-6 border-b border-gray-100' : ''}`}>
                {section.content}
              </div>
            </section>
          ))}
        </div>

        {/* Footer Note */}
        <footer className="bg-[#005E60] px-6 py-6 sm:px-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/90">
              © {new Date().getFullYear()} Associatte PropTech Pvt Ltd. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-xs text-white/70">
              <span className="w-2 h-2 bg-[#F8C21C] rounded-full animate-pulse"></span>
              <span>Privacy Policy v1.0</span>
            </div>
          </div>
        </footer>
      </article>

      {/* Table of Contents (Optional - for better UX on desktop) */}
      <nav className="hidden lg:block fixed top-24 right-8 w-64 max-h-[calc(100vh-8rem)] overflow-y-auto bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-[#8B0000] mb-3 pb-2 border-b border-[#F8C21C]/30 sticky top-0 bg-white/95">
          On This Page
        </h3>
        <ul className="space-y-2 text-sm">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="text-gray-600 hover:text-[#005E60] hover:bg-[#F8C21C]/10 px-2 py-1 rounded transition-all block"
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Bottom Bar for Navigation */}
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
          <ul className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-2">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="block text-sm text-gray-600 hover:text-[#005E60] hover:bg-[#F8C21C]/10 px-3 py-2 rounded transition-colors"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </main>
  );
}