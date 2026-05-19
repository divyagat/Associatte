// client/app/builders/[slug]/page.tsx
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
  'sai-paradise-group': ['paradise group', 'sai world', 'paradise', 'sai paradise'],
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
  // ✅ FIX: Use Array.from() instead of spread on Set for TS compatibility
  const allSlugs = Array.from(new Set([...builderSlugs, ...LOCATION_SLUGS]));
  return allSlugs.map((slug) => ({ slug }));
}

export default async function BuilderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).toLowerCase();
  const builderPatterns = BUILDER_SLUG_MAP[decodedSlug];
  
  if (process.env.NODE_ENV === 'development') {
    console.log('=== DEBUG BuilderPage ===');
    console.log('Slug:', decodedSlug);
    console.log('Patterns:', builderPatterns);
    console.log('Total properties in JSON:', properties.length);
    
    const lodhaTest = properties.find((p: any) => p.developer?.name?.toLowerCase().includes('lodha'));
    if (lodhaTest) {
      console.log('Sample Lodha project:', {
        name: lodhaTest.name,
        developer: lodhaTest.developer?.name,
        location: lodhaTest.location,
        normalized: normalize(lodhaTest.developer?.name)
      });
    }
  }
  
  const initialProjects = properties.filter((p: any) => {
    if (!p?.developer?.name) return false;
    
    if (LOCATION_SLUGS.includes(decodedSlug)) {
      return p.location?.toLowerCase() === decodedSlug;
    }
    
    if (builderPatterns) {
      const devName = normalize(p.developer.name);
      return builderPatterns.some(pattern => {
        const normPattern = normalize(pattern);
        return devName.includes(normPattern) || normPattern.includes(devName);
      });
    }
    
    return false;
  });
  
  if (process.env.NODE_ENV === 'development') {
    console.log('Filtered projects count:', initialProjects.length);
    console.log('First project:', initialProjects[0]?.name);
    console.log('=== END DEBUG ===');
  }
  
  if (initialProjects.length === 0) {
    console.warn(`No projects found for slug: ${decodedSlug}`);
    notFound();
  }

  return <BuilderProjectsList initialSlug={decodedSlug} initialProjects={initialProjects} />;
}