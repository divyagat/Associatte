import BuilderCard from './BuilderCard';
// ✅ Fixed: 2 levels up to reach client/, then into data/
import properties from '../../data/properties.json';

type Property = typeof properties[number];

export default function BuilderProjects({ projects }: { projects: Property[] }) {
  if (projects.length === 0) {
    return <p className="text-center py-12 text-gray-500 text-lg">No projects match your search criteria.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <BuilderCard key={project.slug} project={project} />
      ))}
    </div>
  );
}