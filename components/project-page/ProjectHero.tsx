// client/components/project-page/ProjectHero.tsx
import type { Project } from '@/types/project';

export default function ProjectHero({ project }: { project: Project }) {
  return (
    <section className="relative h-[60vh] rounded-2xl overflow-hidden">
      <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
      <div className="absolute bottom-6 left-6 text-white">
        <h1 className="text-4xl font-bold">{project.name}</h1>
        <p className="text-lg mt-2">{project.location} • {project.price}</p>
      </div>
    </section>
  );
}