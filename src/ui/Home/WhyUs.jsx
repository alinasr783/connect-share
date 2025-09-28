const features = [
  {
    id: 1,
    icon: "ri-calendar-line",
    title: "Flexible Scheduling",
    desc: "Book spaces for specific hours or days, fitting your schedule perfectly.",
  },
  {
    id: 2,
    icon: "ri-map-pin-2-line",
    title: "Prime Locations",
    desc: "Access clinics in high-demand areas, ensuring convenience for your patients.",
  },
  {
    id: 3,
    icon: "ri-price-tag-3-line",
    title: "Cost-Effective Solutions",
    desc: "Optimize your expenses with competitive pricing and transparent fees.",
  },
];

function WhyUs() {
  return (
    <section className="bg-gray-100" id="why-us">
      <div className="py-16">
        <div className="text-center mb-12">
          <h2>Why Choose Us?</h2>
          <p className="mt-3 text-gray-600">
            Our platform offers numerous advantages for doctors seeking clinic
            spaces.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.id}
              className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-secondary)] flex items-center justify-center text-[var(--color-primary)]">
                <i className={`${f.icon} text-2xl`}></i>
              </div>
              <div>
                <h3 className="text-gray-900 font-semibold">{f.title}</h3>
                <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyUs;
