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

/** Narrow arbitrary/stored input into a plain object we can safely index. */
function toRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === 'object' ? (v as Record<string, unknown>) : {};
}

function sanitizeQuickReplies(raw: unknown): QuickReply[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((r) => {
      const rec = toRecord(r);
      return { text: str(rec.text, 60), project: str(rec.project, 80) || str(rec.text, 80) };
    })
    .filter((r) => r.text)
    .slice(0, 8);
}

function sanitizeFaqs(raw: unknown): FaqItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((f, i) => {
      const rec = toRecord(f);
      const keywords = Array.isArray(rec.keywords)
        ? rec.keywords.map((k: unknown) => str(k, 40)).filter(Boolean).slice(0, 20)
        : typeof rec.keywords === 'string'
          ? rec.keywords.split(',').map((k: string) => k.trim()).filter(Boolean).slice(0, 20)
          : [];
      return {
        id: str(rec.id, 40) || `faq-${Date.now()}-${i}`,
        question: str(rec.question, 300),
        answer: str(rec.answer, 2000),
        keywords,
        enabled: rec.enabled !== false,
      } as FaqItem;
    })
    // Keep only complete entries — an answer needs a question to match against.
    .filter((f) => f.question && f.answer)
    .slice(0, 200);
}

function sanitizeAi(raw: unknown): AiSettings {
  const d = DEFAULT_AI_SETTINGS;
  if (!raw || typeof raw !== 'object') return { ...d };
  const rec = raw as Record<string, unknown>;
  const maxResults = Number(rec.maxResults);
  return {
    searchEnabled: rec.searchEnabled !== false,
    chatbotEnabled: rec.chatbotEnabled !== false,
    maxResults: Number.isFinite(maxResults) ? Math.min(24, Math.max(1, Math.round(maxResults))) : d.maxResults,
    // Only 'rule-based' is wired up today; ignore anything else until an LLM is added.
    provider: str(rec.provider, 40) || d.provider,
    systemPrompt: str(rec.systemPrompt, 4000) || d.systemPrompt,
  };
}

/** Coerce arbitrary/stored input into a clean, complete ChatbotConfig. */
function sanitize(raw: unknown): ChatbotConfig {
  const rec = toRecord(raw);
  return {
    welcomeMessage: str(rec.welcomeMessage, 500) || DEFAULT_CHATBOT_CONFIG.welcomeMessage,
    fallbackMessage: str(rec.fallbackMessage, 500) || DEFAULT_CHATBOT_CONFIG.fallbackMessage,
    quickReplies: rec.quickReplies !== undefined
      ? sanitizeQuickReplies(rec.quickReplies)
      : DEFAULT_CHATBOT_CONFIG.quickReplies,
    faqs: sanitizeFaqs(rec.faqs),
    ai: sanitizeAi(rec.ai),
  };
}

export async function getChatbotConfig(): Promise<ChatbotConfig> {
  const data = await readJson<unknown>(CHATBOT_FILE, DEFAULT_CHATBOT_CONFIG);
  return sanitize(data);
}

export async function saveChatbotConfig(patch: unknown): Promise<ChatbotConfig> {
  const clean = sanitize(patch);
  await writeJson(CHATBOT_FILE, clean);
  return clean;
}
