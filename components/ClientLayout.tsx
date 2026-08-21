// components/ClientLayout.tsx
'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import OrganizationSchema from '@/components/SEO/OrganizationSchema';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Providers } from '@/app/providers';
import StickyActions from '@/components/common/StickyActions';
import Chatbot from '@/components/Chatbot';
import EnquiryPopup from '@/components/common/EnquiryPopup';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // The admin panel has its own chrome (AdminShell sidebar/header) and must NOT
  // render the public site Header/Footer/Chatbot/popups on top of it.
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <Providers>{children}</Providers>;
  }

  return (
    <>
      <OrganizationSchema />
      <Header />
      <Providers>
        <main className="min-h-screen">{children}</main>
      </Providers>
      <Footer />
      <StickyActions showScrollTop={true} />
      {mounted && <Chatbot />}
      {mounted && (
        <EnquiryPopup
          autoPopup={true}
          popupDelay={8000}
          projectName="Associatte PropTech"
          projectTagline="Find your dream property with expert guidance"
          theme="gradient"
          showLegalLinks={true}
          formName="Website Auto Popup Enquiry"
          trackingData={{
            source: 'website',
            campaign: 'auto_popup',
            medium: 'organic',
            city: ''
          }}
        />
      )}
    </>
  );
}