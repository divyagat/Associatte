import { getProjectBySlug } from "@/lib/getProject";
import { notFound } from "next/navigation";

import ProjectHero from "@/components/project-page/ProjectHero";
import ProjectOverview from "@/components/project-page/ProjectOverview";
import PriceSection from "@/components/project-page/PriceSection";
import Amenities from "@/components/project-page/Amenities";
import FloorPlans from "@/components/project-page/FloorPlans";
import Gallery from "@/components/project-page/Gallery";
import BuilderInfo from "@/components/project-page/BuilderInfo";
import FAQ from "@/components/project-page/FAQ";
import SimilarProjects from "@/components/project-page/SimilarProjects";

type Props = {
  params: { slug: string };
};

export default function ProjectPage({ params }: Props) {
  const project = getProjectBySlug(params.slug);

  if (!project) return notFound();

  return (
    <>
      <ProjectHero project={project} />
      <ProjectOverview project={project} />
      <PriceSection project={project} />
      <Amenities project={project} />
      <FloorPlans project={project} />
      <Gallery project={project} />
      <BuilderInfo project={project} />
      <FAQ project={project} />
      <SimilarProjects currentSlug={project.slug} city={project.city} />
    </>
  );
}