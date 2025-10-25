const testimonialsData = [
  {
    id: 1,
    name: "Dr. Ali Nasr",
    role: "Implantologist",
    image: "https://i.ibb.co/pvdF3Nvc/download.jpg",
    testimonial: "This platform has revolutionized how I manage my practice. The flexibility and variety of locations are unmatched.",
    rating: 5
  },
  {
    id: 2,
    name: "Dr. Ghaber Ahmed",
    role: "Endodontist",
    image: "https://i.ibb.co/R4Msrst2/download.jpg",
    testimonial: "Finding a clinic space used to be a hassle, but this service has made it incredibly easy and efficient.",
    rating: 5
  },
  {
    id: 3,
    name: "Dr. Sarah Mohammed",
    role: "Cosmetic Dentist",
    image: "https://i.pravatar.cc/150?img=5",
    testimonial: "The seamless integration and professional support have transformed my patient management workflow completely.",
    rating: 4
  }
];

const StarRating = ({ rating }) => {
  return (
    <div className="flex gap-1 mb-3">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const TestimonialCard = ({ testimonial }) => (
  <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 relative overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800">
    {/* Background decoration */}
    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-bl-full" />
    
    {/* Quote icon */}
    <div className="absolute top-6 right-6 text-blue-200 dark:text-blue-700">
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
      </svg>
    </div>

    <div className="flex items-start space-x-4 relative z-10">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-0.5">
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-full h-full rounded-2xl object-cover"
            />
          </div>
          {/* Online indicator */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {testimonial.name}
            </h3>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              {testimonial.role}
            </p>
          </div>
        </div>

        <StarRating rating={testimonial.rating} />

        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          "{testimonial.testimonial}"
        </p>
      </div>
    </div>

    {/* Hover effect border */}
    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-colors duration-300 pointer-events-none" />
  </div>
);

function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Trusted by Professionals
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Doctors</span> Say
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Hear from healthcare professionals who have transformed their practice with our platform
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonialsData.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">500+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Medical Professionals</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">50+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Clinics Served</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">4.9/5</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">24/7</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Support Available</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;