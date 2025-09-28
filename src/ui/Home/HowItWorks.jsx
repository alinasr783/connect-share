// Steps data
const ownersSteps = [
  {
    id: 1,
    title: "List Your Space",
    desc: "Create an account, add your clinic details, upload photos, and set your availability and pricing.",
  },
  {
    id: 2,
    title: "Receive Bookings",
    desc: "Get notified when doctors book your space. You have full control to accept or decline requests.",
  },
  {
    id: 3,
    title: "Get Paid",
    desc: "Receive secure payments directly to your account after a successful booking is completed.",
  },
];

const doctorsSteps = [
  {
    id: 1,
    title: "Find a Clinic",
    desc: "Search for available clinic spaces by location, specialty, and desired time. Compare options with detailed listings.",
  },
  {
    id: 2,
    title: "Book Your Space",
    desc: "Select your preferred time slots and book instantly through our secure platform.",
  },
  {
    id: 3,
    title: "Start Practicing",
    desc: "Arrive at the clinic and start seeing your patients in a professional and fully-equipped environment.",
  },
];

function NumberBadge({n}) {
  return (
    <div
      className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-secondary)] 
        text-[var(--color-primary)] font-bold grid place-items-center">
      {n}
    </div>
  );
}

function StepsList({title, steps}) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">{title}</h3>
      <ul className="space-y-6">
        {steps.map((s) => (
          <li key={s.id} className="flex items-start gap-4">
            <NumberBadge n={s.id} />
            <div>
              <p className="text-gray-900 font-semibold">{s.title}</p>
              <p className="mt-1 text-gray-600 text-sm leading-relaxed">
                {s.desc}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function HowItWorks() {
  return (
    <section className="bg-gray-100" id="how-it-works">
      <div className="py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2>Start in 3 Simple Steps</h2>
          <p className="mt-3 text-gray-600">
            A seamless process for both clinic owners and doctors.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          <StepsList title="For Clinic Owners" steps={ownersSteps} />
          <StepsList title="For Doctors" steps={doctorsSteps} />
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
