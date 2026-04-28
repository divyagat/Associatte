import Hero from "@/components/Home/Hero";
import Advantages from "../components/Home/Advantages";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Spacer to prevent content overlap with absolutely positioned search */}
      <div className="h-64 md:h-80 lg:h-96"></div>

      {/* Featured Properties Section */}
      <section className="py-16 bg-white">
        <div className="w-full lg:max-w-[1280px] mx-auto px-4 lg:w-[85%]">
          <h2 className="text-2xl md:text-3xl font-bold font-montserrat text-[#234E70] mb-8">
            Featured Properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Property Cards - Replace with your component */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 bg-[#ECF1F8] flex items-center justify-center text-[#9e9e9e]">
                  Property Image
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[#234E70]">Property {i}</h3>
                  <p className="text-[#0E8744] font-medium">₹75L - ₹1Cr</p>
                  <p className="text-sm text-gray-600">Kharghar, Navi Mumbai</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-[#ECF1F8]">
        <div className="w-full lg:max-w-[1280px] mx-auto px-4 lg:w-[85%]">
          <h2 className="text-2xl md:text-3xl font-bold font-montserrat text-[#234E70] mb-8 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { step: "1", title: "Search", desc: "Find projects by locality, builder or budget" },
              { step: "2", title: "Connect", desc: "Get direct access to builder sales teams" },
              { step: "3", title: "Book", desc: "Zero brokerage, best price guaranteed" },
            ].map((item) => (
              <div key={item.step} className="p-6 bg-white rounded-xl shadow-sm">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#0E8744] text-white flex items-center justify-center font-bold text-xl">
                  {item.step}
                </div>
                <h3 className="font-semibold text-[#234E70] mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

     
 <Advantages/>

      {/* Footer */}
      {/* <footer className="py-8 bg-[#234E70] text-white">
        <div className="w-full lg:max-w-[1280px] mx-auto px-4 lg:w-[85%] text-center">
          <p className="text-sm opacity-90">© 2026 Housiey. All rights reserved.</p>
        </div>
      </footer> */}
    </main>

   
  );
}