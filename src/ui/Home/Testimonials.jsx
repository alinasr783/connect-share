const testimonialsData = [
  {
    id: 1,
    name: "Dr. Amelia Harper",
    image: "/images/doctor1.jpg",
    testimonial:
      "This platform has revolutionized how I manage my practice. The flexibility and variety of locations are unmatched.",
  },
  {
    id: 2,
    name: "Dr. Ethan Carter",
    image: "/images/doctor2.jpg",
    testimonial:
      "Finding a clinic space used to be a hassle, but this service has made it incredibly easy and efficient.",
  },
];

const TestimonialCard = ({testimonial}) => (
  <div className="bg-white rounded-lg shadow-xs p-8 flex items-start space-x-4 ">
    <div className="flex-shrink-0">
      <div className="w-14 h-14 rounded-full flex items-center justify-center">
        <div
          className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--color-primary)] 
          to-[var(--color-secondary)] flex items-center justify-center">
          <svg
            className="w-8 h-8 text-white"
            fill="currentColor"
            viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>

    <div className="flex-1">
      <h3 className="text-md font-semibold text-gray-900 mb-2">
        {testimonial.name}
      </h3>
      <p className="text-gray-600 text-sm italic leading-relaxed">
        "{testimonial.testimonial}"
      </p>
    </div>
  </div>
);

function Testimonials() {
  return (
    <section className="py-16" id="testimonials">
      <div className="">
        <div className="text-center mb-12">
          <h2>What our doctors say</h2>
          <p className="mt-3 text-gray-600">
            Hear from professionals who have transformed their practice with us.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonialsData.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
