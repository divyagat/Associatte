// lib/awards-store.ts
//
// Persists the admin-managed Awards & Recognition list to `data/awards.json`
// via the same blob-store as the rest of the data layer (committed seed file →
// MongoDB after the first write). Public pages read it through /api/awards; the
// admin panel (/admin/awards) replaces the whole list with a single PUT.

import { readJson, writeJson } from './blob-store';
import {
  AWARD_ICON_NAMES,
  AWARD_THEMES,
  type AwardItem,
  type AwardIconName,
} from './awards-data';

const AWARDS_FILE = 'data/awards.json';

const DEFAULT_THEME = AWARD_THEMES[0];

function str(v: unknown, max: number): string {
  return String(v ?? '').trim().slice(0, max);
}

/** Narrow arbitrary/stored input into a plain object we can safely index. */
function toRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === 'object' ? (v as Record<string, unknown>) : {};
}

function sanitizeItem(raw: unknown, i: number): AwardItem {
  const rec = toRecord(raw);
  const icon: AwardIconName = AWARD_ICON_NAMES.includes(rec.icon as AwardIconName) ? (rec.icon as AwardIconName) : 'Trophy';

  // Frame accent: accept explicit Tailwind class strings if present, otherwise
  // resolve from a preset theme id, otherwise fall back to the default theme.
  const themeById = AWARD_THEMES.find((t) => t.id === rec.theme);
  const gradient = str(rec.gradient, 200) || themeById?.gradient || DEFAULT_THEME.gradient;
  const glow = str(rec.glow, 120) || themeById?.glow || DEFAULT_THEME.glow;
  const ribbon = str(rec.ribbon, 200) || themeById?.ribbon || DEFAULT_THEME.ribbon;

  return {
    id: str(rec.id, 60) || `award_${Date.now()}_${i}`,
    title: str(rec.title, 120),
    subtitle: str(rec.subtitle, 160),
    description: str(rec.description, 600),
    image: str(rec.image, 1000),
    icon,
    metric: str(rec.metric, 40),
    year: str(rec.year, 12),
    gradient,
    glow,
    ribbon,
  };
}

/** Coerce arbitrary/stored input into a clean AwardItem[] (drops incomplete rows). */
export function sanitizeAwardsList(raw: unknown): AwardItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map(sanitizeItem)
    .filter((a) => a.title && a.image)
    .slice(0, 60);
}

export async function getAllAwards(): Promise<AwardItem[]> {
  const data = await readJson<unknown>(AWARDS_FILE, []);
  return sanitizeAwardsList(data);
}

/** Replace the entire awards list (admin panel save). */
export async function saveAllAwards(list: unknown): Promise<AwardItem[]> {
  const clean = sanitizeAwardsList(list);
  await writeJson(AWARDS_FILE, clean);
  return clean;
}
