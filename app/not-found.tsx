// app/not-found.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

const HELPFUL_LINKS = [
  { href: '/projects', label: 'Browse all projects' },
  { href: '/locations/pune', label: 'Properties in Pune' },
  { href: '/locations/mumbai', label: 'Properties in Mumbai' },
  { href: '/locations/kdmc', label: 'Properties in Kalyan-Dombivli' },
  { href: '/blog', label: 'Real estate blog' },
  { href: '/contact-us', label: 'Contact us' },
];

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="page-title">Page not found</h1>
      <p className="text-gray-600 mt-3 max-w-md">
        The page you were looking for doesn&apos;t exist or has moved. These may help:
      </p>
      <ul className="mt-6 flex flex-wrap justify-center gap-3">
        {HELPFUL_LINKS.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="inline-block px-4 py-2 rounded-full border border-gray-200 text-[#005E60] hover:border-[#005E60]">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/" className="text-[#005E60] hover:underline mt-6">← Back to Home</Link>
    </div>
  );
}
