// lib/visibility.ts
//
// Listing approval / visibility model shared by the admin panel and the public
// site. Every property & project carries a `status`:
//
//   • published — live on the public site (Projects / Properties pages, nav, home)
//   • pending   — submitted by an employee, awaiting admin approval (hidden)
//   • hidden    — manually hidden by an admin (hidden)
//
// Records saved before this feature have no `status`; they are treated as
// `published` so nothing that was already live disappears.

export type ListingStatus = 'published' | 'pending' | 'hidden';

export const LISTING_STATUSES: readonly ListingStatus[] = ['published', 'pending', 'hidden'];

/** Resolve a listing's status, defaulting legacy records to `published`. */
export function getStatus(item: any): ListingStatus {
  const s = String(item?.status || '').toLowerCase().trim();
  if (s === 'pending' || s === 'hidden') return s;
  return 'published';
}

/** Whether a listing should appear anywhere on the public site. */
export function isPubliclyVisible(item: any): boolean {
  return getStatus(item) === 'published';
}

/** Coerce arbitrary input into a valid status (used when accepting API writes). */
export function sanitizeStatus(value: unknown, fallback: ListingStatus = 'published'): ListingStatus {
  const s = String(value ?? '').toLowerCase().trim();
  return (LISTING_STATUSES as readonly string[]).includes(s) ? (s as ListingStatus) : fallback;
}
