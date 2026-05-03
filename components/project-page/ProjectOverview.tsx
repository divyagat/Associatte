export default function ProjectOverview({ data }: any) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-4">About Project</h2>
      <p className="text-gray-600 leading-7">{data.description}</p>
    </section>
  );
}