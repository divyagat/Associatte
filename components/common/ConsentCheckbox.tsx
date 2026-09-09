// components/common/ConsentCheckbox.tsx
'use client';

import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

interface ConsentCheckboxProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  /** Use light text/link colours on dark or gradient backgrounds. */
  variant?: 'light' | 'dark';
}

/**
 * Legal consent checkbox shown at the bottom of lead-capture forms.
 * Text is fixed per the compliance requirement (DNC/NDNC override).
 */
export default function ConsentCheckbox({
  id = 'consent',
  checked,
  onChange,
  error,
  variant = 'light',
}: ConsentCheckboxProps) {
  const isDark = variant === 'dark';
  const textCls = isDark ? 'text-white/80' : 'text-gray-600';
  const linkCls = isDark ? 'text-[#F8C21C]' : 'text-[#005E60]';

  return (
    <div className="space-y-1.5">
      <div className="flex items-start gap-2.5">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 w-4 h-4 flex-shrink-0 accent-[#005E60] cursor-pointer"
        />
        <label htmlFor={id} className={`text-[11px] leading-relaxed ${textCls} cursor-pointer`}>
          I Consent to The Processing of Provided Data According To{' '}
          <Link href="/privacy-policy" target="_blank" className={`${linkCls} font-medium hover:underline`}>
            Privacy Policy
          </Link>{' '}
          |{' '}
          <Link href="/terms-conditions" target="_blank" className={`${linkCls} font-medium hover:underline`}>
            Terms &amp; Conditions
          </Link>
          , I Authorize Associatte and its representatives to Call, SMS, Email or WhatsApp Me About
          Its Products and Offers. This Consent Overrides Any Registration For DNC/NDNC.
        </label>
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
