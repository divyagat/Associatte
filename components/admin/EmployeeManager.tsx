'use client';

import { useState } from 'react';
import { UserPlus, Trash2, Mail, User, Lock, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface SafeEmployee {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function EmployeeManager({ initialEmployees }: { initialEmployees: SafeEmployee[] }) {
  const [employees, setEmployees] = useState<SafeEmployee[]>(initialEmployees);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const res = await fetch('/api/admin/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Failed to add employee');
        return;
      }
      setEmployees((prev) => [data, ...prev]);
      setForm({ name: '', email: '', password: '' });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this employee? They will no longer be able to sign in.')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/employees/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to remove employee');
      }
    } catch {
      alert('An error occurred while removing the employee');
    } finally {
      setDeletingId(null);
    }
  };

  const inputClass =
    'w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#005E60] text-gray-900 text-sm';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Add employee form */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-[#005E60]/10 flex items-center justify-center">
              <UserPlus className="text-[#005E60]" size={18} />
            </div>
            <h2 className="font-bold text-gray-900">Add Employee</h2>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-red-600 flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAdd} className="space-y-3">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                required
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                required
                autoComplete="off"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                placeholder="Temporary password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={inputClass + ' pr-11'}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#005E60] text-white font-semibold text-sm hover:bg-[#004a4d] transition-colors disabled:opacity-60"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
              {saving ? 'Adding...' : 'Add Employee'}
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-4 leading-relaxed">
            Employees can add &amp; edit properties but cannot delete them or access blogs and employee management.
          </p>
        </div>
      </div>

      {/* Employee list */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Employees</h2>
            <span className="text-sm text-gray-500">{employees.length} total</span>
          </div>

          {employees.length === 0 ? (
            <div className="text-center py-12 px-6">
              <p className="text-gray-500">No employees yet. Add your first one using the form.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {employees.map((emp) => (
                <li
                  key={emp.id}
                  className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-[#005E60]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-[#005E60]">
                      {emp.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{emp.name}</p>
                    <p className="text-sm text-gray-500 truncate">{emp.email}</p>
                  </div>
                  <span className="hidden sm:block text-xs text-gray-400 flex-shrink-0">
                    {new Date(emp.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(emp.id)}
                    disabled={deletingId === emp.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
                    aria-label={`Remove ${emp.name}`}
                  >
                    {deletingId === emp.id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
