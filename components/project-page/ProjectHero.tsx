"use client";
import Image from "next/image";

export default function ProjectHero({ data }: any) {
  return (
    <section className="bg-white pt-24 pb-10 border-b">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10">
        
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {data.name}
          </h1>
          <p className="text-gray-500 mt-2">
            {data.locality}, {data.city}
          </p>

          <div className="mt-4 text-2xl font-semibold text-green-700">
            ₹ {data.priceFrom}
          </div>

          <div className="mt-3 flex gap-3">
            {data.bhk.map((b: string) => (
              <span key={b} className="px-3 py-1 bg-gray-100 rounded">
                {b}
              </span>
            ))}
          </div>
        </div>

        <div className="relative h-[300px]">
          <Image src={data.images[0]} alt="" fill className="rounded-xl object-cover"/>
        </div>
      </div>
    </section>
  );
}