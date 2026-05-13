// client/app/builders/[slug]/page.tsx
import { notFound } from 'next/navigation';
import BuilderProjectsList from '@/components/builder-page/BuilderProjectsList';
import properties from '../../../data/properties.json'; // ✅ Verify this path is correct

const BUILDER_SLUG_MAP: Record<string, string[]> = {
  'mantra': ['mantra developers', 'mantra'],
  'lodha': ['lodha group', 'lodha'], // ✅ This should match "Lodha Group"
  'godrej': ['godrej properties', 'godrej'],
  'birla': ['birla estates', 'birla'],
  'shapoorji': ['shapoorji pallonji', 'shapoorji'],
  'jhamtani': ['jhamtani group', 'jhamtani'],
  'kumar': ['kumar properties', 'kumar'],
  'panchshil': ['panchshil realty', 'panchshil'],
  'tribeca': ['tribeca developers', 'tribeca'],
  'sai-paradise-group': ['paradise group', 'sai world', 'paradise', 'sai paradise'], // ✅ Added 'sai paradise'
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
  
  // 🔍 DEBUG: Log to console (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('=== DEBUG BuilderPage ===');
    console.log('Slug:', decodedSlug);
    console.log('Patterns:', builderPatterns);
    console.log('Total properties in JSON:', properties.length);
    
    // Check first Lodha project
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
    // ✅ Safety: check p.developer?.name exists
    if (!p?.developer?.name) return false;
    
    // ✅ Location page: match by location field (case-insensitive)
    if (LOCATION_SLUGS.includes(decodedSlug)) {
      return p.location?.toLowerCase() === decodedSlug;
    }
    
    // ✅ Builder page: match by developer name
    if (builderPatterns) {
      const devName = normalize(p.developer.name);
      return builderPatterns.some(pattern => {
        const normPattern = normalize(pattern);
        return devName.includes(normPattern) || normPattern.includes(devName);
      });
    }
    
    return false;
  });
  
  // 🔍 DEBUG: Log results
  if (process.env.NODE_ENV === 'development') {
    console.log('Filtered projects count:', initialProjects.length);
    console.log('First project:', initialProjects[0]?.name);
    console.log('=== END DEBUG ===');
  }
  
  // ✅ Show 404 if no projects found
  if (initialProjects.length === 0) {
    console.warn(`No projects found for slug: ${decodedSlug}`);
    notFound();
  }

  return <BuilderProjectsList initialSlug={decodedSlug} initialProjects={initialProjects} />;
}