// app/enquiry-test/layout.tsx
// Internal test page for the enquiry popup — never indexed.
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Enquiry test',
  robots: { index: false, follow: false },
};

export default function EnquiryTestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
