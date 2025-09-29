import {useCallback, useState} from "react";
import "remixicon/fonts/remixicon.css";

const faqData = [
  {
    id: 1,
    question: "How does the booking process work?",
    answer:
      "Our booking process is simple and straightforward. Browse available clinic spaces, select your preferred date and time, make a secure payment, and receive instant confirmation. You'll get all the details including location, equipment available, and contact information.",
  },
  {
    id: 2,
    question: "What is the cancellation policy?",
    answer:
      "You can cancel your booking up to 24 hours before your scheduled appointment for a full refund. Cancellations made less than 24 hours in advance will incur a 50% cancellation fee. No-shows will be charged the full amount.",
  },
  {
    id: 3,
    question: "Are the clinic spaces equipped?",
    answer:
      "Yes, all our partner clinic spaces come fully equipped with essential medical equipment including examination tables, basic diagnostic tools, sterilization equipment, and necessary furniture. Specific equipment details are listed for each location.",
  },
  {
    id: 4,
    question: "How do I list my own clinic space?",
    answer:
      "To list your clinic space, create a provider account, complete our verification process, upload photos and details of your space, set your availability and pricing, and start receiving bookings. We handle payments and provide support throughout the process.",
  },
];

const FAQItem = ({item, isOpen, onToggle}) => (
  <div className="mb-4 overflow-hidden">
    <button
      onClick={() => onToggle(item.id)}
      className="w-full px-6 py-6 text-left flex items-center justify-between 
      hover:bg-gray-200 transition-colors duration-200 rounded-lg group">
      <span className="text-lg font-medium text-gray-700 pr-4">
        {item.question}
      </span>
      <div className="flex-shrink-0">
        <i
          className={`${
            isOpen ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"
          } text-xl text-gray-500`}></i>
      </div>
    </button>

    {isOpen && (
      <div className="px-6 pb-6 animate-fade-in">
        <div className="pt-2 border-t border-gray-100">
          <p className="text-gray-600 leading-relaxed">{item.answer}</p>
        </div>
      </div>
    )}
  </div>
);

function FAQ() {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = useCallback((id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  return (
    <section className="py-16" id="faq">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2>Frequently Asked Questions</h2>
          <p className="mt-3 text-gray-600">
            Have questions? We have answers. If you can't find what you're
            looking for, feel free to contact us.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {faqData.map((item) => (
            <FAQItem
              key={item.id}
              item={item}
              isOpen={openItems[item.id]}
              onToggle={toggleItem}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
