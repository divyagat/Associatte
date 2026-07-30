// lib/visibility.ts
//
// Listing approval / visibility model shared by the admin panel and the public
// site. Every property & project carries a `status` that moves through a
// TWO-STAGE approval before it goes live:
//
//   • pending          — submitted by an employee, awaiting MANAGER approval (hidden)
//   • manager_approved — approved by a manager, awaiting MAIN ADMIN approval (hidden)
//   • published        — approved by both manager & main admin, live on the site
//   • hidden           — manually hidden by an approver (hidden)
//
// Records saved before this feature have no `status`; they are treated as
// `published` so nothing that was already live disappears.

export type ListingStatus = 'published' | 'manager_approved' | 'pending' | 'hidden';

export const LISTING_STATUSES: readonly ListingStatus[] = [
  'published',
  'manager_approved',
  'pending',
  'hidden',
];

/** Resolve a listing's status, defaulting legacy records to `published`. */
export function getStatus(item: any): ListingStatus {
  const s = String(item?.status || '').toLowerCase().trim();
  if (s === 'pending' || s === 'hidden' || s === 'manager_approved') return s;
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

// ── Two-stage approval helpers ─────────────────────────────────────────────

/** Who is acting, for approval purposes. */
export type ApproverRole = 'admin' | 'manager' | 'employee';

/**
 * Status a newly created listing should start in, based on who created it:
 *   • admin    → published        (main admin is the final gate; publishes directly)
 *   • manager  → manager_approved  (their submission clears stage 1, awaits admin)
 *   • employee → pending           (awaits manager, then admin)
 */
export function initialStatusForRole(role: ApproverRole): ListingStatus {
  if (role === 'admin') return 'published';
  if (role === 'manager') return 'manager_approved';
  return 'pending';
}

/**
 * Target statuses an approver may set directly via a status-only update.
 * A main admin has full control. A manager may advance a submission to
 * `manager_approved` (stage-1 approval) or hide a listing, but may NOT publish —
 * publishing is the main admin's exclusive final gate.
 */
export function allowedStatusTargets(role: 'admin' | 'manager'): ListingStatus[] {
  return role === 'admin'
    ? ['published', 'manager_approved', 'pending', 'hidden']
    : ['manager_approved', 'hidden'];
}
