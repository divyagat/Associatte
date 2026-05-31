"use client";

import { useState, useEffect, useRef } from "react";
import { 
  MessageCircle, 
  X, 
  Send, 
  Minimize2, 
  Maximize2,
  Building2,
  Award,
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

  // Get user IP address
  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setUserIP(data.ip))
      .catch(() => setUserIP('unknown'));
  }, []);

  // Auto-open chat on page refresh (only once per session)
  useEffect(() => {
    // Check if chat has been auto-opened in this session
    const autoOpened = sessionStorage.getItem('associatte_chat_auto_opened');
    
    if (!autoOpened) {
      // Auto open after 1.5 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('associatte_chat_auto_opened', 'true');
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const quickReplies = [
    { icon: Home, text: "🏠 Pune Properties", project: "Pune Properties Inquiry", color: "#0D9488" },
    { icon: TrendingUp, text: "📈 Mumbai Properties", project: "Mumbai Properties Inquiry", color: "#2563EB" },
    { icon: Shield, text: "✓ RERA Verified", project: "RERA Verification Request", color: "#F8C21C" },
    { icon: Calendar, text: "📅 Schedule Visit", project: "Site Visit Scheduling", color: "#EA580C" },
    { icon: Headphones, text: "🎧 Expert Advice", project: "Expert Consultation Request", color: "#7C3AED" },
  ];

  // Validation functions
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
      setValidationErrors({ name: "Name should only contain letters and spaces" });
      return;
    }
    
    if (!leadData.mobile) {
      setValidationErrors({ mobile: "Mobile number is required" });
      return;
    }
    
    if (!validateMobile(leadData.mobile)) {
      setValidationErrors({ mobile: "Mobile number must be exactly 10 digits" });
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
        text: "✨ Thank you for connecting with Associatte PropTech! ✨\n\nOur expert will contact you within 2 hours.\n\nMeanwhile, feel free to explore properties on our website. Your dream home awaits! 🏠",
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
        text: "⚠️ Unable to submit your request. Please try again or call us directly at +91 8881188181.",
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

  // Closed State - Left side on mobile, left on desktop too
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 bottom-20 md:left-6 md:bottom-6 z-50 group"
        aria-label="Open Chat"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#005E60] to-[#F8C21C] animate-ping opacity-75"></div>
          <div className="relative bg-gradient-to-r from-[#005E60] to-[#003D3F] px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 md:gap-3">
            <Building2 size={20} className="text-[#F8C21C]" />
            <span className="text-white text-xs md:text-sm font-medium hidden sm:inline">Associatte PropTech</span>
            <Sparkles size={12} className="text-[#F8C21C] hidden sm:block" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
        </div>
      </button>
    );
  }

  // Open State - Left side on mobile, left on desktop too
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && !isMinimized && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Chat Window - Left side positioning */}
      <div
        className={`fixed z-50 bg-white shadow-2xl transition-all duration-300 ${
          isMinimized 
            ? 'left-4 bottom-20 md:left-6 md:bottom-6 w-auto rounded-full'
            : 'left-0 bottom-0 md:left-6 md:bottom-6 w-full md:w-[450px] rounded-t-2xl md:rounded-2xl'
        }`}
      >
        {isMinimized ? (
          <button
            onClick={() => setIsMinimized(false)}
            className="bg-gradient-to-r from-[#005E60] to-[#003D3F] px-5 py-3 rounded-full flex items-center gap-2 shadow-xl"
          >
            <MessageCircle size={18} className="text-[#F8C21C]" />
            <span className="text-white text-sm font-medium">Show Chat</span>
          </button>
        ) : (
          <div className="flex flex-col h-[85vh] md:h-[600px]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#005E60] to-[#003D3F] px-4 py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <Crown size={18} className="text-[#F8C21C]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm md:text-base flex items-center gap-2">
                      Associatte PropTech
                      <span className="bg-[#F8C21C] text-[#005E60] text-[8px] md:text-[9px] px-1.5 py-0.5 rounded-full">PREMIUM</span>
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                      <p className="text-[10px] md:text-xs text-white/80">Online • Priority Support</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Minimize2 size={14} className="text-white" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X size={14} className="text-white" />
                  </button>
                </div>
              </div>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-3 mt-3 pt-2 border-t border-white/10">
                <div className="flex items-center gap-1.5">
                  <Diamond size={10} className="text-[#F8C21C]" />
                  <span className="text-[9px] md:text-[10px] text-white/80">25+ Years</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={10} className="text-[#F8C21C]" />
                  <span className="text-[9px] md:text-[10px] text-white/80">10k+ Clients</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star size={10} className="text-[#F8C21C]" />
                  <span className="text-[9px] md:text-[10px] text-white/80">4.9 Rating</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!msg.isUser && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#005E60] to-[#003D3F] flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                      <Building2 size={12} className="text-[#F8C21C]" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-3 py-2 ${
                      msg.isUser
                        ? 'bg-[#005E60] text-white rounded-2xl rounded-br-md'
                        : 'bg-white text-gray-700 rounded-2xl rounded-bl-md shadow-sm border border-gray-100'
                    }`}
                  >
                    <div className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </div>
                    <div className={`text-[9px] mt-1 ${msg.isUser ? 'text-white/60' : 'text-gray-400'}`}>
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#005E60] to-[#003D3F] flex items-center justify-center mr-2">
                    <Building2 size={12} className="text-[#F8C21C]" />
                  </div>
                  <div className="bg-white px-4 py-2 rounded-2xl shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-[#005E60] rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-[#005E60] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-1.5 h-1.5 bg-[#005E60] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Lead Form */}
            {showLeadForm ? (
              <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                    <User size={14} className="text-[#005E60]" />
                    Get Personalised Assistance
                  </h4>
                  <button
                    onClick={() => setShowLeadForm(false)}
                    className="text-gray-400"
                  >
                    <X size={14} />
                  </button>
                </div>
                <form onSubmit={handleLeadSubmit} className="space-y-3">
                  {/* Name Field */}
                  <div>
                    <input
                      type="text"
                      placeholder="Full Name * (Letters only)"
                      value={leadData.name}
                      onChange={handleNameChange}
                      className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005E60] ${
                        validationErrors.name ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {validationErrors.name && (
                      <div className="flex items-center gap-1 mt-1 text-red-500 text-[10px]">
                        <AlertCircle size={10} />
                        <span>{validationErrors.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Mobile Field */}
                  <div>
                    <input
                      type="tel"
                      placeholder="Mobile Number * (10 digits)"
                      value={leadData.mobile}
                      onChange={handleMobileChange}
                      maxLength={10}
                      className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005E60] ${
                        validationErrors.mobile ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {validationErrors.mobile && (
                      <div className="flex items-center gap-1 mt-1 text-red-500 text-[10px]">
                        <AlertCircle size={10} />
                        <span>{validationErrors.mobile}</span>
                      </div>
                    )}
                  </div>

                  {/* Email Field */}
                  <input
                    type="email"
                    placeholder="Email Address (Optional)"
                    value={leadData.email}
                    onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005E60]"
                  />
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#005E60] text-white py-3 rounded-xl font-medium text-sm hover:bg-[#003D3F] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Submitting...' : 'Connect with Expert'}
                    <ArrowRight size={14} />
                  </button>
                  <p className="text-[9px] text-gray-400 text-center">
                    Our expert will contact you within 2 hours
                  </p>
                </form>
              </div>
            ) : (
              <>
                {/* Quick Replies */}
                <div className="px-4 py-3 border-t border-gray-100 bg-white">
                  <p className="text-[10px] font-medium text-gray-500 mb-2 flex items-center gap-1">
                    <Sparkles size={10} className="text-[#F8C21C]" />
                    Quick Actions
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickReplies.map((reply, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickReply(reply.text, reply.project)}
                        className="flex items-center justify-center gap-1.5 px-2 py-2.5 text-[11px] bg-gray-50 hover:bg-gray-100 rounded-xl transition-all border border-gray-200"
                      >
                        <span className="text-base">{reply.text.split(' ')[0]}</span>
                        <span className="text-gray-700 truncate">{reply.text.split(' ').slice(1).join(' ')}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Area */}
                <div className="p-3 border-t border-gray-100 bg-white rounded-b-2xl">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && setShowLeadForm(true)}
                      placeholder="Type your message..."
                      className="flex-1 bg-gray-50 text-gray-900 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005E60] border border-gray-200"
                    />
                    <button
                      onClick={() => setShowLeadForm(true)}
                      disabled={!input.trim()}
                      className="bg-[#005E60] text-white p-2.5 rounded-xl hover:bg-[#003D3F] transition-all disabled:opacity-50"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                  <p className="text-[8px] text-gray-400 text-center mt-2 flex items-center justify-center gap-1">
                    <Shield size={8} />
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