'use client';

interface BuilderHeroProps {
  slug: string;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  builders: string[];
  selectedBuilder: string | null;
  onBuilderChange: (val: string | null) => void;
}

export default function BuilderHero({
  slug,
  searchQuery,
  onSearchChange,
  builders,
  selectedBuilder,
  onBuilderChange,
}: BuilderHeroProps) {
  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h1 className="text-3xl font-bold capitalize mb-2">{slug.replace(/-/g, ' ')} Projects</h1>
      <p className="text-gray-600 mb-4">Search & filter premium properties by builder</p>

      <input
        type="text"
        placeholder="Search by project, builder, or area..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full md:w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
      />

      <div className="flex flex-wrap gap-2 mt-4">
        <button
          onClick={() => onBuilderChange(null)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
            !selectedBuilder ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          All Builders
        </button>
        {builders.map((builder) => (
          <button
            key={builder}
            onClick={() => onBuilderChange(builder === selectedBuilder ? null : builder)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              selectedBuilder === builder
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {builder}
          </button>
        ))}
      </div>
    </section>
  );
}