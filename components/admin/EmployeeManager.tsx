'use client';

import { useState } from 'react';
import {
  UserPlus, Trash2, Mail, User, Lock, Loader2, AlertCircle, Eye, EyeOff,
  ShieldCheck, Pencil, X, Check,
} from 'lucide-react';
import PermissionMatrix from './PermissionMatrix';
import {
  Permissions,
  DEFAULT_EMPLOYEE_PERMISSIONS,
  ADMIN_SECTIONS,
  ADMIN_ACTIONS,
  sanitizePermissions,
} from '@/lib/admin-permissions';

interface SafeEmployee {
  id: string;
  name: string;
  email: string;
  permissions: Permissions;
  createdAt: string;
}

const clonePerms = (p: Permissions): Permissions => sanitizePermissions(p);

const SECTION_LABELS: Record<string, string> = { 
  properties: 'Properties', 
  projects: 'Projects',
  // blogs: 'Blogs' 
};

/** Compact summary of an employee's access. */
function AccessSummary({ permissions }: { permissions: Permissions }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-1.5">
      {ADMIN_SECTIONS.map((section) => {
        const granted = ADMIN_ACTIONS.filter((a) => permissions[section]?.[a]);
        const has = granted.length > 0;
        return (
          <span
            key={section}
            className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full ${
              has ? 'bg-[#005E60]/10 text-[#005E60]' : 'bg-gray-100 text-gray-400'
            }`}
          >
            <span className="font-semibold">{SECTION_LABELS[section] || section}:</span>
            {has ? granted.map((a) => a[0].toUpperCase() + a.slice(1)).join(', ') : 'No access'}
          </span>
        );
      })}
    </div>
  );
}

export default function EmployeeManager({ initialEmployees }: { initialEmployees: SafeEmployee[] }) {
  // ✅ Sanitize initial data to ensure no missing keys from the database
  const [employees, setEmployees] = useState<SafeEmployee[]>(
    initialEmployees.map(emp => ({ ...emp, permissions: clonePerms(emp.permissions) }))
  );
  
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [permissions, setPermissions] = useState<Permissions>(clonePerms(DEFAULT_EMPLOYEE_PERMISSIONS));
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPerms, setEditPerms] = useState<Permissions>(clonePerms(DEFAULT_EMPLOYEE_PERMISSIONS));
  const [savingEdit, setSavingEdit] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const res = await fetch('/api/admin/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, permissions }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Failed to add employee');
        return;
      }
      setEmployees((prev) => [{ ...data, permissions: clonePerms(data.permissions) }, ...prev]);
      setForm({ name: '', email: '', password: '' });
      setPermissions(clonePerms(DEFAULT_EMPLOYEE_PERMISSIONS));
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (emp: SafeEmployee) => {
    setEditingId(emp.id);
    setEditPerms(clonePerms(emp.permissions));
  };

  const handleSaveEdit = async (id: string) => {
    setSavingEdit(true);
    try {
      const res = await fetch(`/api/admin/employees/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions: editPerms }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || 'Failed to update access');
        return;
      }
      setEmployees((prev) => prev.map((e) => (e.id === id ? { ...data, permissions: clonePerms(data.permissions) } : e)));
      setEditingId(null);
    } catch {
      alert('An error occurred while updating access');
    } finally {
      setSavingEdit(false);
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

            <div className="pt-1">
              <div className="flex items-center gap-1.5 mb-2 text-sm font-semibold text-gray-700">
                <ShieldCheck size={16} className="text-[#005E60]" />
                Access rights
              </div>
              <PermissionMatrix value={permissions} onChange={setPermissions} />
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Grant only what this employee needs — e.g. tick Properties → Add for someone who
                only adds properties, or Projects → Edit for someone who manages projects.
              </p>
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
                <li key={emp.id} className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#005E60]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-[#005E60]">
                        {emp.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{emp.name}</p>
                      <p className="text-sm text-gray-500 truncate">{emp.email}</p>
                      <AccessSummary permissions={emp.permissions} />
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => (editingId === emp.id ? setEditingId(null) : startEdit(emp))}
                        className="p-2 text-[#005E60] hover:bg-[#005E60]/10 rounded-lg transition-colors"
                        aria-label={`Edit access for ${emp.name}`}
                      >
                        {editingId === emp.id ? <X size={18} /> : <Pencil size={18} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(emp.id)}
                        disabled={deletingId === emp.id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        aria-label={`Remove ${emp.name}`}
                      >
                        {deletingId === emp.id ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {editingId === emp.id && (
                    <div className="mt-3 ml-0 sm:ml-14 rounded-lg bg-gray-50 border border-gray-200 p-3">
                      <p className="text-xs font-semibold text-gray-600 mb-2">Edit access rights</p>
                      <PermissionMatrix
                        value={editPerms}
                        onChange={setEditPerms}
                        disabled={savingEdit}
                      />
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(emp.id)}
                          disabled={savingEdit}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#005E60] text-white text-sm font-medium hover:bg-[#004a4d] transition-colors disabled:opacity-60"
                        >
                          {savingEdit ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                          Save access
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          disabled={savingEdit}
                          className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}