'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, Trash2, MessageCircle } from 'lucide-react';
import type { ILead } from '@/lib/data-store';

const SOURCE_LABELS: Record<string, string> = {
  calculator_page: 'Instant Property Alert (Calculator)',
  website: 'Website',
};

const INTENT_LABELS: Record<string, string> = {
  home_loan_callback: 'Home Loan Callback',
  general: 'General',
};

function label(map: Record<string, string>, value: string) {
  return map[value] || value.replace(/_/g, ' ');
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function LeadsListClient({ leads }: { leads: ILead[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this lead? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/leads?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to delete lead');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('An error occurred while deleting');
    } finally {
      setDeletingId(null);
    }
  };

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
        <Phone className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900">No leads yet</h3>
        <p className="text-sm text-gray-500 mt-1">
          Phone numbers submitted from the calculator page will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-500 border-b border-gray-200">
              <th className="px-5 py-3 font-semibold">Phone</th>
              <th className="px-5 py-3 font-semibold">Source</th>
              <th className="px-5 py-3 font-semibold">Intent</th>
              <th className="px-5 py-3 font-semibold">Captured</th>
              <th className="px-5 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                <td className="px-5 py-3 font-semibold text-gray-900">
                  <a href={`tel:${lead.phone}`} className="hover:text-[#005E60]">
                    {lead.phone}
                  </a>
                </td>
                <td className="px-5 py-3 text-gray-700">{label(SOURCE_LABELS, lead.source)}</td>
                <td className="px-5 py-3 text-gray-700">{label(INTENT_LABELS, lead.intent)}</td>
                <td className="px-5 py-3 text-gray-500 whitespace-nowrap">
                  {formatDate(lead.capturedAt || lead.createdAt)}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <a
                      href={`https://wa.me/91${lead.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-[#128C7E] hover:bg-green-50 rounded-lg transition-colors"
                      title="Message on WhatsApp"
                    >
                      <MessageCircle size={18} />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDelete(lead._id)}
                      disabled={deletingId === lead._id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete lead"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-gray-100">
        {leads.map((lead) => (
          <div key={lead._id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <a href={`tel:${lead.phone}`} className="font-semibold text-gray-900">
                  {lead.phone}
                </a>
                <p className="text-xs text-gray-500 mt-0.5">{label(SOURCE_LABELS, lead.source)}</p>
                <p className="text-xs text-gray-500">{label(INTENT_LABELS, lead.intent)}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDate(lead.capturedAt || lead.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <a
                  href={`https://wa.me/91${lead.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-[#128C7E] hover:bg-green-50 rounded-lg transition-colors"
                >
                  <MessageCircle size={18} />
                </a>
                <button
                  type="button"
                  onClick={() => handleDelete(lead._id)}
                  disabled={deletingId === lead._id}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
