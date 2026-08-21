'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // ignore — we redirect regardless
    } finally {
      router.replace('/admin/login');
      router.refresh();
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-red-600 font-semibold hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors disabled:opacity-60"
    >
      <LogOut size={18} />
      <span>{loading ? 'Logging out...' : 'Logout'}</span>
    </button>
  );
}
