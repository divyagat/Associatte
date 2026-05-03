import Link from "next/link";

export default function BuilderCard({ builder }:any) {
  return (
    <Link href={`/builders/${builder.slug}`}>
      <div className="border rounded-xl p-6 hover:shadow cursor-pointer">
        <h3 className="text-xl font-semibold">{builder.name}</h3>
        <p className="text-gray-500">{builder.city.join(", ")}</p>
      </div>
    </Link>
  );
}