'use client';

/* eslint-disable @next/next/no-img-element -- admin previews render arbitrary uploaded/remote image URLs that next/image can't optimize */

import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Upload, Loader2, ExternalLink, Newspaper } from 'lucide-react';
import { uploadImage } from '@/lib/upload-image';
import type { NewsItem } from '@/lib/news-data';

const CITIES: NewsItem['city'][] = ['Pune', 'Mumbai', 'KDMC', 'National'];

type Draft = {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  city: NewsItem['city'];
  source: string;
  date: string;
  url: string;
};

function todayLabel(): string {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function blankDraft(): Draft {
  return {
    id: '', title: '', excerpt: '', image: '', category: '',
    city: 'National', source: 'Associatte Research', date: todayLabel(), url: '',
  };
}

function toDraft(n: NewsItem): Draft {
  return { ...blankDraft(), ...n, url: n.url ?? '' };
}

export default function NewsManager({ initialItems }: { initialItems: NewsItem[] }) {
  const [items, setItems] = useState<NewsItem[]>(initialItems);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const startAdd = () => { setDraft(blankDraft()); setIsNew(true); setError(null); };
  const startEdit = (n: NewsItem) => { setDraft(toDraft(n)); setIsNew(false); setError(null); };
  const cancel = () => { setDraft(null); setError(null); };

  const set = (patch: Partial<Draft>) => setDraft((d) => (d ? { ...d, ...patch } : d));

  async function persist(next: NewsItem[]) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/news', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error((data && data.error) || 'Failed to save');
      setItems(Array.isArray(data) ? data : next);
      setNotice('Saved. Changes are live on the site.');
      setTimeout(() => setNotice(null), 3000);
      return true;
    } catch (e: any) {
      setError(e?.message || 'Failed to save');
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleImageFile(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadImage(file);
      set({ image: url });
    } catch (e: any) {
      setError(e?.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function saveDraft() {
    if (!draft) return;
    if (!draft.title.trim()) { setError('Title is required.'); return; }
    if (!draft.image.trim()) { setError('An image is required.'); return; }

    const clean: NewsItem = {
      id: draft.id || `news_${Date.now()}`,
      title: draft.title.trim(),
      excerpt: draft.excerpt.trim(),
      image: draft.image.trim(),
      category: draft.category.trim() || 'News',
      city: draft.city,
      source: draft.source.trim() || 'Associatte',
      date: draft.date.trim() || todayLabel(),
      url: draft.url.trim() || undefined,
    };

    const next = isNew
      ? [clean, ...items]
      : items.map((it) => (it.id === clean.id ? clean : it));

    const ok = await persist(next);
    if (ok) setDraft(null);
  }

  async function remove(id: string) {
    if (!confirm('Delete this news item? This cannot be undone.')) return;
    await persist(items.filter((it) => it.id !== id));
  }

  return (
    <div className="space-y-6">
      {(error || notice) && (
        <div className={`rounded-lg px-4 py-3 text-sm ${error ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {error || notice}
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-gray-500">{items.length} item{items.length === 1 ? '' : 's'}</p>
        {!draft && (
          <button
            onClick={startAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#005E60] text-white font-semibold rounded-lg hover:bg-[#004a4d] transition-colors"
          >
            <Plus size={18} /> Add News
          </button>
        )}
      </div>

      {/* Editor */}
      {draft && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">{isNew ? 'Add News Item' : 'Edit News Item'}</h2>
            <button onClick={cancel} className="p-2 text-gray-400 hover:text-gray-700" aria-label="Close"><X size={20} /></button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[220px,1fr] gap-6">
            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
              <div className="relative aspect-[16/10] rounded-lg border border-dashed border-gray-300 overflow-hidden bg-gray-50 flex items-center justify-center">
                {draft.image ? (
                  <img src={draft.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <Newspaper className="text-gray-300" size={40} />
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                    <Loader2 className="animate-spin text-[#005E60]" size={24} />
                  </div>
                )}
              </div>
              <label className="mt-2 inline-flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
                <Upload size={16} /> Upload
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageFile(e.target.files?.[0] ?? null)} />
              </label>
              <input
                type="url"
                value={draft.image}
                onChange={(e) => set({ image: e.target.value })}
                placeholder="…or paste an image URL"
                className="mt-2 w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005E60]/30 focus:border-[#005E60] outline-none"
              />
            </div>

            {/* Fields */}
            <div className="space-y-4">
              <Field label="Title">
                <input value={draft.title} onChange={(e) => set({ title: e.target.value })} className={inputCls} placeholder="Headline" />
              </Field>
              <Field label="Excerpt">
                <textarea value={draft.excerpt} onChange={(e) => set({ excerpt: e.target.value })} rows={3} className={inputCls} placeholder="Short summary shown on the card" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Category">
                  <input value={draft.category} onChange={(e) => set({ category: e.target.value })} className={inputCls} placeholder="e.g. Infrastructure" />
                </Field>
                <Field label="City">
                  <select value={draft.city} onChange={(e) => set({ city: e.target.value as NewsItem['city'] })} className={inputCls}>
                    {CITIES.map((c) => <option key={c} value={c}>{c === 'National' ? 'National (all cities)' : c}</option>)}
                  </select>
                </Field>
                <Field label="Source">
                  <input value={draft.source} onChange={(e) => set({ source: e.target.value })} className={inputCls} placeholder="e.g. Associatte Research" />
                </Field>
                <Field label="Date">
                  <input value={draft.date} onChange={(e) => set({ date: e.target.value })} className={inputCls} placeholder="Aug 18, 2026" />
                </Field>
              </div>
              <Field label="External link (optional)">
                <input value={draft.url} onChange={(e) => set({ url: e.target.value })} className={inputCls} placeholder="https://… (opens in a new tab; leave blank to link to /news)" />
              </Field>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button onClick={cancel} className="px-4 py-2.5 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors">Cancel</button>
            <button
              onClick={saveDraft}
              disabled={saving || uploading}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#005E60] text-white font-semibold rounded-lg hover:bg-[#004a4d] transition-colors disabled:opacity-60"
            >
              {saving && <Loader2 className="animate-spin" size={16} />}
              {isNew ? 'Add Item' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {!draft && (
        items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500">
            No news yet. Click “Add News” to publish your first story.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((n) => (
              <div key={n.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
                <div className="relative aspect-[16/10] bg-gray-100">
                  <img src={n.image} alt={n.title} className="absolute inset-0 w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 text-[10px] font-semibold text-white bg-[#005E60]/90 px-2 py-0.5 rounded-full">{n.category}</span>
                  <span className="absolute top-2 right-2 text-[10px] font-semibold text-[#8B0000] bg-[#F8C21C] px-2 py-0.5 rounded-full">{n.city === 'National' ? 'India' : n.city}</span>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">{n.title}</h3>
                  <p className="text-xs text-gray-500 mb-3 flex items-center gap-1.5">
                    {n.date} · {n.source}
                    {n.url && <ExternalLink size={11} className="text-[#005E60]" />}
                  </p>
                  <div className="mt-auto flex items-center gap-2">
                    <button onClick={() => startEdit(n)} className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                      <Pencil size={14} /> Edit
                    </button>
                    <button onClick={() => remove(n.id)} disabled={saving} className="inline-flex items-center justify-center px-3 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50" aria-label="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

const inputCls =
  'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005E60]/30 focus:border-[#005E60] outline-none text-sm';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1.5">{label}</span>
      {children}
    </label>
  );
}
