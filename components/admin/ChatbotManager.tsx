'use client';

import { useState } from 'react';
import { Plus, Trash2, Save, MessageCircle, HelpCircle, Sparkles } from 'lucide-react';
import { DEFAULT_AI_SETTINGS, type ChatbotConfig, type AiSettings, type FaqItem, type QuickReply } from '@/lib/chatbot-match';

interface ChatbotManagerProps {
  initialConfig: ChatbotConfig;
}

let idCounter = 0;
const newId = () => `faq-${Date.now()}-${idCounter++}`;

export default function ChatbotManager({ initialConfig }: ChatbotManagerProps) {
  const [welcomeMessage, setWelcomeMessage] = useState(initialConfig.welcomeMessage);
  const [fallbackMessage, setFallbackMessage] = useState(initialConfig.fallbackMessage);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>(initialConfig.quickReplies || []);
  const [faqs, setFaqs] = useState<FaqItem[]>(initialConfig.faqs || []);
  const [ai, setAi] = useState<AiSettings>(initialConfig.ai || DEFAULT_AI_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // ---- Quick replies ----
  const updateQuickReply = (i: number, patch: Partial<QuickReply>) =>
    setQuickReplies((prev) => prev.map((q, idx) => (idx === i ? { ...q, ...patch } : q)));
  const addQuickReply = () =>
    setQuickReplies((prev) => [...prev, { text: '', project: '' }]);
  const removeQuickReply = (i: number) =>
    setQuickReplies((prev) => prev.filter((_, idx) => idx !== i));

  // ---- FAQs ----
  const updateFaq = (i: number, patch: Partial<FaqItem>) =>
    setFaqs((prev) => prev.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));
  const addFaq = () =>
    setFaqs((prev) => [...prev, { id: newId(), question: '', answer: '', keywords: [], enabled: true }]);
  const removeFaq = (i: number) =>
    setFaqs((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const payload: ChatbotConfig = {
        welcomeMessage,
        fallbackMessage,
        quickReplies: quickReplies.filter((q) => q.text.trim()),
        faqs: faqs.filter((f) => f.question.trim() && f.answer.trim()),
        ai,
      };
      const res = await fetch('/api/chatbot', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `Save failed (${res.status})`);
      // Reflect the sanitized/saved version back into the form.
      setWelcomeMessage(data.welcomeMessage);
      setFallbackMessage(data.fallbackMessage);
      setQuickReplies(data.quickReplies || []);
      setFaqs(data.faqs || []);
      if (data.ai) setAi(data.ai);
      setStatus({ type: 'ok', text: 'Saved. The assistant is updated on the live site.' });
    } catch (err: any) {
      setStatus({ type: 'err', text: err?.message || 'Failed to save' });
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    'w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]';

  const Toggle = ({ on, onToggle, label, hint }: { on: boolean; onToggle: () => void; label: string; hint: string }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <p className="text-xs text-gray-500">{hint}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${on ? 'bg-[#005E60]' : 'bg-gray-300'}`}
        aria-pressed={on}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${on ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* AI Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-[#005E60]" /> AI Settings
        </h2>
        <div className="space-y-4">
          <Toggle on={ai.searchEnabled} onToggle={() => setAi((p) => ({ ...p, searchEnabled: !p.searchEnabled }))}
            label="Enable AI search" hint="AI understanding of natural-language queries in the search bar and chatbot." />
          <Toggle on={ai.chatbotEnabled} onToggle={() => setAi((p) => ({ ...p, chatbotEnabled: !p.chatbotEnabled }))}
            label="Show chatbot on site" hint="Hide the live-assistance widget entirely when off." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max property results</label>
              <input type="number" min={1} max={24} value={ai.maxResults}
                onChange={(e) => setAi((p) => ({ ...p, maxResults: Number(e.target.value) }))} className={inputCls} />
              <p className="text-xs text-gray-500 mt-1">How many property cards the AI shows per answer.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">AI provider</label>
              <input type="text" value="Rule-based (no API key)" disabled className={`${inputCls} bg-gray-100 text-gray-500`} />
              <p className="text-xs text-gray-500 mt-1">Free, deterministic parser. An LLM provider can be added later.</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">AI system instructions</label>
            <textarea value={ai.systemPrompt} onChange={(e) => setAi((p) => ({ ...p, systemPrompt: e.target.value }))} rows={4} className={inputCls} />
            <p className="text-xs text-gray-500 mt-1">Guides AI behaviour (used when an LLM provider is enabled). The rule-based engine always searches the real database and never invents listings.</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MessageCircle size={18} className="text-[#005E60]" /> Greeting &amp; Fallback
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Welcome message</label>
            <textarea value={welcomeMessage} onChange={(e) => setWelcomeMessage(e.target.value)} rows={2} className={inputCls} />
            <p className="text-xs text-gray-500 mt-1">The first message a visitor sees when the chat opens.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fallback message</label>
            <textarea value={fallbackMessage} onChange={(e) => setFallbackMessage(e.target.value)} rows={2} className={inputCls} />
            <p className="text-xs text-gray-500 mt-1">Shown when no Q&amp;A matches the visitor&apos;s question (then the lead form opens).</p>
          </div>
        </div>
      </div>

      {/* Quick replies */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Quick Reply Buttons</h2>
          <button type="button" onClick={addQuickReply} className="flex items-center gap-2 px-3 py-1.5 bg-[#005E60] text-white rounded-lg hover:bg-[#004a4d] transition-colors text-sm">
            <Plus size={16} /> Add
          </button>
        </div>
        <p className="text-xs text-gray-500 mb-3">Chips shown under the chat. Clicking one opens the lead form pre-tagged with its project label.</p>
        <div className="space-y-3">
          {quickReplies.length === 0 && <p className="text-sm text-gray-400">No quick replies. The chat will just show the message box.</p>}
          {quickReplies.map((q, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg items-center">
              <input type="text" placeholder="Button text (e.g., 🏠 Pune Properties)" value={q.text} onChange={(e) => updateQuickReply(i, { text: e.target.value })} className={inputCls} />
              <div className="flex gap-2">
                <input type="text" placeholder="Lead label (e.g., Pune Properties)" value={q.project} onChange={(e) => updateQuickReply(i, { project: e.target.value })} className={inputCls} />
                <button type="button" onClick={() => removeQuickReply(i)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0" aria-label="Remove quick reply">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <HelpCircle size={18} className="text-[#005E60]" /> Questions &amp; Answers
          </h2>
          <button type="button" onClick={addFaq} className="flex items-center gap-2 px-3 py-1.5 bg-[#005E60] text-white rounded-lg hover:bg-[#004a4d] transition-colors text-sm">
            <Plus size={16} /> Add Q&amp;A
          </button>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          When a visitor types a question, the assistant replies with the best-matching answer.
          Matching is typo-tolerant. Add extra <strong>keywords</strong> (comma-separated) to catch
          more phrasings.
        </p>
        <div className="space-y-4">
          {faqs.length === 0 && (
            <p className="text-sm text-gray-400">No Q&amp;A yet. Add one so the assistant can answer visitors.</p>
          )}
          {faqs.map((f, i) => (
            <div key={f.id} className="p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-gray-500">Q&amp;A #{i + 1}</span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                    <input type="checkbox" checked={f.enabled !== false} onChange={(e) => updateFaq(i, { enabled: e.target.checked })} className="w-4 h-4 accent-[#005E60]" />
                    Active
                  </label>
                  <button type="button" onClick={() => removeFaq(i)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" aria-label="Remove Q&A">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <input type="text" placeholder="Question (e.g., Do you charge any brokerage?)" value={f.question} onChange={(e) => updateFaq(i, { question: e.target.value })} className={inputCls} />
              <textarea placeholder="Answer the assistant should reply with…" value={f.answer} onChange={(e) => updateFaq(i, { answer: e.target.value })} rows={3} className={inputCls} />
              <input
                type="text"
                placeholder="Extra keywords, comma-separated (e.g., brokerage, commission, fees, charges)"
                value={(f.keywords || []).join(', ')}
                onChange={(e) => updateFaq(i, { keywords: e.target.value.split(',').map((k) => k.trim()).filter(Boolean) })}
                className={inputCls}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Save bar */}
      <div className="flex items-center justify-end gap-3 sticky bottom-0 bg-gray-50 py-3">
        {status && (
          <span className={`text-sm ${status.type === 'ok' ? 'text-[#005E60]' : 'text-red-600'}`}>{status.text}</span>
        )}
        <button type="button" onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-[#005E60] text-white rounded-lg hover:bg-[#004a4d] transition-colors disabled:opacity-50">
          <Save size={18} /> {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
