import { redirect } from 'next/navigation';
import { getAdminRole } from '@/lib/admin-auth';
import { getChatbotConfig } from '@/lib/chatbot-store';
import ChatbotManager from '@/components/admin/ChatbotManager';

export const dynamic = 'force-dynamic';

export default async function ChatbotAdminPage() {
  // Middleware already blocks employees, but guard here too (defense in depth).
  const role = await getAdminRole();
  if (role !== 'admin') redirect('/admin');

  const config = await getChatbotConfig();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">AI Assistant</h1>
        <p className="text-gray-600 mt-1">
          Manage the live-assistance chatbot: greeting, quick replies and the Q&amp;A it answers
          visitors with. Changes go live on the website immediately.
        </p>
      </div>

      <ChatbotManager initialConfig={config} />
    </div>
  );
}
