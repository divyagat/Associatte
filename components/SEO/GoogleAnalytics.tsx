// components/SEO/GoogleAnalytics.tsx
'use client';

import Script from 'next/script';

/**
 * Loads Google Analytics 4 (gtag.js) using next/script.
 *
 * - `afterInteractive` keeps the tag off the critical path so it does not
 *   slow down first paint / LCP on mobile or desktop.
 * - Rendered only when a measurement id is provided, so local/dev builds
 *   without NEXT_PUBLIC_GA_ID stay clean.
 */
export default function GoogleAnalytics({ gaId }: { gaId: string }) {
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { page_path: window.location.pathname });
        `}
      </Script>
    </>
  );
}
