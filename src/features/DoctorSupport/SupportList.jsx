import {useCallback, useState} from "react";
import "remixicon/fonts/remixicon.css";

const faqData = [
  {
    id: 1,
    question: "How do I book a clinic?",
    answer:
      "To book a clinic, navigate to the 'Find Clinics' section from your dashboard. Browse available clinic spaces, select your preferred date and time slot, review the clinic details and equipment available, then proceed to payment. You'll receive instant confirmation with all booking details including location and contact information.",
  },
  {
    id: 2,
    question: "How do I cancel a booking?",
    answer:
      "You can cancel your booking by going to your dashboard and clicking on 'My Bookings'. Find the booking you want to cancel and click the 'Cancel' button. Cancellations made more than 24 hours in advance receive a full refund, while cancellations within 24 hours incur a 50% cancellation fee.",
  },
  {
    id: 3,
    question: "What are the payment methods available?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express), debit cards, and digital payment methods including PayPal and Apple Pay. All payments are processed securely through our encrypted payment gateway. You'll receive a receipt via email after successful payment.",
  },
  {
    id: 4,
    question: "How can I update my profile information?",
    answer:
      "To update your profile, go to the 'Settings' section in your dashboard. You can modify your personal information, contact details, medical license information, and professional credentials. Make sure to keep your information up-to-date for verification purposes and to ensure smooth booking processes.",
  },
];

const FAQItem = ({item, isOpen, onToggle}) => (
  <div className="mb-4 overflow-hidden bg-white rounded-lg border border-gray-200">
    <button
      onClick={() => onToggle(item.id)}
      className="w-full px-6 py-4 text-left flex items-center justify-between 
      hover:bg-gray-50 transition-colors duration-200 group">
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
      <div className="px-6 pb-4 animate-fade-in">
        <div className="pt-2 border-t border-gray-100">
          <p className="text-gray-600 leading-relaxed">{item.answer}</p>
        </div>
      </div>
    )}
  </div>
);

function SupportList() {
  const [openItems, setOpenItems] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const toggleItem = useCallback((id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const filteredFaqData = faqData.filter(
    (item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-3xl">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Frequently Asked Questions (FAQ)
        </h2>

        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="ri-search-line text-gray-400"></i>
            </div>
            <input
              type="text"
              placeholder="Search for a question..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-icon"
            />
          </div>
        </div>

        <div className="space-y-2">
          {filteredFaqData.length > 0 ? (
            filteredFaqData.map((item) => (
              <FAQItem
                key={item.id}
                item={item}
                isOpen={openItems[item.id]}
                onToggle={toggleItem}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <i className="ri-search-line text-4xl mb-2"></i>
              <p>No questions found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SupportList;
