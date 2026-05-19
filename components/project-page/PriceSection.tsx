export default function PriceSection({ data }: any) {
  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Price Details</h2>

        <div className="border rounded-xl p-6 bg-white">
          <p>Starting Price</p>
          <h3 className="text-3xl font-bold text-green-700">
            ₹ {data.priceFrom}
          </h3>
          <p className="mt-2 text-gray-500">
            Possession: {data.possession}
          </p>
        </div>
      </div>
    </section>
  );
}