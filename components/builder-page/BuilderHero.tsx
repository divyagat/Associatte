export default function BuilderHero({ data }:any) {
  return (
    <section className="bg-gray-100 py-16 text-center">
      <h1 className="text-4xl font-bold">{data.name} Projects</h1>
    </section>
  );
}