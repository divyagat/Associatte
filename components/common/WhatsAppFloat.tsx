'use client';

import { MessageCircle } from 'lucide-react';

type Props = {
  number: string; // e.g. '918881188181'
  message?: string;
};

export default function WhatsAppFloat({
  number,
  message = 'Hi, I have a query about a property / home loan.',
}: Props) {
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 px-4 py-3 bg-[#25D366] text-white font-semibold rounded-full shadow-lg hover:bg-[#1fb855] transition-all hover:scale-105"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="hidden sm:inline">Quick Help</span>
    </a>
  );
}