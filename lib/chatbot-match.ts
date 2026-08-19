// lib/chatbot-match.ts
//
// Shared, client-safe types + matcher for the site's live-assistance chatbot.
// The admin panel edits this config; the widget reads it and answers visitor
// questions from the admin-entered Q&A. Kept free of server-only imports so both
// the browser widget and the API can use it.

import { tokenMatches } from './search';

/** One admin-entered question/answer entry. */
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  // Extra words that should also trigger this answer (typo-tolerant).
  keywords?: string[];
  // Unchecked entries are kept but not used to answer visitors.
  enabled?: boolean;
}

/** One quick-reply chip shown under the chat; clicking it opens the lead form. */
export interface QuickReply {
  text: string;
  project: string;
}

/** Admin-managed AI behaviour (search + assistant). Provider is 'rule-based'
 * today; the field exists so an LLM can be enabled later without code changes. */
export interface AiSettings {
  searchEnabled: boolean;   // AI understanding on the search bar + chatbot
  chatbotEnabled: boolean;  // show the chat widget at all
  maxResults: number;       // cap property cards returned
  provider: string;         // 'rule-based' (future: 'openai' | 'gemini' | …)
  systemPrompt: string;     // editable instructions, used when an LLM is wired up
}

/** Full admin-managed chatbot configuration. */
export interface ChatbotConfig {
  welcomeMessage: string;
  fallbackMessage: string;
  quickReplies: QuickReply[];
  faqs: FaqItem[];
  ai: AiSettings;
}

export const DEFAULT_AI_SETTINGS: AiSettings = {
  searchEnabled: true,
  chatbotEnabled: true,
  maxResults: 6,
  provider: 'rule-based',
  systemPrompt:
    "You are Associatte's real-estate assistant. Always search the available property database before recommending properties. Never invent property details. Help users find properties by location, budget, BHK, property type, status and amenities.",
};

export const DEFAULT_CHATBOT_CONFIG: ChatbotConfig = {
  welcomeMessage:
    "Hello! I'm your live assistance. I reply within a minute. How can I help you today?",
  fallbackMessage:
    "Let me connect you with a property expert who can help. Please share your details below.",
  quickReplies: [
    { text: '🏠 Pune Properties', project: 'Pune Properties' },
    { text: '🌆 Mumbai Properties', project: 'Mumbai Properties' },
    { text: '📅 Schedule Visit', project: 'Schedule Visit' },
    { text: '🎯 Expert Advice', project: 'Expert Advice' },
  ],
  faqs: [],
  ai: DEFAULT_AI_SETTINGS,
};

/**
 * Find the best admin-entered answer for a visitor's message, or `null` when
 * nothing matches confidently. Matching is typo-tolerant (reuses the site search
 * fuzzy engine) and needs at least half the query words to hit a FAQ so random
 * questions don't get a wrong answer.
 */
export function matchFaq(faqs: FaqItem[], query: string): FaqItem | null {
  const q = (query || '').trim().toLowerCase();
  if (!q) return null;
  const tokens = q.split(/\s+/).filter(Boolean);
  if (!tokens.length) return null;

  let best: { item: FaqItem; score: number } | null = null;
  for (const item of Array.isArray(faqs) ? faqs : []) {
    if (item.enabled === false) continue;
    if (!item.question || !item.answer) continue;
    const text = `${item.question} ${(item.keywords || []).join(' ')}`.toLowerCase();

    let hits = 0;
    for (const t of tokens) if (tokenMatches(text, t)) hits++;
    const ratio = hits / tokens.length;
    // Bonus when the whole question text contains the query verbatim.
    const score = ratio + (text.includes(q) ? 0.5 : 0);
    if (score > 0 && (!best || score > best.score)) best = { item, score };
  }

  return best && best.score >= 0.5 ? best.item : null;
}
