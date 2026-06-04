export default function WhyUs() {
  return (
    <section className="py-16">
      <h2 className="section-title text-center">Why Choose Us</h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mt-10 px-6">
        <div>
          <h3 className="text-xl font-semibold">Verified Properties</h3>
          <p className="text-gray-600 mt-2">100% verified listings.</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold">Best Deals</h3>
          <p className="text-gray-600 mt-2">Exclusive builder prices.</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold">Free Site Visit</h3>
          <p className="text-gray-600 mt-2">Schedule anytime.</p>
        </div>
      </div>
    </section>
  );
}