import Link from "next/link";

export default function BuilderProjects({ projects }:any) {
  return (
    <div className="max-w-6xl mx-auto py-12 grid md:grid-cols-3 gap-6">
      {projects.map((p:any)=>(
        <Link key={p.slug} href={`/project/${p.slug}`}>
          <div className="border p-5 rounded-xl hover:shadow">
            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-gray-500">{p.city}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}