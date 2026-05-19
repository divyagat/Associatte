// lib/utils.ts

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  }
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2)} L`;
  }
  return `₹${price.toLocaleString('en-IN')}`;
}

export function parsePrice(priceStr: string): number {
  if (!priceStr) return 0;
  const clean = priceStr.replace(/[₹,\s]/g, '').toLowerCase();
  if (clean.includes('crore')) return parseFloat(clean) * 10000000;
  if (clean.includes('lakh')) return parseFloat(clean) * 100000;
  if (clean.includes('k')) return parseFloat(clean) * 1000;
  return parseFloat(clean) || 0;
}