'use client';

import { useState } from 'react';
import EnquiryPopup from '../../components/common/EnquiryPopup';

export default function EnquiryTestPage() {
  const [open, setOpen] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <button
        onClick={() => setOpen(true)}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
      >
        Open Enquiry Popup
      </button>

      <EnquiryPopup isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
}