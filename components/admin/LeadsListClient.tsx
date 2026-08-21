'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, Trash2, MessageCircle, Search, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { ILead } from '@/lib/data-store';

// Every lead source is grouped into one of these top-level categories so the
// admin can view / export Calculator, Contact and Chatbot leads separately.
type CategoryId = 'calculator' | 'contact' | 'chatbot' | 'other';

const CATEGORY_LABELS: Record<CategoryId, string> = {
  calculator: 'Calculator',
  contact: 'Contact',
  chatbot: 'Chatbot',
  other: 'Other',
};

function categoryOf(source: string): CategoryId {
  if (source === 'calculator_page') return 'calculator';
  if (source === 'chatbot') return 'chatbot';
  if (source === 'contact_us' || source === 'property_enquiry' || source === 'associatte_website')
    return 'contact';
  return 'other';
}

const SOURCE_META: Record<string, { label: string; className: string }> = {
  calculator_page: { label: 'Instant Property Alert', className: 'bg-amber-100 text-amber-800' },
  contact_us: { label: 'Contact Us Form', className: 'bg-blue-100 text-blue-800' },
  property_enquiry: { label: 'Property Enquiry', className: 'bg-purple-100 text-purple-800' },
  associatte_website: { label: 'Property Enquiry', className: 'bg-purple-100 text-purple-800' },
  chatbot: { label: 'Live Chat', className: 'bg-green-100 text-green-800' },
  website: { label: 'Website', className: 'bg-gray-100 text-gray-700' },
};

function sourceMeta(source: string) {
  return SOURCE_META[source] || { label: source.replace(/_/g, ' '), className: 'bg-gray-100 text-gray-700' };
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

// Flatten a lead into a spreadsheet row (stable column order).
function toRow(lead: ILead) {
  return {
    Name: lead.name || '',
    Phone: lead.phone || '',
    Email: lead.email || '',
    Project: lead.project || '',
    Message: lead.message || '',
    Source: sourceMeta(lead.source).label,
    Category: CATEGORY_LABELS[categoryOf(lead.source)],
    'Captured At': formatDate(lead.capturedAt || lead.createdAt),
  };
}

export default function LeadsListClient({ leads }: { leads: ILead[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'all' | CategoryId>('all');

  // Counts per category, for the tab badges.
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: leads.length, calculator: 0, contact: 0, chatbot: 0, other: 0 };
    leads.forEach((l) => { c[categoryOf(l.source)]++; });
    return c;
  }, [leads]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      if (tab !== 'all' && categoryOf(l.source) !== tab) return false;
      if (!q) return true;
      return (
        l.phone.includes(q) ||
        (l.name || '').toLowerCase().includes(q) ||
        (l.email || '').toLowerCase().includes(q) ||
        (l.project || '').toLowerCase().includes(q) ||
        (l.message || '').toLowerCase().includes(q)
      );
    });
  }, [leads, query, tab]);

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

  // Download an Excel workbook. Each category gets its own sheet, plus an
  // "All Leads" sheet — so Calculator, Contact and Chatbot data stay separate.
  const handleExport = () => {
    const wb = XLSX.utils.book_new();

    const addSheet = (name: string, rows: ILead[]) => {
      const data = rows.length ? rows.map(toRow) : [{ Name: '', Phone: '', Email: '', Project: '', Message: '', Source: '', Category: '', 'Captured At': '' }];
      const ws = XLSX.utils.json_to_sheet(data);
      ws['!cols'] = [{ wch: 18 }, { wch: 14 }, { wch: 24 }, { wch: 24 }, { wch: 40 }, { wch: 20 }, { wch: 12 }, { wch: 20 }];
      XLSX.utils.book_append_sheet(wb, ws, name);
    };

    addSheet('All Leads', leads);
    (['calculator', 'contact', 'chatbot', 'other'] as CategoryId[]).forEach((cat) => {
      const rows = leads.filter((l) => categoryOf(l.source) === cat);
      if (rows.length) addSheet(CATEGORY_LABELS[cat], rows);
    });

    const stamp = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `associatte-leads-${stamp}.xlsx`);
  };

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
        <Phone className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900">No leads yet</h3>
        <p className="text-sm text-gray-500 mt-1">
          Enquiries from the calculator, contact form and chatbot will appear here.
        </p>
      </div>
    );
  }

  const TABS: { id: 'all' | CategoryId; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'calculator', label: 'Calculator' },
    { id: 'contact', label: 'Contact' },
    { id: 'chatbot', label: 'Chatbot' },
    ...(counts.other > 0 ? [{ id: 'other' as const, label: 'Other' }] : []),
  ];

  const Actions = ({ lead }: { lead: ILead }) => (
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
  );

  return (
    <div className="space-y-4">
      {/* Tabs + export */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                tab === t.id
                  ? 'bg-[#005E60] text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {t.label}
              <span className={`ml-1.5 text-xs ${tab === t.id ? 'text-white/80' : 'text-gray-400'}`}>
                {counts[t.id] ?? 0}
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#0f7b3f] text-white text-sm font-semibold rounded-lg hover:bg-[#0c6633] transition-colors"
        >
          <Download size={16} />
          Download Excel
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, phone, email, project…"
          className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#005E60]/30 focus:border-[#005E60]"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500 border-b border-gray-200">
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Phone</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Project / Message</th>
                <th className="px-5 py-3 font-semibold">Source</th>
                <th className="px-5 py-3 font-semibold">Captured</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => {
                const meta = sourceMeta(lead.source);
                return (
                  <tr key={lead._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 align-top">
                    <td className="px-5 py-3 text-gray-900">{lead.name || '—'}</td>
                    <td className="px-5 py-3 font-semibold text-gray-900 whitespace-nowrap">
                      <a href={`tel:${lead.phone}`} className="hover:text-[#005E60]">{lead.phone}</a>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{lead.email || '—'}</td>
                    <td className="px-5 py-3 text-gray-600 max-w-xs">
                      {lead.project && <div className="font-medium text-gray-800">{lead.project}</div>}
                      {lead.message && <div className="text-xs text-gray-500 line-clamp-2">{lead.message}</div>}
                      {!lead.project && !lead.message && '—'}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${meta.className}`}>
                        {meta.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 whitespace-nowrap">
                      {formatDate(lead.capturedAt || lead.createdAt)}
                    </td>
                    <td className="px-5 py-3"><Actions lead={lead} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {filtered.map((lead) => {
            const meta = sourceMeta(lead.source);
            return (
              <div key={lead._id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    {lead.name && <p className="font-semibold text-gray-900">{lead.name}</p>}
                    <a href={`tel:${lead.phone}`} className="text-[#005E60] font-medium">{lead.phone}</a>
                    {lead.email && <p className="text-xs text-gray-500 mt-0.5">{lead.email}</p>}
                    {lead.project && <p className="text-xs text-gray-700 mt-1 font-medium">{lead.project}</p>}
                    {lead.message && <p className="text-xs text-gray-500 line-clamp-2">{lead.message}</p>}
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${meta.className}`}>
                        {meta.label}
                      </span>
                      <span className="text-[11px] text-gray-400">{formatDate(lead.capturedAt || lead.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0"><Actions lead={lead} /></div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-gray-500">No leads in this category.</div>
        )}
      </div>
    </div>
  );
}
