'use client';

import { 
  VISIBLE_ADMIN_SECTIONS, // <-- Changed from ADMIN_SECTIONS
  ADMIN_ACTIONS, 
  Permissions, 
  AdminSection, 
  AdminAction 
} from '@/lib/admin-permissions';

const SECTION_LABELS: Record<string, string> = {
  properties: 'Properties',
  projects: 'Projects',
  blogs: 'Blogs', // Kept for type safety, but won't render
};

// Maps string actions to objects to match your original code structure (action.key)
const ACTIONS = ADMIN_ACTIONS.map((a) => ({ 
  key: a, 
  label: a.charAt(0).toUpperCase() + a.slice(1) 
}));

interface PermissionMatrixProps {
  value: Permissions;
  onChange: (permissions: Permissions) => void;
  disabled?: boolean;
}

export default function PermissionMatrix({ value, onChange, disabled }: PermissionMatrixProps) {
  const toggle = (sectionKey: string, actionKey: string) => {
    onChange({
      ...value,
      [sectionKey]: {
        // Fallback to empty permissions if the section is missing from the object
        ...(value[sectionKey as AdminSection] || { add: false, edit: false, delete: false }),
        [actionKey]: !value[sectionKey as AdminSection]?.[actionKey as AdminAction],
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* Use VISIBLE_ADMIN_SECTIONS here to hide Blogs from the UI */}
      {VISIBLE_ADMIN_SECTIONS.map((key) => (
        <div key={key} className="border border-gray-200 rounded-lg p-4 bg-white">
          <h4 className="text-sm font-semibold text-gray-800 mb-3">
            {SECTION_LABELS[key] || key}
          </h4>
          <div className="flex flex-wrap gap-4">
            {ACTIONS.map((action) => (
              <label
                key={action.key}
                className={`inline-flex items-center gap-2 text-sm cursor-pointer ${
                  disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <input
                  type="checkbox"
                  disabled={disabled}
                  // ✅ FIX: Added optional chaining (?.) and nullish coalescing (??) 
                  // This prevents the "Cannot read properties of undefined" crash
                  checked={value[key]?.[action.key as AdminAction] ?? false}
                  onChange={() => toggle(key, action.key)}
                  className="w-4 h-4 rounded border-gray-300 text-[#005E60] focus:ring-[#005E60]"
                />
                <span className="capitalize text-gray-700">{action.label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}