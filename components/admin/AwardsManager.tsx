'use client';

/* eslint-disable @next/next/no-img-element -- admin previews render arbitrary uploaded/remote image URLs that next/image can't optimize */

import { useState } from 'react';
import {
  Plus, Pencil, Trash2, X, Upload, Loader2,
  Trophy, Award, Medal, Star, Crown, TrendingUp, Building, Users, ShieldCheck,
} from 'lucide-react';
import { uploadImage } from '@/lib/upload-image';
import {
  AWARD_ICON_NAMES, AWARD_THEMES,
  type AwardItem, type AwardIconName,
} from '@/lib/awards-data';

const ICON: Record<AwardIconName, React.ComponentType<{ className?: string; size?: number }>> = {
  Trophy, Award, Medal, Star, Crown, TrendingUp, Building, Users, ShieldCheck,
};

type Draft = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  metric: string;
  year: string;
  icon: AwardIconName;
  theme: string;
};

function themeIdOf(item: AwardItem): string {
  return AWARD_THEMES.find((t) => t.gradient === item.gradient)?.id || AWARD_THEMES[0].id;
}

function blankDraft(): Draft {
  return {
    id: '', title: '', subtitle: '', description: '', image: '',
    metric: '', year: String(new Date().getFullYear()), icon: 'Trophy', theme: AWARD_THEMES[0].id,
  };
}

function toDraft(a: AwardItem): Draft {
  return {
    id: a.id, title: a.title, subtitle: a.subtitle, description: a.description,
    image: a.image, metric: a.metric, year: a.year, icon: a.icon, theme: themeIdOf(a),
  };
}

export default function AwardsManager({ initialItems }: { initialItems: AwardItem[] }) {
  const [items, setItems] = useState<AwardItem[]>(initialItems);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const startAdd = () => { setDraft(blankDraft()); setIsNew(true); setError(null); };
  const startEdit = (a: AwardItem) => { setDraft(toDraft(a)); setIsNew(false); setError(null); };
  const cancel = () => { setDraft(null); setError(null); };
  const set = (patch: Partial<Draft>) => setDraft((d) => (d ? { ...d, ...patch } : d));

  async function persist(next: AwardItem[]) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/awards', {
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
    if (!draft.image.trim()) { setError('An award photo / certificate image is required.'); return; }

    const theme = AWARD_THEMES.find((t) => t.id === draft.theme) || AWARD_THEMES[0];
    const clean: AwardItem = {
      id: draft.id || `award_${Date.now()}`,
      title: draft.title.trim(),
      subtitle: draft.subtitle.trim(),
      description: draft.description.trim(),
      image: draft.image.trim(),
      icon: draft.icon,
      metric: draft.metric.trim(),
      year: draft.year.trim(),
      gradient: theme.gradient,
      glow: theme.glow,
      ribbon: theme.ribbon,
    };

    const next = isNew ? [...items, clean] : items.map((it) => (it.id === clean.id ? clean : it));
    const ok = await persist(next);
    if (ok) setDraft(null);
  }

  async function remove(id: string) {
    if (!confirm('Delete this award? This cannot be undone.')) return;
    await persist(items.filter((it) => it.id !== id));
  }

  const DraftIcon = draft ? ICON[draft.icon] : Trophy;

  return (
    <div className="space-y-6">
      {(error || notice) && (
        <div className={`rounded-lg px-4 py-3 text-sm ${error ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {error || notice}
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-gray-500">{items.length} award{items.length === 1 ? '' : 's'}</p>
        {!draft && (
          <button onClick={startAdd} className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#005E60] text-white font-semibold rounded-lg hover:bg-[#004a4d] transition-colors">
            <Plus size={18} /> Add Award
          </button>
        )}
      </div>

      {/* Editor */}
      {draft && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">{isNew ? 'Add Award' : 'Edit Award'}</h2>
            <button onClick={cancel} className="p-2 text-gray-400 hover:text-gray-700" aria-label="Close"><X size={20} /></button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[240px,1fr] gap-6">
            {/* Framed photo preview + upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Award photo / certificate</label>
              <div className="rounded-md bg-gradient-to-b from-[#e8c877] via-[#c8992f] to-[#8a6d1b] p-2.5 shadow-lg">
                <div className="bg-[#faf7ef] p-1.5">
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 border border-black/10 flex items-center justify-center">
                    {draft.image ? (
                      <img src={draft.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <DraftIcon className="text-gray-300" size={40} />
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <Loader2 className="animate-spin text-[#005E60]" size={24} />
                      </div>
                    )}
                  </div>
                </div>
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
              <div className="grid grid-cols-2 gap-4">
                <Field label="Title">
                  <input value={draft.title} onChange={(e) => set({ title: e.target.value })} className={inputCls} placeholder="e.g. Best Performance" />
                </Field>
                <Field label="Subtitle">
                  <input value={draft.subtitle} onChange={(e) => set({ subtitle: e.target.value })} className={inputCls} placeholder="e.g. Sales Excellence Award" />
                </Field>
              </div>
              <Field label="Description">
                <textarea value={draft.description} onChange={(e) => set({ description: e.target.value })} rows={3} className={inputCls} placeholder="What the award recognizes" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Metric / badge">
                  <input value={draft.metric} onChange={(e) => set({ metric: e.target.value })} className={inputCls} placeholder="e.g. Top 1%, Winner" />
                </Field>
                <Field label="Year">
                  <input value={draft.year} onChange={(e) => set({ year: e.target.value })} className={inputCls} placeholder="2024" />
                </Field>
              </div>

              <Field label="Icon (nameplate)">
                <div className="flex flex-wrap gap-2">
                  {AWARD_ICON_NAMES.map((name) => {
                    const Ic = ICON[name];
                    const active = draft.icon === name;
                    return (
                      <button
                        type="button"
                        key={name}
                        onClick={() => set({ icon: name })}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-colors ${active ? 'border-[#005E60] bg-[#005E60]/10 text-[#005E60]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                        aria-label={name}
                      >
                        <Ic size={18} />
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field label="Frame accent">
                <div className="flex flex-wrap gap-2">
                  {AWARD_THEMES.map((t) => {
                    const active = draft.theme === t.id;
                    return (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => set({ theme: t.id })}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${active ? 'border-[#005E60] bg-[#005E60]/5 font-semibold' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <span className={`w-4 h-4 rounded-full bg-gradient-to-r ${t.gradient}`} />
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </Field>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button onClick={cancel} className="px-4 py-2.5 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors">Cancel</button>
            <button onClick={saveDraft} disabled={saving || uploading} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#005E60] text-white font-semibold rounded-lg hover:bg-[#004a4d] transition-colors disabled:opacity-60">
              {saving && <Loader2 className="animate-spin" size={16} />}
              {isNew ? 'Add Award' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* List (mini photo frames) */}
      {!draft && (
        items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500">
            No awards yet. Click “Add Award” to add your first framed recognition.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {items.map((a) => {
              const Ic = ICON[a.icon] || Trophy;
              return (
                <div key={a.id} className="group">
                  <div className="rounded-md bg-gradient-to-b from-[#e8c877] via-[#c8992f] to-[#8a6d1b] p-2 shadow-md">
                    <div className="bg-[#faf7ef] p-1.5">
                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 border border-black/10">
                        <img src={a.image} alt={a.title} className="absolute inset-0 w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="pt-1.5 pb-0.5 text-center">
                      <p className="text-[11px] font-bold text-[#5c4522] leading-tight truncate flex items-center justify-center gap-1">
                        <Ic size={11} /> {a.title}
                      </p>
                      <p className="text-[10px] text-[#7a6540]">{a.year}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <button onClick={() => startEdit(a)} className="flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                      <Pencil size={13} /> Edit
                    </button>
                    <button onClick={() => remove(a.id)} disabled={saving} className="inline-flex items-center justify-center px-2.5 py-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50" aria-label="Delete">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
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
