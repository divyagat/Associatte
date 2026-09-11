// components/SEO/FacebookPixel.tsx
'use client';

import Script from 'next/script';

/**
 * Loads the Meta (Facebook) Pixel — fbevents.js plus the initial PageView.
 *
 * - `afterInteractive` keeps the pixel off the critical render path so it does
 *   not slow first paint / LCP (same approach as GoogleAnalytics). next/script
 *   still injects it high in the document, so tracking fires on every load.
 * - The <noscript> beacon covers visitors with JavaScript disabled.
 */
export default function FacebookPixel({ pixelId }: { pixelId: string }) {
  if (!pixelId) return null;

  return (
    <>
      <Script id="fb-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window,document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixelId}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
