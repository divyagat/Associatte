export default function BuilderInfo({ data }: any) {
  return (
    <section className="max-w-6xl mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold mb-4">About Builder</h2>
      <p className="text-gray-600">
        Developed by {data.builderName}
      </p>
    </section>
  );
}