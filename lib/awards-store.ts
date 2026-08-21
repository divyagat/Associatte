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

function sanitizeItem(raw: any, i: number): AwardItem {
  const icon: AwardIconName = AWARD_ICON_NAMES.includes(raw?.icon) ? raw.icon : 'Trophy';

  // Frame accent: accept explicit Tailwind class strings if present, otherwise
  // resolve from a preset theme id, otherwise fall back to the default theme.
  const themeById = AWARD_THEMES.find((t) => t.id === raw?.theme);
  const gradient = str(raw?.gradient, 200) || themeById?.gradient || DEFAULT_THEME.gradient;
  const glow = str(raw?.glow, 120) || themeById?.glow || DEFAULT_THEME.glow;
  const ribbon = str(raw?.ribbon, 200) || themeById?.ribbon || DEFAULT_THEME.ribbon;

  return {
    id: str(raw?.id, 60) || `award_${Date.now()}_${i}`,
    title: str(raw?.title, 120),
    subtitle: str(raw?.subtitle, 160),
    description: str(raw?.description, 600),
    image: str(raw?.image, 1000),
    icon,
    metric: str(raw?.metric, 40),
    year: str(raw?.year, 12),
    gradient,
    glow,
    ribbon,
  };
}

/** Coerce arbitrary/stored input into a clean AwardItem[] (drops incomplete rows). */
export function sanitizeAwardsList(raw: any): AwardItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map(sanitizeItem)
    .filter((a) => a.title && a.image)
    .slice(0, 60);
}

export async function getAllAwards(): Promise<AwardItem[]> {
  const data = await readJson<any>(AWARDS_FILE, []);
  return sanitizeAwardsList(data);
}

/** Replace the entire awards list (admin panel save). */
export async function saveAllAwards(list: any): Promise<AwardItem[]> {
  const clean = sanitizeAwardsList(list);
  await writeJson(AWARDS_FILE, clean);
  return clean;
}
