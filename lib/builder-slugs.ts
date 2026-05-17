// client/lib/builder-slugs.ts

export const BUILDER_PRIMARY_SLUGS: Record<string, string> = {
  'mantra developers': 'mantra',
  'lodha group': 'lodha',
  'godrej properties': 'godrej',
  'birla estates': 'birla',
  'shapoorji pallonji': 'shapoorji',
  'jhamtani group': 'jhamtani',
  'kumar properties': 'kumar',
  'panchshil realty': 'panchshil',
  'tribeca developers': 'tribeca',
  'paradise group': 'sai-paradise-group',
  'sai world': 'sai-paradise-group',
  'today global': 'today-group',
  'magarpatta city': 'magarpatta-city',
  'runwal group': 'runwal-group',
  'l&t realty': 'l-t',
  'larsen & toubro realty': 'l-t',
  'mahindra lifespaces': 'mahindra',
  'majestique': 'majestique',
  'majestique group': 'majestique',
};

export const BUILDER_SLUG_MAP: Record<string, string[]> = {
  'mantra': ['mantra developers', 'mantra'],
  'lodha': ['lodha group', 'lodha'],
  'godrej': ['godrej properties', 'godrej'],
  'birla': ['birla estates', 'birla'],
  'shapoorji': ['shapoorji pallonji', 'shapoorji'],
  'jhamtani': ['jhamtani group', 'jhamtani'],
  'kumar': ['kumar properties', 'kumar'],
  'panchshil': ['panchshil realty', 'panchshil'],
  'tribeca': ['tribeca developers', 'tribeca'],
  'sai-paradise-group': ['paradise group', 'sai world', 'paradise', 'sai paradise'],
  'today-group': ['today global', 'today'],
  'magarpatta-city': ['magarpatta city', 'magarpatta'],
  'runwal-group': ['runwal group', 'runwal'],
  'l-t': ['l&t', 'l&t realty', 'larsen & toubro'],
  'mahindra': ['mahindra lifespaces', 'mahindra'],
  'majestique': ['majestique', 'majestique group'],
};

// ✅ ADD THIS: Explicit logo paths for each builder slug
export const BUILDER_LOGOS: Record<string, string> = {
  'mantra': '/logos/mantra.png',
  'lodha': '/logos/lodha.png',
  'godrej': '/logos/godrej.png',
  'birla': '/logos/birla.png',
  'shapoorji': '/logos/shapoorji.png',
  'jhamtani': '/logos/jhamtani.png',
  'kumar': '/logos/kumar.png',
  'panchshil': '/logos/panchshil.png',
  'tribeca': '/logos/tribeca.svg',
  'sai-paradise-group': '/logos/sai-paradise-group.png',
  'today-group': '/logos/today-group.png',
  'magarpatta-city': '/logos/magarpatta-city.png',
  'runwal-group': '/logos/runwal-group.png',
  'l-t': '/logos/l-t.png',
  'mahindra': '/logos/mahindra.png',
  'majestique': '/logos/majestique.png',
};

export const getBuilderSlug = (name: string): string => {
  const normalized = name.toLowerCase().trim();
  if (BUILDER_PRIMARY_SLUGS[normalized]) return BUILDER_PRIMARY_SLUGS[normalized];
  
  for (const [slug, patterns] of Object.entries(BUILDER_SLUG_MAP)) {
    if (patterns.some(p => normalized.includes(p.toLowerCase()) || p.toLowerCase().includes(normalized))) {
      return slug;
    }
  }
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
};

export const getBuilderYears = (name: string): string => {
  const map: Record<string, string> = {
    'mantra developers': '14y +', 'lodha group': '47y +', 'godrej properties': '30y +',
    'birla estates': '8y +', 'shapoorji pallonji': '155y +', 'jhamtani group': '19y +',
    'panchshil realty': '21y +', 'tribeca developers': '9y +', 'paradise group': '29y +',
    'today global': '20y +', 'magarpatta city': '24y +', 'runwal group': '46y +',
    'l&t realty': '75y +', 'mahindra lifespaces': '25y +', 'majestique': '15y +',
  };
  return map[name.toLowerCase()] || '10y +';
};

// ✅ UPDATED: Use explicit logo mapping with fallback
export const getBuilderLogo = (name: string): string => {
  const slug = getBuilderSlug(name);
  return BUILDER_LOGOS[slug] || '/logos/placeholder.png';
};

export const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/\s+/g, '');

export const builderMatchesSlug = (builderName: string, slug: string): boolean => {
  const patterns = BUILDER_SLUG_MAP[slug];
  if (!patterns) return false;
  const normName = normalize(builderName);
  return patterns.some(p => normName.includes(normalize(p)) || normalize(p).includes(normName));
};