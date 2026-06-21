'use client';

import { Building2, FileText } from 'lucide-react';
import type { Permissions, AdminSection, AdminAction } from '@/lib/admin-permissions';

const SECTIONS: { key: AdminSection; label: string; icon: typeof Building2 }[] = [
  { key: 'properties', label: 'Properties', icon: Building2 },
  { key: 'blogs', label: 'Blogs', icon: FileText },
];

const ACTIONS: { key: AdminAction; label: string }[] = [
  { key: 'add', label: 'Add' },
  { key: 'edit', label: 'Edit' },
  { key: 'delete', label: 'Delete' },
];

/**
 * Checkbox grid for granting an employee per-section access. Controlled —
 * `value` is the current permissions, `onChange` receives the next ones.
 */
export default function PermissionMatrix({
  value,
  onChange,
  disabled,
}: {
  value: Permissions;
  onChange: (next: Permissions) => void;
  disabled?: boolean;
}) {
  const toggle = (section: AdminSection, action: AdminAction) => {
    onChange({
      ...value,
      [section]: { ...value[section], [action]: !value[section][action] },
    });
  };

  return (
    <div className="rounded-lg border border-gray-200 divide-y divide-gray-100">
      {SECTIONS.map(({ key, label, icon: Icon }) => (
        <div key={key} className="p-3">
          <div className="flex items-center gap-2 mb-2.5">
            <Icon size={16} className="text-[#005E60]" />
            <span className="text-sm font-semibold text-gray-900">{label}</span>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 pl-1">
            {ACTIONS.map((action) => (
              <label
                key={action.key}
                className={`flex items-center gap-2 text-sm ${
                  disabled ? 'text-gray-400' : 'text-gray-700 cursor-pointer'
                }`}
              >
                <input
                  type="checkbox"
                  disabled={disabled}
                  checked={value[key][action.key]}
                  onChange={() => toggle(key, action.key)}
                  className="w-4 h-4 rounded border-gray-300 text-[#005E60] focus:ring-[#005E60]"
                />
                {action.label}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
