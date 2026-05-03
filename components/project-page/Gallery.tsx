import Image from "next/image";

export default function Gallery({ data }: any) {
  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Gallery</h2>

        <div className="grid md:grid-cols-3 gap-4">
          {data.images.map((img: string) => (
            <div key={img} className="relative h-[220px]">
              <Image src={img} alt="" fill className="rounded-xl object-cover"/>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}