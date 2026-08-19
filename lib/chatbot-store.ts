// lib/chatbot-store.ts
//
// Persists the admin-managed chatbot config (welcome/fallback text, quick
// replies and the Q&A knowledge base) to `data/chatbot.json` via the same
// blob-store as the rest of the data layer — so edits made in the admin panel go
// live on the site immediately with only the MongoDB connection required.

import { readJson, writeJson } from './blob-store';
import {
  DEFAULT_CHATBOT_CONFIG,
  DEFAULT_AI_SETTINGS,
  type ChatbotConfig,
  type AiSettings,
  type FaqItem,
  type QuickReply,
} from './chatbot-match';

const CHATBOT_FILE = 'data/chatbot.json';

function str(v: unknown, max: number): string {
  return String(v ?? '').trim().slice(0, max);
}

function sanitizeQuickReplies(raw: any): QuickReply[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((r) => ({ text: str(r?.text, 60), project: str(r?.project, 80) || str(r?.text, 80) }))
    .filter((r) => r.text)
    .slice(0, 8);
}

function sanitizeFaqs(raw: any): FaqItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((f, i) => {
      const keywords = Array.isArray(f?.keywords)
        ? f.keywords.map((k: unknown) => str(k, 40)).filter(Boolean).slice(0, 20)
        : typeof f?.keywords === 'string'
          ? f.keywords.split(',').map((k: string) => k.trim()).filter(Boolean).slice(0, 20)
          : [];
      return {
        id: str(f?.id, 40) || `faq-${Date.now()}-${i}`,
        question: str(f?.question, 300),
        answer: str(f?.answer, 2000),
        keywords,
        enabled: f?.enabled !== false,
      } as FaqItem;
    })
    // Keep only complete entries — an answer needs a question to match against.
    .filter((f) => f.question && f.answer)
    .slice(0, 200);
}

function sanitizeAi(raw: any): AiSettings {
  const d = DEFAULT_AI_SETTINGS;
  if (!raw || typeof raw !== 'object') return { ...d };
  const maxResults = Number(raw.maxResults);
  return {
    searchEnabled: raw.searchEnabled !== false,
    chatbotEnabled: raw.chatbotEnabled !== false,
    maxResults: Number.isFinite(maxResults) ? Math.min(24, Math.max(1, Math.round(maxResults))) : d.maxResults,
    // Only 'rule-based' is wired up today; ignore anything else until an LLM is added.
    provider: str(raw.provider, 40) || d.provider,
    systemPrompt: str(raw.systemPrompt, 4000) || d.systemPrompt,
  };
}

/** Coerce arbitrary/stored input into a clean, complete ChatbotConfig. */
function sanitize(raw: any): ChatbotConfig {
  return {
    welcomeMessage: str(raw?.welcomeMessage, 500) || DEFAULT_CHATBOT_CONFIG.welcomeMessage,
    fallbackMessage: str(raw?.fallbackMessage, 500) || DEFAULT_CHATBOT_CONFIG.fallbackMessage,
    quickReplies: raw?.quickReplies !== undefined
      ? sanitizeQuickReplies(raw.quickReplies)
      : DEFAULT_CHATBOT_CONFIG.quickReplies,
    faqs: sanitizeFaqs(raw?.faqs),
    ai: sanitizeAi(raw?.ai),
  };
}

export async function getChatbotConfig(): Promise<ChatbotConfig> {
  const data = await readJson<any>(CHATBOT_FILE, DEFAULT_CHATBOT_CONFIG);
  return sanitize(data);
}

export async function saveChatbotConfig(patch: any): Promise<ChatbotConfig> {
  const clean = sanitize(patch);
  await writeJson(CHATBOT_FILE, clean);
  return clean;
}
