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

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface LeadData {
  name: string;
  mobile: string;
  email: string;
  project: string;
  remark: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your live assistance. I reply within a minute. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadData, setLeadData] = useState<LeadData>({
    name: '',
    mobile: '',
    email: '',
    project: '',
    remark: ''
  });
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

  const quickReplies = [
    { text: "🏠 Pune Properties", project: "Pune Properties" },
    { text: "🌆 Mumbai Properties", project: "Mumbai Properties" },
    { text: "📅 Schedule Visit", project: "Schedule Visit" },
    { text: "🎯 Expert Advice", project: "Expert Advice" }
  ];

  const handleQuickReply = (text: string, project: string) => {
    setLeadData(prev => ({ ...prev, project, remark: text }));
    setShowLeadForm(true);
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
          mobile: leadData.mobile,
          email: leadData.email || "",
          project: leadData.project,
          remark: `${leadData.remark} | IP: ${userIP}`
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
                <div
                  key={msg.id}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
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
                    <div className="text-sm leading-relaxed">{msg.text}</div>
                    <div className={`text-[10px] mt-1 ${msg.isUser ? 'text-white/50' : 'text-gray-400'}`}>
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
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
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all ${
                        errors.mobile ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                    />
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
                      onKeyPress={(e) => e.key === 'Enter' && setShowLeadForm(true)}
                      placeholder="Type your message..."
                      className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] border border-gray-200 transition-all"
                    />
                    <button
                      onClick={() => setShowLeadForm(true)}
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