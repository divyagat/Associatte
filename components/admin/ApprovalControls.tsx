'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Eye, EyeOff, Clock, Loader2 } from 'lucide-react';
import { getStatus, type ListingStatus } from '@/lib/visibility';

interface ApprovalControlsProps {
  slug: string;
  type: 'properties' | 'projects';
  /** Current status from the record (may be undefined for legacy = published). */
  status?: ListingStatus;
  /** Only the main admin can approve / show / hide. */
  isAdmin: boolean;
}

const BADGE: Record<ListingStatus, { label: string; cls: string; Icon: typeof Clock }> = {
  published: { label: 'Published', cls: 'bg-green-100 text-green-800', Icon: CheckCircle2 },
  pending: { label: 'Pending', cls: 'bg-amber-100 text-amber-800', Icon: Clock },
  hidden: { label: 'Hidden', cls: 'bg-gray-200 text-gray-700', Icon: EyeOff },
};

/**
 * Shows a listing's approval/visibility status. For admins it also renders the
 * contextual action (Approve a pending submission, Hide a live listing, or Show
 * a hidden one) which PUTs the new `status` and refreshes the list.
 */
export default function ApprovalControls({ slug, type, status: statusProp, isAdmin }: ApprovalControlsProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const status = getStatus({ status: statusProp });
  const badge = BADGE[status];

  const setStatus = async (next: ListingStatus) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/${type}/${encodeURIComponent(slug)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to update status');
      }
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update status');
    } finally {
      setBusy(false);
    }
  };

  const btn = 'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors disabled:opacity-50';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={`px-2.5 py-1 inline-flex items-center gap-1 text-xs font-semibold rounded-lg ${badge.cls}`}>
        <badge.Icon size={12} />
        {badge.label}
      </span>

      {isAdmin && (
        <>
          {status === 'pending' && (
            <button type="button" disabled={busy} onClick={() => setStatus('published')}
              className={`${btn} bg-green-600 text-white hover:bg-green-700`}>
              {busy ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />} Approve
            </button>
          )}
          {status === 'published' && (
            <button type="button" disabled={busy} onClick={() => setStatus('hidden')}
              className={`${btn} bg-gray-100 text-gray-700 hover:bg-gray-200`}>
              {busy ? <Loader2 size={12} className="animate-spin" /> : <EyeOff size={12} />} Hide
            </button>
          )}
          {status === 'hidden' && (
            <button type="button" disabled={busy} onClick={() => setStatus('published')}
              className={`${btn} bg-[#005E60] text-white hover:bg-[#004a4d]`}>
              {busy ? <Loader2 size={12} className="animate-spin" /> : <Eye size={12} />} Show
            </button>
          )}
        </>
      )}
    </div>
  );
}
