export default function Amenities({ data }: any) {
  return (
    <section className="max-w-6xl mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold mb-6">Amenities</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.amenities.map((item: string) => (
          <div key={item} className="bg-gray-100 p-4 rounded">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}