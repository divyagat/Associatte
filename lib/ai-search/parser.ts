// lib/ai-search/parser.ts
//
// Rule-based natural-language → SearchCriteria parser. Handles English, Hindi
// and Hinglish ("Mujhe Pune Kothrud mein 2 BHK flat chahiye budget 90 lakh").
// No external API — deterministic, free, private. It's exposed behind a small
// interface so an LLM-backed parser can be swapped in later (admin AI provider)
// without touching the search bar / chatbot.

import type { SearchCriteria, CriteriaPatch } from './criteria';

export interface ParseContext {
  // Current conversation criteria — used to resolve relative changes like
  // "cheaper" / "budget badha do" into absolute amounts.
  context?: SearchCriteria;
  // Live facets from the DB so admin-added areas/builders are recognised too.
  facets?: { cities?: string[]; areas?: string[]; builders?: string[] };
}

// City name/alias → canonical city slug.
const CITY_ALIASES: [string, string][] = [
  ['navi mumbai', 'mumbai'], ['mumbai', 'mumbai'], ['bombay', 'mumbai'],
  ['pune', 'pune'], ['puna', 'pune'], ['pcmc', 'pune'],
  ['kdmc', 'kdmc'], ['kalyan', 'kdmc'], ['dombivli', 'kdmc'], ['dombivali', 'kdmc'],
];

// Known localities → city. Seeds recognition; live DB areas are also matched.
const LOCALITIES: [string, string][] = [
  ['wakad', 'pune'], ['hinjewadi', 'pune'], ['hinjawadi', 'pune'], ['baner', 'pune'],
  ['kharadi', 'pune'], ['sus', 'pune'], ['viman nagar', 'pune'], ['kondhwa', 'pune'],
  ['magarpatta', 'pune'], ['kothrud', 'pune'], ['aundh', 'pune'], ['hadapsar', 'pune'],
  ['wagholi', 'pune'], ['ravet', 'pune'], ['tathawade', 'pune'], ['punawale', 'pune'],
  ['balewadi', 'pune'], ['pimple saudagar', 'pune'], ['pimpri', 'pune'], ['chinchwad', 'pune'],
  ['kharghar', 'mumbai'], ['panvel', 'mumbai'], ['thane', 'mumbai'], ['andheri', 'mumbai'],
  ['bandra', 'mumbai'], ['worli', 'mumbai'], ['powai', 'mumbai'], ['vashi', 'mumbai'],
  ['nerul', 'mumbai'], ['belapur', 'mumbai'], ['ulwe', 'mumbai'], ['mulund', 'mumbai'],
  ['goregaon', 'mumbai'],
  ['ulhasnagar', 'kdmc'], ['ambarnath', 'kdmc'], ['badlapur', 'kdmc'],
  ['shil phata', 'kdmc'], ['murbad', 'kdmc'], ['titwala', 'kdmc'],
];

const WORD_NUMBERS: [string, number][] = [
  ['ek', 1], ['one', 1], ['do', 2], ['two', 2], ['teen', 3], ['three', 3],
  ['char', 4], ['chaar', 4], ['four', 4], ['paanch', 5], ['panch', 5], ['five', 5],
];

const CATEGORY_KEYWORDS: [string, RegExp][] = [
  ['commercial', /\b(commercial|office|offices|shop|shops|showroom|retail|dukan)\b/],
  ['warehouse', /\b(warehouse|warehousing|godown|storage|logistics)\b/],
  ['industry', /\b(industrial|industry|factory|manufacturing)\b/],
  ['plots', /\b(plot|plots|land|jameen|zameen|na[- ]?plot|parcel)\b/],
  ['residential', /\b(residential|flat|flats|apartment|apartments|villa|ghar|makan|home|homes|house|houses)\b/],
];

const READY_RE = /\b(ready to move|ready possession|ready-to-move|ready|move[- ]?in|immediate possession|possession ready|taiyaar)\b/;
const UNDER_CONSTRUCTION_RE = /\b(under[- ]?construction|pre[- ]?launch|prelaunch|new launch|newly launched|upcoming|launching)\b/;
const RENT_RE = /\b(rent|rental|lease|leasing|kiraya|kiraye|on rent)\b/;
const SALE_RE = /\b(buy|sale|resale|purchase|kharid|kharidna|kharidni|for sale)\b/;

const RESET_RE = /\b(reset|clear|start over|new search|naya search|naye sire|phir se|dubara|dobara|restart)\b/;
const CHEAPER_RE = /\b(cheaper|cheap|sasta|saste|kam budget|budget kam|lower|reduce|kam karo|kam kar do)\b/;
const COSTLIER_RE = /\b(costlier|expensive|mehnga|mehenga|zyada budget|budget zyada|higher|increase|badha|badhao|badha do|badhado|upar)\b/;

// Tokens dropped when computing leftover free-text keywords.
const STOPWORDS = new Set([
  'i', 'me', 'mujhe', 'muze', 'mereko', 'mera', 'meri', 'my', 'need', 'want', 'looking',
  'chahiye', 'chaiye', 'chahie', 'dhundh', 'dikhao', 'dikha', 'show', 'find', 'search',
  'property', 'properties', 'in', 'at', 'near', 'paas', 'ke', 'ki', 'ka', 'me', 'mein', 'mai',
  'side', 'around', 'about', 'approx', 'under', 'below', 'upto', 'up', 'to', 'within', 'tak',
  'andar', 'budget', 'price', 'rate', 'hai', 'ho', 'and', 'or', 'the', 'for',
  'with', 'of', 'is', 'are', 'please', 'kar', 'do', 'karo', 'kardo', 'best', 'good', 'nice',
  'family', 'investment', 'ready', 'possession', 'move', 'lakh', 'lac', 'lakhs', 'crore', 'cr',
  'crores', 'bhk', 'flat', 'flats', 'apartment', 'apartments', 'rs', 'inr', 'per', 'sq', 'ft',
  // Recognised vocabulary — kept out of leftover keywords so they never
  // over-filter the fuzzy match.
  'bedroom', 'bedrooms', 'bed', 'room', 'rk', 'residential', 'commercial', 'office', 'offices',
  'shop', 'shops', 'showroom', 'retail', 'villa', 'house', 'houses', 'home', 'homes', 'ghar',
  'makan', 'plot', 'plots', 'land', 'jameen', 'zameen', 'warehouse', 'godown', 'storage',
  'industrial', 'industry', 'factory', 'rent', 'rental', 'lease', 'kiraya', 'buy', 'sale',
  'resale', 'purchase', 'kharid', 'construction', 'launch', 'sasta', 'saste', 'cheap', 'cheaper',
  'mehnga', 'mehenga', 'expensive', 'zyada', 'kam', 'upcoming', 'upto', 'looking', 'suggest',
]);

// Word numbers that precede a currency unit ("one crore", "do lakh").
const BUDGET_WORD_NUMS: Record<string, string> = {
  one: '1', two: '2', three: '3', four: '4', five: '5',
  ek: '1', do: '2', teen: '3', char: '4', chaar: '4', paanch: '5', panch: '5',
};

const NUM_UNIT_RE = /(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(lakhs?|lac|crores?|cr|k|l)\b/gi;

function unitMultiplier(unit: string): number {
  const u = unit.toLowerCase();
  if (u.startsWith('cr') || u.startsWith('crore')) return 1e7;
  if (u === 'k') return 1e3;
  return 1e5; // lakh / lac / l
}

function includesWord(text: string, phrase: string): boolean {
  // Whole-phrase match with word boundaries (phrase may contain spaces).
  const re = new RegExp(`(?:^|\\W)${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\W|$)`, 'i');
  return re.test(text);
}

/** Detect an explicit "start over" instruction so the caller can clear context. */
export function detectReset(text: string): boolean {
  return RESET_RE.test((text || '').toLowerCase());
}

/**
 * Parse free text into a criteria patch. Relative budget words ("cheaper",
 * "badha do") are resolved against `ctx.context` into absolute amounts so the
 * result is a plain patch the caller can merge.
 */
export function parseRequirement(text: string, ctx: ParseContext = {}): CriteriaPatch {
  let t = ` ${(text || '').toLowerCase().replace(/[,]/g, ' ')} `;
  // Normalise "one crore" / "do lakh" → "1 crore" / "2 lakh" so budget parsing
  // (which expects digits) catches spoken/typed word amounts.
  t = t.replace(
    /\b(one|two|three|four|five|ek|do|teen|char|chaar|paanch|panch)\s+(lakhs?|lac|crores?|cr)\b/g,
    (_m, w, u) => ` ${BUDGET_WORD_NUMS[w]} ${u} `,
  );
  const out: CriteriaPatch = {};
  const consumed: string[] = [];

  // --- City (longest alias first so "navi mumbai" beats "mumbai") ---
  for (const [alias, city] of [...CITY_ALIASES].sort((a, b) => b[0].length - a[0].length)) {
    if (includesWord(t, alias)) { out.city = city; consumed.push(alias); break; }
  }

  // --- Location: known localities, then live DB areas ---
  const areaCandidates: [string, string | null][] = [
    ...LOCALITIES.map(([n, c]) => [n, c] as [string, string]),
    ...((ctx.facets?.areas || []).map((a) => [a.toLowerCase(), null] as [string, null])),
  ].sort((a, b) => b[0].length - a[0].length);
  for (const [name, city] of areaCandidates) {
    if (name && includesWord(t, name)) {
      out.location = name.replace(/\b\w/g, (m) => m.toUpperCase());
      if (!out.city && city) out.city = city;
      consumed.push(name);
      break;
    }
  }

  // --- BHK ---
  const bhkDigit = t.match(/(\d+)\s*(?:bhk|bedroom|bed\s?room|beds?|rk)\b/);
  if (bhkDigit) {
    out.bhk = parseInt(bhkDigit[1], 10);
  } else {
    for (const [word, n] of WORD_NUMBERS) {
      if (new RegExp(`\\b${word}\\s*(?:bhk|bedroom|bed|rk|flat)\\b`).test(t)) { out.bhk = n; break; }
    }
  }

  // --- Budget ---
  const amounts: number[] = [];
  let m: RegExpExecArray | null;
  NUM_UNIT_RE.lastIndex = 0;
  while ((m = NUM_UNIT_RE.exec(t)) !== null) {
    amounts.push(parseFloat(m[1]) * unitMultiplier(m[2]));
  }
  const wantsMin = /\b(above|over|more than|minimum|at least|se zyada|se upar|se jyada)\b/.test(t);
  const wantsAround = /\b(around|about|approx|approximately|lagbhag|karib|kareeb|near about)\b/.test(t);
  const isRange = /\b(between|se\s|to\b|-)\b/.test(t) && amounts.length >= 2;

  if (amounts.length) {
    if (isRange) {
      const [a, b] = [amounts[0], amounts[1]].sort((x, y) => x - y);
      out.minBudget = a; out.maxBudget = b;
    } else if (wantsAround) {
      out.minBudget = Math.round(amounts[0] * 0.85);
      out.maxBudget = Math.round(amounts[0] * 1.15);
    } else if (wantsMin) {
      out.minBudget = amounts[0];
    } else {
      out.maxBudget = amounts[0]; // "under 90 lakh" and a bare budget both cap the max
    }
  } else {
    // Relative change with no explicit amount — resolve against current budget.
    const prevMax = ctx.context?.maxBudget;
    if (CHEAPER_RE.test(t) && prevMax) out.maxBudget = Math.round(prevMax * 0.8);
    else if (COSTLIER_RE.test(t) && prevMax) out.maxBudget = Math.round(prevMax * 1.25);
  }

  // --- Category ---
  for (const [cat, re] of CATEGORY_KEYWORDS) {
    if (re.test(t)) { out.category = cat; break; }
  }
  // A BHK almost always implies a residential requirement.
  if (!out.category && out.bhk) out.category = 'residential';

  // --- Deal type ---
  if (RENT_RE.test(t)) out.dealType = 'rent';
  else if (SALE_RE.test(t)) out.dealType = 'sale';

  // --- Construction status ---
  if (UNDER_CONSTRUCTION_RE.test(t)) out.status = 'under-construction';
  else if (READY_RE.test(t)) out.status = 'ready';

  // --- Leftover keywords (builder names, amenities like "pool", "metro") ---
  const builderSet = new Set((ctx.facets?.builders || []).map((b) => b.toLowerCase()));
  const consumedText = consumed.join(' ');
  const leftover = t
    .replace(NUM_UNIT_RE, ' ')
    .split(/[^a-z0-9]+/i)
    .map((w) => w.trim())
    .filter((w) =>
      w.length >= 3 &&
      !/^\d+$/.test(w) &&
      !STOPWORDS.has(w) &&
      !consumedText.includes(w),
    );
  // Keep tokens that look meaningful (known builder word, or non-generic term).
  const kept = leftover.filter((w) => builderSet.has(w) || w.length >= 4);
  if (kept.length) out.keywords = kept.join(' ');

  return out;
}
