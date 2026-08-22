// app/awards/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Awards & Recognition | Associatte PropTech',
  description: 'Industry recognition earned by Associatte PropTech for sales excellence, innovation, and customer satisfaction across Pune, Mumbai & KDMC real estate.',
};

// THIS DEFAULT EXPORT IS REQUIRED
export default function AwardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}