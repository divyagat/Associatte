import { getProjectsByCity } from "@/lib/getProject";

export default function CityProjects({ params }) {
  const projects = getProjectsByCity(params.city);

  return (
    <div className="grid">
      {projects.map((project) => (
        <Link key={project.slug} href={`/project/${project.slug}`}>
          <div>{project.name}</div>
        </Link>
      ))}
    </div>
  );
}