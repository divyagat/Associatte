// app/builders/[slug]/page.tsx
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>; // ✅ params is now a Promise in Next.js 15
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BuilderPage({ params }: Props) {
  // ✅ UNWRAP params with await
  const { slug } = await params;
  
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/builders/${slug}`,
    { cache: 'no-store' }
  );
  
  if (!res.ok) {
    if (res.status === 404) notFound();
    throw new Error(`Failed to fetch builder: ${res.statusText}`);
  }
  
  const builder = await res.json();
  
  return (
    <div>
      <h1>{builder.name}</h1>
      {/* ... rest of your component */}
    </div>
  );
}