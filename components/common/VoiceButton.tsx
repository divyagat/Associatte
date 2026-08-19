'use client';

// Reusable microphone button backed by the browser Web Speech API. Free, no
// backend, supports Indian English/Hindi. Renders nothing on unsupported
// browsers (e.g. Firefox) so callers can drop it in safely. Architected so a
// server-side STT/TTS provider can replace the internals later.

import { useEffect, useRef, useState } from 'react';
import { Mic } from 'lucide-react';

interface VoiceButtonProps {
  onResult: (text: string) => void;        // final transcript when the user stops
  onInterim?: (text: string) => void;      // live partial transcript while speaking
  lang?: string;                           // BCP-47, default 'en-IN' (handles Hinglish)
  className?: string;
  title?: string;
}

export default function VoiceButton({
  onResult,
  onInterim,
  lang = 'en-IN',
  className = '',
  title = 'Speak your requirement',
}: VoiceButtonProps) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const recRef = useRef<any>(null);

  useEffect(() => {
    const SR = (typeof window !== 'undefined')
      ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      : null;
    setSupported(!!SR);
    return () => { try { recRef.current?.stop(); } catch { /* ignore */ } };
  }, []);

  const toggle = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    if (listening) { try { recRef.current?.stop(); } catch { /* ignore */ } return; }

    const rec = new SR();
    recRef.current = rec;
    rec.lang = lang;
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;

    let finalText = '';
    rec.onresult = (e: any) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interim += r[0].transcript;
      }
      onInterim?.(`${finalText} ${interim}`.trim());
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => {
      setListening(false);
      const t = finalText.trim();
      if (t) onResult(t);
    };

    setListening(true);
    try { rec.start(); } catch { setListening(false); }
  };

  if (!supported) return null;

  // NOTE: no position class in the base — the caller controls positioning
  // (e.g. `absolute right-3 …` to sit inside a search input). The listening
  // ping lives in its own `relative` wrapper so it never needs the button to be
  // positioned.
  return (
    <button
      type="button"
      onClick={toggle}
      title={title}
      aria-label="Voice search"
      aria-pressed={listening}
      className={`inline-flex items-center justify-center transition-colors ${
        listening ? 'text-red-600' : 'text-slate-400 hover:text-[#005E60]'
      } ${className}`}
    >
      <span className="relative flex items-center justify-center">
        {listening && (
          <span className="absolute -inset-2 rounded-full bg-red-500/20 animate-ping" aria-hidden="true" />
        )}
        <Mic className="w-5 h-5 relative" />
      </span>
    </button>
  );
}
