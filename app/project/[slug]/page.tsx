import { notFound } from "next/navigation";

import ProjectHero from "@/components/project-page/ProjectHero";
import ProjectOverview from "@/components/project-page/ProjectOverview";
import PriceSection from "@/components/project-page/PriceSection";
import Amenities from "@/components/project-page/Amenities";
import Gallery from "@/components/project-page/Gallery";
import FloorPlans from "@/components/project-page/FloorPlans";
import LocationMap from "@/components/project-page/LocationMap";
import BuilderInfo from "@/components/project-page/BuilderInfo";
import SimilarProjects from "@/components/project-page/SimilarProjects";
import FAQ from "@/components/project-page/FAQ";

async function getProject(slug: string) {
  try {
    const res = await fetch(
      `http://localhost:5000/api/projects/${slug}`,
      { cache: "no-store" }
    );

    // if API not working → return null instead of crash
    if (!res.ok) return null;

    return res.json();
  } catch (error) {
    return null;
  }
}

type Props = {
  params: { slug: string };
};

export default async function ProjectPage({ params }: Props) {
  const project = await getProject(params.slug);

  // ⭐ This prevents error page crash
  if (!project) return notFound();

  return (
    <main className="bg-white">
      <ProjectHero data={project} />
      <ProjectOverview data={project} />
      <PriceSection data={project} />
      <Amenities data={project} />
      <Gallery data={project} />
      <FloorPlans />
      <LocationMap data={project} />
      <BuilderInfo data={project} />
      <SimilarProjects />
      <FAQ />
    </main>
  );
}