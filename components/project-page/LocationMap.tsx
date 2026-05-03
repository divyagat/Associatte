export default function LocationMap({ data }: any) {
  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Location</h2>
        <div className="h-[350px] bg-gray-200 rounded-xl flex items-center justify-center">
          Google Map of {data.locality}
        </div>
      </div>
    </section>
  );
}