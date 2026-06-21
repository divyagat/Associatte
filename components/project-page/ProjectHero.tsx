// client/components/project-page/ProjectHero.tsx
import Image from 'next/image';
import type { Project } from '@/types/project';

export default function ProjectHero({ project }: { project: Project }) {
  return (
    <section className="relative h-[60vh] rounded-2xl overflow-hidden">
      <Image
        src={project.image}
        alt={project.name}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute bottom-6 left-6 text-white">
        <h1 className="text-4xl font-bold">{project.name}</h1>
        <p className="text-lg mt-2">{project.location} • {project.price}</p>
      </div>
    </section>
  );
}