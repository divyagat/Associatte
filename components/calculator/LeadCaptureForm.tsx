'use client';

import { useState } from 'react';
import { Phone, CheckCircle2, Loader2 } from 'lucide-react';

export default function LeadCaptureForm() {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 10) {
      setStatus('error');
      setErrorMsg('Please enter a valid 10-digit number.');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleaned,
          source: 'calculator_page',
          intent: 'home_loan_callback',
          capturedAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error('Failed to submit');
      setStatus('success');
      setPhone('');
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
        <span>Thanks! We’ll call you back within 30 minutes.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="tel"
          inputMode="numeric"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter 10-digit mobile number"
          className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#005E60]/30 focus:border-[#005E60]"
          maxLength={15}
          required
        />
      </div>
      {status === 'error' && (
        <p className="text-xs text-red-600">{errorMsg}</p>
      )}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-[#005E60] text-white font-semibold rounded-lg hover:bg-[#004a4d] transition-colors disabled:opacity-60"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
          </>
        ) : (
          'Instant Property Alert'
        )}
      </button>
      <p className="text-[11px] text-gray-500 text-center">
        Your number is sent securely to our dashboard. No spam, ever.
      </p>
    </form>
  );
}