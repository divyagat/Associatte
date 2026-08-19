"use client";

import { useState, useEffect, useRef } from "react";
import { 
  MessageCircle, 
  X, 
  Send, 
  Minimize2, 
  Shield,
  User,
  ArrowRight,
  Headphones,
  AlertCircle,
  Clock,
  CheckCircle,
  Phone,
  Mail,
  Zap
} from "lucide-react";
import CountryCodeSelect from "@/components/common/CountryCodeSelect";
import VoiceButton from "@/components/common/VoiceButton";
import ProjectCard from "@/components/builder-page/ProjectCard";
import { useRouter } from "next/navigation";
import { matchFaq, DEFAULT_CHATBOT_CONFIG, type ChatbotConfig } from "@/lib/chatbot-match";
import { criteriaToPropertiesQuery, type SearchCriteria, type CriteriaPatch } from "@/lib/ai-search/criteria";

// A refine chip either sends a natural phrase back through the pipeline or
// applies a direct patch (e.g. clear the location) to the active criteria.
interface Suggestion {
  label: string;
  message?: string;
  patch?: CriteriaPatch;
  lead?: boolean;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  // AI property results rendered as real cards inside the chat.
  properties?: any[];
  // Active-filter checklist (["Pune", "2 BHK", "Up to ₹90 Lakh"]).
  summary?: string[];
  // Refine buttons under an answer.
  suggestions?: Suggestion[];
  // Link to the full filtered results on the Properties listing page.
  viewAllHref?: string;
}

// Apply a refine patch on the client (null clears a field), mirroring
// mergeCriteria so the chip actions stay in sync with the server.
function applyPatch(prev: SearchCriteria, patch: CriteriaPatch): SearchCriteria {
  const out: SearchCriteria = { ...prev };
  (Object.keys(patch) as (keyof CriteriaPatch)[]).forEach((k) => {
    const v = patch[k];
    if (v === null || v === undefined || v === '') delete (out as any)[k];
    else (out as any)[k] = v;
  });
  return out;
}

// Does the message look like a property search / refinement (vs a general FAQ)?
function looksLikePropertyQuery(text: string, hasContext: boolean): boolean {
  const t = text.toLowerCase();
  if (/\b(\d+\s*bhk|bhk|flat|apartment|villa|plot|office|shop|commercial|warehouse|godown|rent|buy|budget|lakh|lac|crore|\bcr\b|possession|ready to move|under construction|property|dikhao|chahiye|dhundh|looking for|show me)\b/.test(t)) return true;
  if (/\b(pune|mumbai|kdmc|kothrud|baner|wakad|hinjewadi|kharadi|kharghar|panvel|thane|kalyan|dombivli)\b/.test(t)) return true;
  if (hasContext && /\b(cheaper|sasta|costlier|mehnga|increase|badha|kam|zyada|instead|jagah|change|update|nearby|paas|ready|construction|budget)\b/.test(t)) return true;
  return false;
}

// Unique message id even when two are appended within the same millisecond.
let msgSeq = 0;
const nextMsgId = () => `${Date.now()}-${msgSeq++}`;

interface LeadData {
  name: string;
  mobile: string;
  email: string;
  project: string;
  remark: string;
}

export default function Chatbot() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [config, setConfig] = useState<ChatbotConfig>(DEFAULT_CHATBOT_CONFIG);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: DEFAULT_CHATBOT_CONFIG.welcomeMessage,
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  // Conversation search state — the single source of truth for the chat's
  // active property requirements (city, location, bhk, budget, …).
  const [activeCriteria, setActiveCriteria] = useState<SearchCriteria>({});
  const [isTyping, setIsTyping] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadData, setLeadData] = useState<LeadData>({
    name: '',
    mobile: '',
    email: '',
    project: '',
    remark: ''
  });
  const [countryCode, setCountryCode] = useState("+91");
  const [errors, setErrors] = useState<{ name?: string; mobile?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userIP, setUserIP] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autoOpenTimerRef = useRef<NodeJS.Timeout | null>(null);
  const userInteractedRef = useRef(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load the admin-managed config (greeting, quick replies, Q&A). Updates the
  // opening greeting in place so it reflects whatever the admin set.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/chatbot');
        const data = await res.json().catch(() => null);
        if (cancelled || !data) return;
        setConfig(data);
        if (data.welcomeMessage) {
          setMessages((prev) =>
            prev.map((m) => (m.id === '1' ? { ...m, text: data.welcomeMessage } : m)),
          );
        }
      } catch { /* keep defaults */ }
    })();
    return () => { cancelled = true; };
  }, []);

  // Track user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      userInteractedRef.current = true;
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
    
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('scroll', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    
    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  // Auto-popup logic
  useEffect(() => {
    if (!isMounted) return;
    
    // Clear any existing timer
    if (autoOpenTimerRef.current) {
      clearTimeout(autoOpenTimerRef.current);
    }
    
    // Check if user has interacted or if chatbot was closed before
    const hasClosedBefore = sessionStorage.getItem('chatbot_closed') === 'true';
    const hasSubmittedLead = sessionStorage.getItem('chatbot_lead_submitted') === 'true';
    
    // Only auto-popup if:
    // 1. Not already open
    // 2. User hasn't manually closed it in this session
    // 3. User hasn't submitted a lead in this session
    // 4. Hasn't auto-opened before
    if (!isOpen && !hasClosedBefore && !hasSubmittedLead && !hasAutoOpened) {
      autoOpenTimerRef.current = setTimeout(() => {
        // Only auto-open if user hasn't interacted with the page yet
        if (!userInteractedRef.current) {
          setIsOpen(true);
          setIsMinimized(false);
          setHasAutoOpened(true);
        }
      }, 4000); // Opens after 4 seconds
    }
    
    return () => {
      if (autoOpenTimerRef.current) {
        clearTimeout(autoOpenTimerRef.current);
      }
    };
  }, [isMounted, isOpen, hasAutoOpened]);

  // Session storage for user actions
  useEffect(() => {
    if (!isOpen && !isMinimized && hasAutoOpened) {
      // User closed the chat
      sessionStorage.setItem('chatbot_closed', 'true');
    }
  }, [isOpen, isMinimized, hasAutoOpened]);

  useEffect(() => {
    if (!isMounted) return;
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setUserIP(data.ip))
      .catch(() => setUserIP('unknown'));
  }, [isMounted]);

  useEffect(() => {
    if (isOpen && !showLeadForm) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, showLeadForm]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickReplies = config.quickReplies?.length ? config.quickReplies : DEFAULT_CHATBOT_CONFIG.quickReplies;

  const handleQuickReply = (text: string, project: string) => {
    setLeadData(prev => ({ ...prev, project, remark: text }));
    setShowLeadForm(true);
  };

  const pushBot = (msg: Omit<Message, 'id' | 'isUser' | 'timestamp'>) =>
    setMessages(prev => [...prev, { id: nextMsgId(), isUser: false, timestamp: new Date(), ...msg }]);

  // No FAQ / not a property query → show fallback and open the lead form.
  const fallbackToLead = (text: string) => {
    pushBot({ text: config.fallbackMessage || DEFAULT_CHATBOT_CONFIG.fallbackMessage });
    setLeadData(prev => ({ ...prev, remark: prev.remark || text }));
    setTimeout(() => setShowLeadForm(true), 600);
  };

  // Ask for the most useful missing detail so the conversation narrows down.
  const nextQuestion = (c: SearchCriteria): string | null => {
    if (!c.city && !c.location) return "Aap kis city ya area me property dhundh rahe hain?";
    if (!c.bhk && c.category !== 'commercial' && c.category !== 'warehouse' && c.category !== 'industry')
      return "Kitne BHK ka chahiye?";
    if (!c.maxBudget && !c.minBudget) return "Aapka approximate budget kya hai?";
    return null;
  };

  const refineChips = (): Suggestion[] => [
    { label: 'Ready to move', message: 'ready to move' },
    { label: 'Under construction', message: 'under construction' },
    { label: 'Increase budget', message: 'budget thoda badha do' },
    { label: 'Cheaper options', message: 'sasta dikhao' },
  ];

  const noResultChips = (c: SearchCriteria): Suggestion[] => {
    const chips: Suggestion[] = [];
    if (c.maxBudget) chips.push({ label: 'Increase budget', message: 'budget badha do' });
    if (c.location) chips.push({ label: 'Remove location', patch: { location: null } });
    if (c.bhk) chips.push({ label: 'Any BHK', patch: { bhk: null } });
    if (c.status) chips.push({ label: 'Any status', patch: { status: null } });
    chips.push({ label: 'Talk to an expert', lead: true });
    return chips;
  };

  // Run the shared AI search for a requirement, updating conversation context
  // and rendering real property cards. `text` may be empty when only a refine
  // patch (folded into `context`) is being applied.
  const runAiSearch = async (text: string, context: SearchCriteria) => {
    setIsTyping(true);
    try {
      const res = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, context }),
      });
      const data = await res.json().catch(() => null);
      setIsTyping(false);
      if (!res.ok || !data) { fallbackToLead(text); return; }

      setActiveCriteria(data.criteria || {});
      if (data.results?.length) {
        const head = data.isAlternative
          ? `I couldn't find an exact match, so here are the closest options${data.relaxed?.length ? ` (relaxed ${data.relaxed.join(', ')})` : ''}:`
          : `I found ${data.total} propert${data.total === 1 ? 'y' : 'ies'} matching your requirements:`;
        // Same criteria → the Properties listing page, so the user can see ALL
        // matches filtered there (not just the in-chat preview).
        const viewAllHref = `/properties?${criteriaToPropertiesQuery(data.criteria || {}).toString()}`;
        pushBot({ text: head, summary: data.summary, properties: data.results, suggestions: refineChips(), viewAllHref });
        const q = nextQuestion(data.criteria || {});
        if (q) pushBot({ text: q });
      } else {
        pushBot({
          text: "I couldn't find matching properties in our database. Try adjusting your requirements:",
          summary: data.summary,
          suggestions: noResultChips(data.criteria || {}),
        });
      }
    } catch {
      setIsTyping(false);
      fallbackToLead(text);
    }
  };

  // Central message handler: property intent → shared AI search; otherwise the
  // admin Q&A (typo-tolerant), then the lead-capture fallback.
  const handleSendMessage = (textArg?: string) => {
    const text = (textArg ?? input).trim();
    if (!text) return;
    setInput("");
    setMessages(prev => [...prev, { id: nextMsgId(), text, isUser: true, timestamp: new Date() }]);

    const aiOn = config.ai?.searchEnabled !== false;
    const hasContext = Object.keys(activeCriteria).length > 0;

    if (aiOn && looksLikePropertyQuery(text, hasContext)) {
      runAiSearch(text, activeCriteria);
      return;
    }

    setIsTyping(true);
    const match = matchFaq(config.faqs || [], text);
    setTimeout(() => {
      setIsTyping(false);
      if (match) {
        pushBot({ text: match.answer });
      } else if (aiOn) {
        // Not obviously a property query, but let the AI try before giving up.
        runAiSearch(text, activeCriteria);
      } else {
        fallbackToLead(text);
      }
    }, 500);
  };

  // Handle a refine chip: send a phrase back through the pipeline, apply a
  // direct criteria patch, or hand over to the lead form.
  const handleSuggestion = (s: Suggestion) => {
    if (s.lead) {
      setLeadData(prev => ({ ...prev, remark: prev.remark || 'Requested expert assistance' }));
      setShowLeadForm(true);
      return;
    }
    if (s.message) { handleSendMessage(s.message); return; }
    if (s.patch) {
      const merged = applyPatch(activeCriteria, s.patch);
      setActiveCriteria(merged);
      setMessages(prev => [...prev, { id: nextMsgId(), text: s.label, isUser: true, timestamp: new Date() }]);
      runAiSearch('', merged);
    }
  };

  const validateName = (name: string) => /^[A-Za-z\s]+$/.test(name);
  const validateMobile = (mobile: string) => /^\d{10}$/.test(mobile);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!leadData.name.trim()) {
      setErrors({ name: "Name required" });
      return;
    }
    if (!validateName(leadData.name)) {
      setErrors({ name: "Only letters allowed" });
      return;
    }
    if (!leadData.mobile) {
      setErrors({ mobile: "Mobile required" });
      return;
    }
    if (!validateMobile(leadData.mobile)) {
      setErrors({ mobile: "10 digits required" });
      return;
    }

    setIsSubmitting(true);
    setIsTyping(true);

    const loadingMsg = { 
      id: Date.now().toString(), 
      text: "Connecting you...", 
      isUser: false, 
      timestamp: new Date() 
    };
    setMessages(prev => [...prev, loadingMsg]);

    try {
      await fetch('/api/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadData.name,
          countryCode,
          mobile: leadData.mobile,
          email: leadData.email || "",
          project: leadData.project,
          remark: `${leadData.remark} | Country Code: ${countryCode} | IP: ${userIP}`
        })
      });
      
      // Mark lead as submitted in session
      sessionStorage.setItem('chatbot_lead_submitted', 'true');
      
      setMessages(prev => prev.filter(m => m.id !== loadingMsg.id));
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: "✓ Thank you! An expert will call you within 2 hours.",
        isUser: false,
        timestamp: new Date(),
      }]);
      setShowLeadForm(false);
      setLeadData({ name: '', mobile: '', email: '', project: '', remark: '' });
      setErrors({});
      
      // Auto minimize after lead submission
      setTimeout(() => {
        setIsMinimized(true);
      }, 3000);
    } catch {
      setMessages(prev => prev.filter(m => m.id !== loadingMsg.id));
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: "⚠️ Please call +91 8881188181 for assistance.",
        isUser: false,
        timestamp: new Date(),
      }]);
    }
    
    setIsTyping(false);
    setIsSubmitting(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const handleManualOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    // Clear the closed flag when manually opening
    sessionStorage.removeItem('chatbot_closed');
  };

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('chatbot_closed', 'true');
  };

  if (!isMounted) return null;
  // Admin can hide the whole assistant from the site.
  if (config.ai?.chatbotEnabled === false) return null;

  // Closed state - LEFT side positioning
  if (!isOpen) {
    return (
      <button
        onClick={handleManualOpen}
        className="fixed left-4 bottom-4 z-50 group cursor-pointer"
        aria-label="Open Live Assistance"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-[var(--color-primary)] animate-ping opacity-40"></div>
          <div className="relative bg-[var(--color-primary)] px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 hover:bg-[var(--color-primary-dark)] transition-all hover:scale-105">
            <Headphones size={16} className="text-[var(--color-gold)]" />
            <span className="text-white text-sm font-medium">Live Assistance</span>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
        </div>
      </button>
    );
  }

  // Open state - LEFT side positioning
  return (
    <>
      {!isMinimized && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-fade-in" 
          onClick={handleClose} 
        />
      )}

      <div className={`fixed z-50 bg-white shadow-xl transition-all duration-300 ${
        isMinimized ? 'left-4 bottom-4 rounded-full' : 'left-4 bottom-4 w-[380px] rounded-lg shadow-2xl'
      }`}>
        {isMinimized ? (
          <button
            onClick={() => {
              setIsMinimized(false);
              sessionStorage.removeItem('chatbot_closed');
            }}
            className="bg-[var(--color-primary)] px-4 py-2.5 rounded-full flex items-center gap-2 shadow-lg hover:bg-[var(--color-primary-dark)] transition-colors"
          >
            <MessageCircle size={14} className="text-[var(--color-gold)]" />
            <span className="text-white text-sm">Live Assistance</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </button>
        ) : (
          <div className="flex flex-col h-[520px] w-full">
            {/* Header */}
            <div className="bg-[var(--color-primary)] px-4 py-3 rounded-t-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <Headphones size={14} className="text-[var(--color-gold)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">Live Assistance</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-[10px] text-white/80">Online</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap size={8} className="text-[var(--color-gold)]" />
                        <span className="text-[10px] text-white/80">Reply within 1 min</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => setIsMinimized(true)} 
                    className="p-1.5 hover:bg-white/10 rounded transition-colors"
                    aria-label="Minimize"
                  >
                    <Minimize2 size={12} className="text-white" />
                  </button>
                  <button 
                    onClick={handleClose} 
                    className="p-1.5 hover:bg-white/10 rounded transition-colors"
                    aria-label="Close"
                  >
                    <X size={12} className="text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((msg) => (
                <div key={msg.id} className="animate-fade-in">
                  <div className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                    {!msg.isUser && (
                      <div className="w-6 h-6 rounded-full bg-[var(--color-primary)] flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                        <Headphones size={10} className="text-[var(--color-gold)]" />
                      </div>
                    )}
                    <div className={`max-w-[80%] px-3 py-2 ${
                      msg.isUser
                        ? 'bg-[var(--color-primary)] text-white rounded-lg rounded-br-sm'
                        : 'bg-white text-gray-700 rounded-lg rounded-bl-sm shadow-sm border border-gray-100'
                    }`}>
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</div>
                      <div className={`text-[10px] mt-1 ${msg.isUser ? 'text-white/50' : 'text-gray-400'}`}>
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>

                  {/* Active-filter checklist */}
                  {msg.summary && msg.summary.length > 0 && (
                    <div className="ml-8 mt-2 flex flex-wrap gap-1.5">
                      {msg.summary.map((s, i) => (
                        <span key={i} className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-0.5 rounded-full">
                          <CheckCircle size={10} /> {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Real property cards from the database. Clicking one closes the
                      chat so the visitor lands on the property detail page. */}
                  {msg.properties && msg.properties.length > 0 && (
                    <div className="ml-8 mt-2 space-y-3">
                      {msg.properties.map((p: any) => (
                        <div key={p.slug || p._id} onClick={handleClose}>
                          <ProjectCard project={p} />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Open the full filtered results on the Properties page */}
                  {msg.viewAllHref && (
                    <div className="ml-8 mt-2">
                      <button
                        onClick={() => { const href = msg.viewAllHref!; handleClose(); router.push(href); }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
                      >
                        View all on Properties page
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  )}

                  {/* Refine / next-step chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="ml-8 mt-2 flex flex-wrap gap-2">
                      {msg.suggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestion(s)}
                          className="px-3 py-1.5 text-xs bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full hover:bg-[var(--color-primary)]/20 transition-all font-medium"
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="w-6 h-6 rounded-full bg-[var(--color-primary)] flex items-center justify-center mr-2">
                    <Headphones size={10} className="text-[var(--color-gold)]" />
                  </div>
                  <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Lead Form or Quick Replies */}
            {showLeadForm ? (
              <div className="p-4 bg-white border-t border-gray-100 animate-fade-in">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-800 text-sm flex items-center gap-2">
                    <User size={14} className="text-[var(--color-primary)]" />
                    Share your details
                  </h4>
                  <button 
                    onClick={() => setShowLeadForm(false)} 
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close form"
                  >
                    <X size={14} />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Full name *"
                      value={leadData.name}
                      onChange={(e) => {
                        setLeadData({ ...leadData, name: e.target.value });
                        if (errors.name) setErrors({});
                      }}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all ${
                        errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1">
                        <AlertCircle size={10} /> {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <div className="flex gap-2">
                      <CountryCodeSelect value={countryCode} onChange={setCountryCode} />
                      <input
                        type="tel"
                        placeholder="Mobile number * (10 digits)"
                        value={leadData.mobile}
                        onChange={(e) => {
                          if (e.target.value.length <= 10 && /^\d*$/.test(e.target.value)) {
                            setLeadData({ ...leadData, mobile: e.target.value });
                            if (errors.mobile) setErrors({});
                          }
                        }}
                        className={`flex-1 w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all ${
                          errors.mobile ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                      />
                    </div>
                    {errors.mobile && (
                      <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1">
                        <AlertCircle size={10} /> {errors.mobile}
                      </p>
                    )}
                  </div>
                  <input
                    type="email"
                    placeholder="Email (optional)"
                    value={leadData.email}
                    onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[var(--color-primary)] text-white py-2 rounded-lg font-medium text-sm hover:bg-[var(--color-primary-dark)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Connecting...' : 'Connect with expert'}
                    <ArrowRight size={14} />
                  </button>
                  <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1">
                    <CheckCircle size={10} className="text-[var(--color-primary)]" />
                    Expert will call within 2 hours
                  </p>
                </form>
              </div>
            ) : (
              <>
                {/* Quick Replies */}
                <div className="px-4 py-3 bg-white border-t border-gray-100">
                  <p className="text-[10px] font-medium text-gray-500 mb-2 flex items-center gap-1">
                    <Zap size={10} className="text-[var(--color-gold)]" />
                    Quick replies
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {quickReplies.map((reply, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickReply(reply.text, reply.project)}
                        className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-all hover:scale-105"
                      >
                        {reply.text}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input */}
                <div className="p-4 bg-white border-t border-gray-100 rounded-b-lg">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type or speak your requirement..."
                      className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] border border-gray-200 transition-all"
                    />
                    <VoiceButton
                      onInterim={(t) => setInput(t)}
                      onResult={(t) => { setInput(""); handleSendMessage(t); }}
                      className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex-shrink-0"
                      title="Speak your property requirement"
                    />
                    <button
                      onClick={() => handleSendMessage()}
                      className="bg-[var(--color-primary)] text-white px-3 py-2 rounded-lg hover:bg-[var(--color-primary-dark)] transition-all"
                      aria-label="Send message"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                  <div className="flex items-center justify-center gap-3 mt-3">
                    <div className="flex items-center gap-1">
                      <Phone size={8} className="text-gray-400" />
                      <span className="text-[9px] text-gray-400">+91 8881188181</span>
                    </div>
                    <div className="w-px h-3 bg-gray-200"></div>
                    <div className="flex items-center gap-1">
                      <Shield size={8} className="text-gray-400" />
                      <span className="text-[9px] text-gray-400">Secure</span>
                    </div>
                    <div className="w-px h-3 bg-gray-200"></div>
                    <div className="flex items-center gap-1">
                      <Clock size={8} className="text-gray-400" />
                      <span className="text-[9px] text-gray-400">Quick response</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}