// lib/nav-sections.ts
//
// The top-level public navigation sections that an admin can switch on/off in
// Site Settings. This complements the per-category hide toggles (hiddenTypes /
// hiddenDeals): hiding a whole section removes its entire nav item (and its
// dropdown) from the public header. The `id` matches the `key` set on each entry
// in components/Layout/Header.tsx.

export interface NavSectionDef {
  id: string;
  label: string;
}

// Home is intentionally omitted — it is always available.
export const MAIN_NAV_SECTIONS: NavSectionDef[] = [
  { id: 'projects', label: 'Projects' },
  { id: 'properties', label: 'Properties' },
  { id: 'about', label: 'About Us' },
  { id: 'services', label: 'Services' },
  { id: 'builders', label: 'Know Your Developer' },
  { id: 'blog', label: 'Blog' },
  { id: 'contact', label: 'Contact Us' },
];

export const MAIN_NAV_SECTION_IDS: string[] = MAIN_NAV_SECTIONS.map((s) => s.id);
