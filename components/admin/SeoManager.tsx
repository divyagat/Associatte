'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Check, Loader2, RotateCcw, Search } from 'lucide-react';
import type { SeoPageDef } from '@/lib/seo-pages';

export interface SeoDetailItem {
  label: string;
  path: string;
}
export interface SeoDetailGroup {
  key: string;
  label: string;
  items: SeoDetailItem[];
}
interface SeoOverride {
  title?: string;
  description?: string;
  keywords?: string;
}
type Overrides = Record<string, SeoOverride>;

interface SeoManagerProps {
  staticPages: SeoPageDef[];
  detailGroups: SeoDetailGroup[];
  initialOverrides: Overrides;
}

export default function SeoManager({ staticPages, detailGroups, initialOverrides }: SeoManagerProps) {
  const [tab, setTab] = useState<'pages' | 'detail'>('pages');
  const [overrides, setOverrides] = useState<Overrides>(initialOverrides);

  const setOne = (path: string, value: SeoOverride | undefined) =>
    setOverrides((prev) => {
      const next = { ...prev };
      if (value && Object.keys(value).length) next[path] = value;
      else delete next[path];
      return next;
    });

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {([
          ['pages', 'Site pages'],
          ['detail', 'Detail pages'],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              tab === key ? 'bg-white text-[#005E60] shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'pages' ? (
        <div className="space-y-3">
          {staticPages.map((page) => (
            <SeoRow
              key={page.path}
              label={page.label}
              path={page.path}
              defaultTitle={page.title}
              defaultDescription={page.description}
              defaultKeywords={page.keywords?.join(', ')}
              value={overrides[page.path]}
              onSaved={(v) => setOne(page.path, v)}
            />
          ))}
        </div>
      ) : (
        <DetailTab groups={detailGroups} overrides={overrides} onSaved={setOne} />
      )}
    </div>
  );
}

function DetailTab({
  groups,
  overrides,
  onSaved,
}: {
  groups: SeoDetailGroup[];
  overrides: Overrides;
  onSaved: (path: string, value: SeoOverride | undefined) => void;
}) {
  const [query, setQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState(groups[0]?.key ?? '');

  const group = groups.find((g) => g.key === activeGroup) ?? groups[0];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const items = group?.items ?? [];
    if (!q) return items.slice(0, 100);
    return items
      .filter((i) => i.label.toLowerCase().includes(q) || i.path.toLowerCase().includes(q))
      .slice(0, 100);
  }, [group, query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {groups.map((g) => (
          <button
            key={g.key}
            type="button"
            onClick={() => setActiveGroup(g.key)}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
              g.key === activeGroup
                ? 'border-[#005E60] text-[#005E60] bg-[#005E60]/5 font-medium'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            {g.label} <span className="text-gray-400">({g.items.length})</span>
          </button>
        ))}
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or URL…"
          className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
        />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-sm text-gray-400 italic">No pages match your search.</p>
        )}
        {filtered.map((item) => (
          <SeoRow
            key={item.path}
            label={item.label}
            path={item.path}
            value={overrides[item.path]}
            onSaved={(v) => onSaved(item.path, v)}
          />
        ))}
      </div>
    </div>
  );
}

function SeoRow({
  label,
  path,
  defaultTitle,
  defaultDescription,
  defaultKeywords,
  value,
  onSaved,
}: {
  label: string;
  path: string;
  defaultTitle?: string;
  defaultDescription?: string;
  defaultKeywords?: string;
  value?: SeoOverride;
  onSaved: (value: SeoOverride | undefined) => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(value?.title ?? '');
  const [description, setDescription] = useState(value?.description ?? '');
  const [keywords, setKeywords] = useState(value?.keywords ?? '');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  const hasOverride = !!(value && (value.title || value.description || value.keywords));

  const save = async () => {
    setBusy(true);
    setSaved(false);
    try {
      const res = await fetch('/api/admin/seo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, title, description, keywords }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Failed to save');
      }
      const next: SeoOverride = {};
      if (title.trim()) next.title = title.trim();
      if (description.trim()) next.description = description.trim();
      if (keywords.trim()) next.keywords = keywords.trim();
      onSaved(Object.keys(next).length ? next : undefined);
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setBusy(false);
    }
  };

  const reset = async () => {
    if (!confirm('Reset this page to its default SEO? Your custom title/description/keywords will be removed.')) return;
    setBusy(true);
    try {
      const res = await fetch('/api/admin/seo', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Failed to reset');
      }
      setTitle('');
      setDescription('');
      setKeywords('');
      onSaved(undefined);
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to reset');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 truncate">{label}</span>
            {hasOverride && (
              <span className="text-[10px] font-semibold uppercase tracking-wide text-[#005E60] bg-[#005E60]/10 rounded px-1.5 py-0.5">
                Custom
              </span>
            )}
          </div>
          <span className="text-xs text-gray-400 truncate">{path}</span>
        </div>
        <ChevronDown size={18} className={`text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 space-y-3 border-t border-gray-100">
          <Field
            label="Meta title"
            hint={`${title.length} chars${title.length > 60 ? ' — over ~60, may be truncated' : ''}`}
            hintWarn={title.length > 60}
          >
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={defaultTitle || 'Auto-generated default'}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
            />
          </Field>

          <Field
            label="Meta description"
            hint={`${description.length} chars${description.length > 160 ? ' — over ~160, may be truncated' : ''}`}
            hintWarn={description.length > 160}
          >
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={defaultDescription || 'Auto-generated default'}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60] resize-y"
            />
          </Field>

          <Field label="Meta keywords" hint="Comma-separated">
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder={defaultKeywords || 'keyword one, keyword two'}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
            />
          </Field>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={save}
              disabled={busy}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#005E60] text-white rounded-lg hover:bg-[#004a4c] transition-colors text-sm disabled:opacity-50"
            >
              {busy ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />} Save
            </button>
            {hasOverride && (
              <button
                type="button"
                onClick={reset}
                disabled={busy}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
              >
                <RotateCcw size={15} /> Reset to default
              </button>
            )}
            {saved && <span className="text-sm text-green-600 inline-flex items-center gap-1"><Check size={14} /> Saved &amp; live</span>}
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  hint,
  hintWarn,
  children,
}: {
  label: string;
  hint?: string;
  hintWarn?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {hint && <span className={`text-xs ${hintWarn ? 'text-amber-600' : 'text-gray-400'}`}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}
