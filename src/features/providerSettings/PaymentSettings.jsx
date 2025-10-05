import Heading from "../../ui/Heading";

function PaymentSettings() {
  return (
    <div className="py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-8">
          <Heading as="h2">Payment Settings</Heading>
          <p className="text-gray-600 mt-2">Configure your payout methods.</p>
        </div>
      </div>
    </div>
  );
}

export default PaymentSettings;
