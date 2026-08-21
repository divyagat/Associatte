import { getAllLeads } from '@/lib/data-store';
import { getAdminRole } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';
import { Phone } from 'lucide-react';
import LeadsListClient from '@/components/admin/LeadsListClient';

export const dynamic = 'force-dynamic';

export default async function AdminLeadsPage() {
  // Leads are admin-only (also enforced in middleware).
  const role = await getAdminRole();
  if (role !== 'admin') redirect('/admin');

  const leads = await getAllLeads();

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-[#005E60] rounded-lg flex items-center justify-center flex-shrink-0">
          <Phone className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Leads &amp; Enquiries</h1>
          <p className="text-gray-600 mt-1">
            All enquiries captured from the calculator, contact form and chatbot.
            {leads.length > 0 && (
              <span className="ml-1 font-semibold text-gray-900">{leads.length} total.</span>
            )}
          </p>
        </div>
      </div>

      <LeadsListClient leads={leads} />
    </div>
  );
}
