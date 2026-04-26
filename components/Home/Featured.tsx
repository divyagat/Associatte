export default function Featured() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold text-center">
        Featured Properties
      </h2>

      <div className="grid md:grid-cols-3 gap-8 mt-10">
        {[1,2,3].map((item)=>(
          <div key={item} className="shadow-lg rounded-xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1572120360610-d971b9d7767c"
              className="h-60 w-full object-cover"
            />
            <div className="p-5">
              <h3 className="text-xl font-semibold">Luxury 2 BHK Apartment</h3>
              <p className="text-gray-600">Wakad, Pune</p>
              <p className="text-blue-600 font-bold mt-2">₹75 Lac</p>
              <button className="mt-4 bg-black text-white px-4 py-2 rounded">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}