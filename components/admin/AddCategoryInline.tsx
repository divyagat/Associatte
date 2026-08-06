'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Loader2, X, Trash2, Tags } from 'lucide-react';
import { slugifyCategory, type PropertyType, type CategorySection } from '@/lib/categories';

// Preset colours offered when creating a category (brand palette + a few extras).
const COLOR_PRESETS = ['#005E60', '#8B0000', '#F8C21C', '#1D4ED8', '#7C3AED', '#0891B2', '#DB2777'];

interface AddCategoryInlineProps {
  /** The full category master list (both sections) — sent back on every change. */
  allTypes: PropertyType[];
  /** Which section this page manages (new categories are added here). */
  section: CategorySection;
}

/**
 * Full inline category manager for the admin Projects / Properties list pages.
 * Add AND delete happen immediately (single click, no separate Save) — each
 * change persists the whole master list to site-config and refreshes the page,
 * so tabs, form dropdowns and the public site update everywhere at once.
 */
export default function AddCategoryInline({ allTypes, section }: AddCategoryInlineProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [color, setColor] = useState(COLOR_PRESETS[0]);
  const [busy, setBusy] = useState(false);

  const sectionCats = allTypes.filter((t) => t.section === section);

  // Persist a new full master list, then refresh so everything re-reads it.
  const persist = async (next: PropertyType[]) => {
    setBusy(true);
    try {
      const res = await fetch('/api/site-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyTypes: next }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Request failed');
      }
      router.refresh();
      return true;
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update categories');
      return false;
    } finally {
      setBusy(false);
    }
  };

  const addCategory = async () => {
    const clean = label.trim();
    if (!clean) return;
    const id = slugifyCategory(clean);
    if (!id) return;
    if (allTypes.some((t) => t.id === id)) {
      alert(`A category "${clean}" (${id}) already exists.`);
      return;
    }
    const ok = await persist([...allTypes, { id, label: clean, color, section }]);
    if (ok) { setLabel(''); setColor(COLOR_PRESETS[0]); }
  };

  const deleteCategory = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? Existing listings keep their data, but this tab is removed everywhere.`)) return;
    await persist(allTypes.filter((t) => t.id !== id));
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-[#005E60] text-[#005E60] rounded-lg hover:bg-[#005E60]/5 transition-colors font-medium"
      >
        <Tags size={18} /> Manage Categories
      </button>
    );
  }

  return (
    <div className="w-full sm:w-[420px] bg-white border border-gray-200 rounded-xl shadow-sm p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Tags size={16} /> {section === 'projects' ? 'Project' : 'Property'} categories
        </h3>
        <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg">
          <X size={16} />
        </button>
      </div>

      {/* Existing categories with delete */}
      <div className="flex flex-wrap gap-2">
        {sectionCats.length === 0 && <span className="text-sm text-gray-400 italic">No categories yet.</span>}
        {sectionCats.map((t) => (
          <span
            key={t.id}
            className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-lg text-sm font-medium"
            style={{ backgroundColor: `${t.color}22`, color: t.color }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
            {t.label}
            <button
              type="button"
              onClick={() => deleteCategory(t.id, t.label)}
              disabled={busy}
              aria-label={`Delete ${t.label}`}
              className="p-0.5 rounded hover:bg-black/10 disabled:opacity-50"
            >
              <Trash2 size={13} />
            </button>
          </span>
        ))}
      </div>

      {/* Add new */}
      <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCategory(); } }}
          placeholder="New category name"
          className="flex-1 min-w-[140px] px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
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
          onClick={addCategory}
          disabled={busy}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#005E60] text-white rounded-lg hover:bg-[#004a4d] transition-colors text-sm disabled:opacity-50"
        >
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Add
        </button>
      </div>
    </div>
  );
}
