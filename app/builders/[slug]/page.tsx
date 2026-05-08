import { notFound } from 'next/navigation';
import BuilderProjectsList from '@/components/builder-page/BuilderProjectsList';
import properties from '../../../data/properties.json';

const BUILDER_SLUG_MAP: Record<string, string[]> = {
  'mantra': ['mantra developers', 'mantra'],
  'lodha': ['lodha group', 'lodha'],
  'godrej': ['godrej properties', 'godrej'],
  'birla': ['birla estates', 'birla'],
  'shapoorji': ['shapoorji pallonji', 'shapoorji'],
  'jhamtani': ['jhamtani group', 'jhamtani'],
  'kumar': ['kumar properties', 'kumar'],
  'panchshil': ['panchshil realty', 'panchshil'],
  'tribeca': ['tribeca developers', 'tribeca'],
  'sai-paradise-group': ['paradise group', 'sai world', 'paradise'],
  'today-group': ['today global', 'today'],
  'magarpatta-city': ['magarpatta city', 'magarpatta'],
  'runwal-group': ['runwal group', 'runwal'],
  'l-t': ['l&t', 'l&t realty', 'larsen & toubro'],
  'mahindra': ['mahindra lifespaces', 'mahindra'],
  'majestique': ['majestique', 'majestique group'],
};

const LOCATION_SLUGS = ['pune', 'mumbai', 'kdmc'];

const normalize = (str: string) => 
  str.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/\s+/g, '');

export function generateStaticParams() {
  const builderSlugs = Object.keys(BUILDER_SLUG_MAP);
  const allSlugs = [...new Set([...builderSlugs, ...LOCATION_SLUGS])];
  return allSlugs.map((slug) => ({ slug }));
}

export default async function BuilderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).toLowerCase();
  const builderPatterns = BUILDER_SLUG_MAP[decodedSlug];
  
  const initialProjects = properties.filter((p: any) => {
    if (p.location === decodedSlug) return true;
    if (builderPatterns) {
      const devName = normalize(p.developer.name);
      return builderPatterns.some(pattern => 
        devName.includes(normalize(pattern)) || normalize(pattern).includes(devName)
      );
    }
    return false;
  });
  
  if (initialProjects.length === 0) notFound();

  return <BuilderProjectsList initialSlug={decodedSlug} initialProjects={initialProjects} />;
}