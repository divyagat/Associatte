import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.associatte.com';
const SITE_NAME = 'Associatte PropTech';

export const metadata: Metadata = {
  title: 'Real Estate News & Market Updates | Associatte PropTech',
  description:
    'Latest real estate news, market trends, infrastructure updates and RERA policy changes across Pune, Mumbai & KDMC. Stay informed with Associatte PropTech.',
  keywords: [
    'real estate news',
    'property news Pune',
    'Mumbai real estate updates',
    'KDMC property news',
    'RERA news Maharashtra',
    'Associatte PropTech',
  ],
  alternates: { canonical: '/news' },
  openGraph: {
    type: 'website',
    title: 'Real Estate News & Market Updates | Associatte PropTech',
    description:
      'Latest real estate news, market trends and policy updates across Pune, Mumbai & KDMC.',
    url: `${SITE_URL}/news`,
    siteName: SITE_NAME,
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Real Estate News & Market Updates | Associatte PropTech',
    description:
      'Latest real estate news, market trends and policy updates across Pune, Mumbai & KDMC.',
  },
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
