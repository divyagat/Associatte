// app/not-found.tsx
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Page Not Found | YourBrand' }

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold">404 - Property Not Found</h1>
      <Link href="/" className="text-blue-600 hover:underline mt-4">← Back to Home</Link>
    </div>
  )
}