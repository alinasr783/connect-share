import "remixicon/fonts/remixicon.css";

const ContactUs = () => {
  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Us</h2>

        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <i className="ri-mail-line text-primary text-xl"></i>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Email Support
              </h3>
              <p className="text-gray-500 text-sm mb-2">Get help by email</p>
              <a
                href="mailto:support@clinicrent.com"
                className="text-primary hover:text-primary/80 transition-colors 
                duration-200 font-medium">
                support@clinicrent.com
              </a>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <i className="ri-phone-line text-primary text-xl"></i>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Phone Support
              </h3>
              <p className="text-gray-500 text-sm mb-2">Call our team</p>
              <a
                href="tel:+15559876543"
                className="text-gray-800 hover:text-gray-600 transition-colors 
                    duration-200 font-medium">
                +1 (555) 987-6543
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
