import properties from "../../../data/properties.json";
import Image from "next/image";
import Link from "next/link";

type PageProps = {
  params: Promise<{ city: string }>;
};

export default async function CityPage({ params }: PageProps) {
  const { city } = await params;
  const cityName = city.toLowerCase();

  // Filter projects by city
  const cityProjects = properties.filter(
    (p: any) => p.location.toLowerCase() === cityName
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-8 capitalize">
        Properties in {city}
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        {cityProjects.map((project: any) => (
          <Link key={project.slug} href={`/property/${project.slug}`}> 
            <div className="border rounded-xl overflow-hidden shadow hover:shadow-xl transition">
              
              <Image
                src={project.image}
                alt={project.name}
                width={400}
                height={250}
                className="w-full h-[220px] object-cover"
              />

              <div className="p-4">
                <h2 className="text-xl font-semibold">{project.name}</h2>
                <p className="text-gray-600">{project.price}</p>
              </div>

            </div>
          </Link>
        ))}
      </div>

      {cityProjects.length === 0 && (
        <p className="mt-10 text-gray-500">No projects found.</p>
      )}
    </div>
  );
}