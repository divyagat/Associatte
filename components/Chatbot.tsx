"use client";

import { useState, useEffect, useRef } from "react";
import { 
  MessageCircle, 
  X, 
  Send, 
  Minimize2, 
  Building2,
  Sparkles,
  Home,
  TrendingUp,
  Shield,
  Users,
  Star,
  User,
  Calendar,
  ArrowRight,
  Diamond,
  Crown,
  Headphones,
  AlertCircle
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'lead';
}

interface LeadData {
  name: string;
  mobile: string;
  email: string;
  project: string;
  remark: string;
}

interface ValidationErrors {
  name?: string;
  mobile?: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "✨ Welcome to Associatte PropTech ✨\n\nIndia's Most Trusted Real Estate Partner\n\nHello! I'm your personal property concierge. How may I assist you today?",
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [leadData, setLeadData] = useState<LeadData>({
    name: '',
    mobile: '',
    email: '',
    project: '',
    remark: ''
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userIP, setUserIP] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autoOpenTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle component mounting to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Get user IP address
  useEffect(() => {
    if (!isMounted) return;
    
    const fetchIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setUserIP(data.ip);
      } catch (error) {
        console.error('Failed to fetch IP:', error);
        setUserIP('unknown');
      }
    };
    
    fetchIP();
  }, [isMounted]);

  // Auto-open chat on page refresh/load - with error handling
  useEffect(() => {
    if (!isMounted) return;
    
    // Clear any existing timer
    if (autoOpenTimerRef.current) {
      clearTimeout(autoOpenTimerRef.current);
    }
    
    // Open chat automatically after a short delay
    autoOpenTimerRef.current = setTimeout(() => {
      try {
        setIsOpen(true);
        setIsMinimized(false);
      } catch (error) {
        console.error('Error opening chat:', error);
      }
    }, 1000);
    
    // Cleanup timer on unmount
    return () => {
      if (autoOpenTimerRef.current) {
        clearTimeout(autoOpenTimerRef.current);
      }
    };
  }, [isMounted]);

  const quickReplies = [
    { text: "Pune Properties", project: "Pune Properties Inquiry", emoji: "🏠" },
    { text: "Mumbai Properties", project: "Mumbai Properties Inquiry", emoji: "📈" },
    { text: "RERA Verified", project: "RERA Verification Request", emoji: "✓" },
    { text: "Schedule Visit", project: "Site Visit Scheduling", emoji: "📅" },
    { text: "Expert Advice", project: "Expert Consultation Request", emoji: "🎧" },
  ];

  const validateName = (name: string): boolean => {
    const nameRegex = /^[A-Za-z\s]+$/;
    return nameRegex.test(name);
  };

  const validateMobile = (mobile: string): boolean => {
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(mobile);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^[A-Za-z\s]*$/.test(value)) {
      setLeadData({ ...leadData, name: value });
      if (validationErrors.name) {
        setValidationErrors({ ...validationErrors, name: undefined });
      }
    }
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*$/.test(value)) {
      if (value.length <= 10) {
        setLeadData({ ...leadData, mobile: value });
        if (validationErrors.mobile) {
          setValidationErrors({ ...validationErrors, mobile: undefined });
        }
      }
    }
  };

  const sendToCRM = async (lead: LeadData) => {
    try {
      const crmData = {
        name: lead.name,
        mobile: lead.mobile,
        email: lead.email || "",
        project: lead.project,
        remark: `${lead.remark} | IP: ${userIP} | Country Code: +91`
      };

      console.log("Sending to CRM via API route:", crmData);

      const response = await fetch('/api/crm', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(crmData)
      });

      const result = await response.json();
      console.log("Response from API route:", result);

      if (response.ok && result.success) {
        return true;
      } else {
        console.error('CRM Error:', result);
        return false;
      }
    } catch (error) {
      console.error('Failed to send to CRM:', error);
      return false;
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleQuickReply = (text: string, project: string) => {
    setSelectedProject(project);
    setShowLeadForm(true);
    setLeadData(prev => ({ 
      ...prev, 
      project: project,
      remark: text
    }));
    setValidationErrors({});
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!leadData.name.trim()) {
      setValidationErrors({ name: "Name is required" });
      return;
    }
    
    if (!validateName(leadData.name)) {
      setValidationErrors({ name: "Only letters & spaces" });
      return;
    }
    
    if (!leadData.mobile) {
      setValidationErrors({ mobile: "Mobile is required" });
      return;
    }
    
    if (!validateMobile(leadData.mobile)) {
      setValidationErrors({ mobile: "Enter 10 digits" });
      return;
    }

    setIsSubmitting(true);

    const loadingMsg: Message = {
      id: Date.now().toString(),
      text: "Submitting your request...",
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    };
    setMessages(prev => [...prev, loadingMsg]);

    const success = await sendToCRM(leadData);

    setMessages(prev => prev.filter(m => m.id !== loadingMsg.id));

    if (success) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: "✨ Thank you! Our expert will contact you within 2 hours. Your dream home awaits! 🏠",
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      }]);
      setShowLeadForm(false);
      setLeadData({ name: '', mobile: '', email: '', project: '', remark: '' });
      setSelectedProject("");
      setValidationErrors({});
    } else {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: "⚠️ Unable to submit. Please call +91 8881188181.",
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      }]);
    }
    setIsSubmitting(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  // Don't render anything until mounted to avoid hydration errors
  if (!isMounted) {
    return null;
  }

  // Closed State - Left side positioning
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-3 bottom-4 z-50 group"
        aria-label="Open Chat"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#005E60] to-[#F8C21C] animate-ping opacity-75"></div>
          <div className="relative bg-gradient-to-r from-[#005E60] to-[#003D3F] px-3 py-2 rounded-full shadow-2xl flex items-center gap-1.5">
            <MessageCircle size={14} className="text-[#F8C21C]" />
            <span className="text-white text-[11px] font-medium">Chat</span>
            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full border border-white"></div>
          </div>
        </div>
      </button>
    );
  }

  // Open State - Left side positioning
  return (
    <>
      {/* Backdrop */}
      {!isMinimized && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Chat Window - Left side positioning */}
      <div
        className={`fixed z-50 bg-white shadow-2xl transition-all duration-300 ${
          isMinimized 
            ? 'left-3 bottom-4 w-auto rounded-full'
            : 'left-2 bottom-2 right-2 sm:left-4 sm:right-auto sm:bottom-4 sm:w-[360px] rounded-xl'
        }`}
      >
        {isMinimized ? (
          <button
            onClick={() => setIsMinimized(false)}
            className="bg-gradient-to-r from-[#005E60] to-[#003D3F] px-3 py-2 rounded-full flex items-center gap-1.5 shadow-xl"
          >
            <MessageCircle size={12} className="text-[#F8C21C]" />
            <span className="text-white text-[11px] font-medium">Open Chat</span>
          </button>
        ) : (
          <div className="flex flex-col h-[520px] max-h-[85vh] w-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#005E60] to-[#003D3F] px-3 py-2.5 rounded-t-xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center">
                    <Crown size={12} className="text-[#F8C21C]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-[12px] flex items-center gap-1">
                      Associatte PropTech
                      <span className="bg-[#F8C21C] text-[#005E60] text-[6px] px-1 py-0.5 rounded-full">PREMIUM</span>
                    </h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                      <p className="text-[8px] text-white/80">Online • Priority Support</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    <Minimize2 size={10} className="text-white" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    <X size={10} className="text-white" />
                  </button>
                </div>
              </div>
              
              {/* Trust Badges */}
              <div className="flex items-center gap-2 mt-1.5 pt-1.5 border-t border-white/10">
                <div className="flex items-center gap-0.5">
                  <Diamond size={6} className="text-[#F8C21C]" />
                  <span className="text-[7px] text-white/80">25+ Years</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <Users size={6} className="text-[#F8C21C]" />
                  <span className="text-[7px] text-white/80">10k+ Clients</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <Star size={6} className="text-[#F8C21C]" />
                  <span className="text-[7px] text-white/80">4.9★</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-2.5 space-y-2 bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!msg.isUser && (
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#005E60] to-[#003D3F] flex items-center justify-center mr-1 flex-shrink-0 mt-0.5">
                      <Building2 size={8} className="text-[#F8C21C]" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] px-2.5 py-1.5 ${
                      msg.isUser
                        ? 'bg-[#005E60] text-white rounded-2xl rounded-br-md'
                        : 'bg-white text-gray-700 rounded-2xl rounded-bl-md shadow-sm border border-gray-100'
                    }`}
                  >
                    <div className="text-[11px] leading-relaxed whitespace-pre-wrap break-words">
                      {msg.text}
                    </div>
                    <div className={`text-[7px] mt-0.5 ${msg.isUser ? 'text-white/60' : 'text-gray-400'}`}>
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#005E60] to-[#003D3F] flex items-center justify-center mr-1">
                    <Building2 size={8} className="text-[#F8C21C]" />
                  </div>
                  <div className="bg-white px-3 py-1.5 rounded-2xl shadow-sm">
                    <div className="flex gap-0.5">
                      <div className="w-1 h-1 bg-[#005E60] rounded-full animate-bounce" />
                      <div className="w-1 h-1 bg-[#005E60] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-1 h-1 bg-[#005E60] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Lead Form */}
            {showLeadForm ? (
              <div className="p-2.5 bg-white border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800 text-[11px] flex items-center gap-1">
                    <User size={10} className="text-[#005E60]" />
                    Get Personalised Assistance
                  </h4>
                  <button
                    onClick={() => setShowLeadForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={10} />
                  </button>
                </div>
                <form onSubmit={handleLeadSubmit} className="space-y-2">
                  <div>
                    <input
                      type="text"
                      placeholder="Full Name * (Letters only)"
                      value={leadData.name}
                      onChange={handleNameChange}
                      className={`w-full px-2 py-1.5 text-[11px] border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#005E60] ${
                        validationErrors.name ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {validationErrors.name && (
                      <div className="flex items-center gap-0.5 mt-0.5 text-red-500 text-[8px]">
                        <AlertCircle size={8} />
                        <span>{validationErrors.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <input
                      type="tel"
                      placeholder="Mobile Number * (10 digits)"
                      value={leadData.mobile}
                      onChange={handleMobileChange}
                      maxLength={10}
                      className={`w-full px-2 py-1.5 text-[11px] border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#005E60] ${
                        validationErrors.mobile ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {validationErrors.mobile && (
                      <div className="flex items-center gap-0.5 mt-0.5 text-red-500 text-[8px]">
                        <AlertCircle size={8} />
                        <span>{validationErrors.mobile}</span>
                      </div>
                    )}
                  </div>

                  <input
                    type="email"
                    placeholder="Email Address (Optional)"
                    value={leadData.email}
                    onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                    className="w-full px-2 py-1.5 text-[11px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#005E60]"
                  />
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#005F5F] text-white py-1.5 rounded-lg font-medium text-[11px] hover:bg-[#004a4a] transition-all disabled:opacity-50 flex items-center justify-center gap-1"
                  >
                    {isSubmitting ? 'Submitting...' : 'Connect with Expert'}
                    <ArrowRight size={10} />
                  </button>
                  <p className="text-[7px] text-gray-400 text-center">
                    Our expert will contact you within 2 hours
                  </p>
                </form>
              </div>
            ) : (
              <>
                {/* Quick Replies */}
                <div className="px-2.5 py-2 border-t border-gray-100 bg-white">
                  <p className="text-[8px] font-medium text-gray-500 mb-1.5 flex items-center gap-0.5">
                    <Sparkles size={7} className="text-[#F8C21C]" />
                    Quick Actions
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {quickReplies.map((reply, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickReply(reply.text, reply.project)}
                        className="flex items-center justify-center gap-1 px-1.5 py-1.5 text-[9px] bg-gray-50 hover:bg-gray-100 rounded-lg transition-all border border-gray-200"
                      >
                        <span className="text-[11px]">{reply.emoji}</span>
                        <span className="text-gray-700 truncate text-[9px]">{reply.text}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Area */}
                <div className="p-2 border-t border-gray-100 bg-white rounded-b-xl">
                  <div className="flex gap-1.5">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && setShowLeadForm(true)}
                      placeholder="Type your message..."
                      className="flex-1 bg-gray-50 text-gray-900 rounded-lg px-2 py-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-[#005E60] border border-gray-200"
                    />
                    <button
                      onClick={() => setShowLeadForm(true)}
                      disabled={!input.trim()}
                      className="bg-[#005E60] text-white p-1.5 rounded-lg hover:bg-[#003D3F] transition-all disabled:opacity-50"
                    >
                      <Send size={12} />
                    </button>
                  </div>
                  <p className="text-[6px] text-gray-400 text-center mt-1 flex items-center justify-center gap-0.5">
                    <Shield size={6} />
                    Secured by Associatte PropTech
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}