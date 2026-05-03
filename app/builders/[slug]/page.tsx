import BuilderHero from "@/components/builder-page/BuilderHero";
import BuilderProjects from "@/components/builder-page/BuilderProjects";

async function getBuilder(slug:string){
  const res = await fetch(`http://localhost:3000/api/builders/${slug}`,{cache:"no-store"});
  return res.json();
}

export default async function BuilderPage({params}:any) {
  const data = await getBuilder(params.slug);

  return (
    <main>
      <BuilderHero data={data}/>
      <BuilderProjects projects={data.projects}/>
    </main>
  );
}