import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.associatte.com';
const SITE_NAME = 'Associatte PropTech';

export const metadata: Metadata = {
  title: 'Awards & Recognition | Associatte PropTech',
  description:
    'Awards and industry recognition earned by Associatte PropTech for sales excellence, innovation and customer satisfaction across Pune, Mumbai & KDMC real estate.',
  keywords: [
    'Associatte awards',
    'real estate awards Pune',
    'best real estate consultant Mumbai',
    'property advisor recognition',
    'Associatte PropTech achievements',
  ],
  alternates: { canonical: '/awards' },
  openGraph: {
    type: 'website',
    title: 'Awards & Recognition | Associatte PropTech',
    description:
      'Industry recognition for sales excellence, innovation and customer satisfaction.',
    url: `${SITE_URL}/awards`,
    siteName: SITE_NAME,
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Awards & Recognition | Associatte PropTech',
    description:
      'Industry recognition for sales excellence, innovation and customer satisfaction.',
  },
};

export default function AwardsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
