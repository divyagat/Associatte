'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, Plus, Trash2, Check } from 'lucide-react';
import {
  DEAL_TYPES, slugifyCategory, type PropertyType, type CategorySection,
} from '@/lib/categories';

interface CategoryVisibilityManagerProps {
  initialTypes: PropertyType[];
  initialHiddenTypes: string[];
  initialHiddenDeals: string[];
}

// Preset colours offered when creating a category (brand palette + a few extras).
const COLOR_PRESETS = ['#005E60', '#8B0000', '#F8C21C', '#1D4ED8', '#7C3AED', '#0891B2', '#DB2777'];

/**
 * Admin control for the category master list. Every change (add / delete / hide)
 * persists IMMEDIATELY — there is no separate "Save" step, so a change can never
 * be silently lost. Deal tabs (Resale / Rent) are built-in: hideable, not
 * deletable.
 */
export default function CategoryVisibilityManager({
  initialTypes,
  initialHiddenTypes,
  initialHiddenDeals,
}: CategoryVisibilityManagerProps) {
  const router = useRouter();
  const [types, setTypes] = useState<PropertyType[]>(initialTypes);
  const [hiddenTypes, setHiddenTypes] = useState<Set<string>>(new Set(initialHiddenTypes));
  const [hiddenDeals, setHiddenDeals] = useState<Set<string>>(new Set(initialHiddenDeals));
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  // Persist the given full state to site-config and re-sync from the response.
  const persist = async (
    nextTypes: PropertyType[],
    nextHiddenTypes: Set<string>,
    nextHiddenDeals: Set<string>,
  ) => {
    setBusy(true);
    setSaved(false);
    try {
      const res = await fetch('/api/site-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyTypes: nextTypes,
          hiddenTypes: Array.from(nextHiddenTypes),
          hiddenDeals: Array.from(nextHiddenDeals),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save');
      }
      const result = await res.json();
      setTypes(result.propertyTypes || nextTypes);
      setHiddenTypes(new Set(result.hiddenTypes || []));
      setHiddenDeals(new Set(result.hiddenDeals || []));
      setSaved(true);
      router.refresh();
      return true;
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save categories');
      return false;
    } finally {
      setBusy(false);
    }
  };

  const toggleTypeHidden = (id: string) => {
    const next = new Set(hiddenTypes);
    if (next.has(id)) next.delete(id); else next.add(id);
    persist(types, next, hiddenDeals);
  };

  const toggleDealHidden = (id: string) => {
    const next = new Set(hiddenDeals);
    if (next.has(id)) next.delete(id); else next.add(id);
    persist(types, hiddenTypes, next);
  };

  const addCategory = (label: string, color: string, section: CategorySection) => {
    const clean = label.trim();
    if (!clean) return;
    const id = slugifyCategory(clean);
    if (!id) return;
    if (types.some((t) => t.id === id)) {
      alert(`A category "${clean}" (${id}) already exists.`);
      return;
    }
    persist([...types, { id, label: clean, color, section }], hiddenTypes, hiddenDeals);
  };

  const deleteCategory = (id: string) => {
    if (!confirm('Delete this category? Listings keep their data but this tab/menu item is removed everywhere.')) return;
    const nextTypes = types.filter((t) => t.id !== id);
    const nextHiddenTypes = new Set(hiddenTypes); nextHiddenTypes.delete(id);
    const nextHiddenDeals = new Set(hiddenDeals); nextHiddenDeals.delete(id);
    persist(nextTypes, nextHiddenTypes, nextHiddenDeals);
  };

  const projectTypes = types.filter((t) => t.section === 'projects');
  const propertyTypes = types.filter((t) => t.section === 'properties');

  return (
    <div className="space-y-8">
      {/* Status line */}
      <div className="h-5 text-sm">
        {busy ? (
          <span className="inline-flex items-center gap-1.5 text-gray-500"><Loader2 size={14} className="animate-spin" /> Saving…</span>
        ) : saved ? (
          <span className="inline-flex items-center gap-1.5 text-green-600"><Check size={14} /> Saved. Changes are live.</span>
        ) : (
          <span className="text-gray-400">Changes save automatically.</span>
        )}
      </div>

      {/* Projects section */}
      <CategorySectionBlock
        title="Projects menu categories"
        subtitle="These drive the Projects dropdown and the /projects tabs (e.g. Residential, Commercial, Plots)."
        rows={projectTypes}
        hiddenSet={hiddenTypes}
        busy={busy}
        onToggleHidden={toggleTypeHidden}
        onDelete={deleteCategory}
        onAdd={(label, color) => addCategory(label, color, 'projects')}
      />

      {/* Properties section */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Properties menu categories</h2>
        <p className="text-sm text-gray-500 mb-4">
          Resale &amp; Rent are built-in (hideable). Below them add your own property types (e.g. Warehouse, Industry, Shops).
        </p>

        <div className="space-y-2 mb-4">
          {DEAL_TYPES.map((d) => (
            <Row
              key={d.id}
              color={d.color}
              label={d.label}
              badge="Built-in"
              hidden={hiddenDeals.has(d.id)}
              busy={busy}
              onToggle={() => toggleDealHidden(d.id)}
            />
          ))}
        </div>

        <div className="space-y-2">
          {propertyTypes.map((t) => (
            <Row
              key={t.id}
              color={t.color}
              label={t.label}
              hidden={hiddenDeals.has(t.id)}
              busy={busy}
              onToggle={() => toggleDealHidden(t.id)}
              onDelete={() => deleteCategory(t.id)}
            />
          ))}
          {propertyTypes.length === 0 && (
            <p className="text-sm text-gray-400 italic">No custom property types yet.</p>
          )}
        </div>

        <AddForm busy={busy} onAdd={(label, color) => addCategory(label, color, 'properties')} />
      </section>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function CategorySectionBlock({
  title, subtitle, rows, hiddenSet, busy, onToggleHidden, onDelete, onAdd,
}: {
  title: string;
  subtitle: string;
  rows: PropertyType[];
  hiddenSet: Set<string>;
  busy: boolean;
  onToggleHidden: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: (label: string, color: string) => void;
}) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-1">{title}</h2>
      <p className="text-sm text-gray-500 mb-4">{subtitle}</p>
      <div className="space-y-2">
        {rows.map((t) => (
          <Row
            key={t.id}
            color={t.color}
            label={t.label}
            hidden={hiddenSet.has(t.id)}
            busy={busy}
            onToggle={() => onToggleHidden(t.id)}
            onDelete={() => onDelete(t.id)}
          />
        ))}
        {rows.length === 0 && <p className="text-sm text-gray-400 italic">No categories yet.</p>}
      </div>
      <AddForm busy={busy} onAdd={onAdd} />
    </section>
  );
}

function Row({
  color, label, hidden, badge, busy, onToggle, onDelete,
}: {
  color: string;
  label: string;
  hidden: boolean;
  badge?: string;
  busy: boolean;
  onToggle: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 min-w-0">
        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
        {hidden ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-[#005E60]" />}
        <span className={`font-medium truncate ${hidden ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{label}</span>
        {badge && <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 bg-gray-100 rounded px-1.5 py-0.5">{badge}</span>}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={onToggle}
          disabled={busy}
          aria-pressed={!hidden}
          aria-label={hidden ? 'Show category' : 'Hide category'}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${hidden ? 'bg-gray-300' : 'bg-[#005E60]'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${hidden ? 'translate-x-1' : 'translate-x-6'}`} />
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            disabled={busy}
            aria-label="Delete category"
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

function AddForm({ busy, onAdd }: { busy: boolean; onAdd: (label: string, color: string) => void }) {
  const [label, setLabel] = useState('');
  const [color, setColor] = useState(COLOR_PRESETS[0]);

  const submit = () => {
    if (!label.trim()) return;
    onAdd(label, color);
    setLabel('');
    setColor(COLOR_PRESETS[0]);
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2">
      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); submit(); } }}
        placeholder="New category name (e.g. Villas)"
        className="flex-1 min-w-[180px] px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
      />
      <div className="flex items-center gap-1">
        {COLOR_PRESETS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setColor(c)}
            aria-label={`Choose colour ${c}`}
            className={`w-6 h-6 rounded-full border-2 transition-transform ${color === c ? 'border-gray-900 scale-110' : 'border-transparent'}`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={submit}
        disabled={busy}
        className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm disabled:opacity-50"
      >
        <Plus size={16} /> Add
      </button>
    </div>
  );
}
