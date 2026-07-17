'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { PROJECT_TYPES, DEAL_TYPES } from '@/lib/categories';

interface CategoryVisibilityManagerProps {
  initialHiddenTypes: string[];
  initialHiddenDeals: string[];
}

/**
 * Admin control for hiding whole nav categories from the public site. Hidden
 * categories disappear from the header dropdowns and the /projects & /properties
 * tab rows (their listings are no longer reachable through the nav).
 */
export default function CategoryVisibilityManager({
  initialHiddenTypes,
  initialHiddenDeals,
}: CategoryVisibilityManagerProps) {
  const router = useRouter();
  const [hiddenTypes, setHiddenTypes] = useState<Set<string>>(new Set(initialHiddenTypes));
  const [hiddenDeals, setHiddenDeals] = useState<Set<string>>(new Set(initialHiddenDeals));
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const toggle = (set: Set<string>, setter: (s: Set<string>) => void, id: string) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setter(next);
    setSavedAt(null);
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/site-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hiddenTypes: Array.from(hiddenTypes),
          hiddenDeals: Array.from(hiddenDeals),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save');
      }
      setSavedAt(Date.now());
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save category visibility');
    } finally {
      setSaving(false);
    }
  };

  const Row = ({ id, label, hidden, onToggle }: { id: string; label: string; hidden: boolean; onToggle: () => void }) => (
    <div key={id} className="flex items-center justify-between py-3 px-4 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2">
        {hidden ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-[#005E60]" />}
        <span className={`font-medium ${hidden ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{label}</span>
      </div>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={!hidden}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${hidden ? 'bg-gray-300' : 'bg-[#005E60]'}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${hidden ? 'translate-x-1' : 'translate-x-6'}`} />
      </button>
    </div>
  );

  return (
    <div className="space-y-8">
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Projects menu (by type)</h2>
        <p className="text-sm text-gray-500 mb-4">Turn a type off to hide it from the Projects dropdown and tabs.</p>
        <div className="space-y-2">
          {PROJECT_TYPES.map((t) => (
            <Row
              key={t.id}
              id={t.id}
              label={t.label}
              hidden={hiddenTypes.has(t.id)}
              onToggle={() => toggle(hiddenTypes, setHiddenTypes, t.id)}
            />
          ))}
        </div>
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Properties menu (by deal)</h2>
        <p className="text-sm text-gray-500 mb-4">Turn a deal off to hide it from the Properties dropdown and tabs.</p>
        <div className="space-y-2">
          {DEAL_TYPES.map((d) => (
            <Row
              key={d.id}
              id={d.id}
              label={d.label}
              hidden={hiddenDeals.has(d.id)}
              onToggle={() => toggle(hiddenDeals, setHiddenDeals, d.id)}
            />
          ))}
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#005E60] text-white rounded-lg hover:bg-[#004a4d] transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : null}
          Save changes
        </button>
        {savedAt && <span className="text-sm text-green-600">Saved.</span>}
      </div>
    </div>
  );
}
