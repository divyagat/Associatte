import Link from 'next/link';
import Image from 'next/image';
// ✅ Fixed: 2 levels up to reach client/, then into data/
import properties from '../../data/properties.json';

type Property = typeof properties[number];

export default function BuilderCard({ project }: { project: Property }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-all duration-200"
    >
      <div className="relative h-48 w-full bg-gray-100">
        <Image
          src={project.image}
          alt={project.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate">{project.name}</h3>
        <p className="text-sm text-gray-500">
          {project.fullLocation.area}, {project.fullLocation.city}
        </p>
        <p className="text-blue-600 font-medium mt-2">{project.priceDetails.range}</p>
        <p className="text-xs text-gray-400 mt-1">by {project.developer.name}</p>
      </div>
    </Link>
  );
}