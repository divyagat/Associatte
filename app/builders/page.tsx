import BuilderCard from "@/components/builder-page/BuilderCard";

async function getBuilders(){
  const res = await fetch("http://localhost:3000/api/builders",{cache:"no-store"});
  return res.json();
}

export default async function BuildersPage() {
  const builders = await getBuilders();

  return (
    <main className="max-w-7xl mx-auto pt-24 px-4">
      <h1 className="text-3xl font-bold mb-8">Top Builders</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {builders.map((b:any)=>(
          <BuilderCard key={b.slug} builder={b}/>
        ))}
      </div>
    </main>
  );
}