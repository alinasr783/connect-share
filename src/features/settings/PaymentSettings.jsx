import Heading from "../../ui/Heading";
import Spinner from "../../ui/Spinner";
import Button from "../../ui/Button";
import usePaymentMethods from "./usePaymentMethods";
import PaymentMethodItem from "./PaymentMethodItem";
import {useState} from "react";
import AddPaymentMethodModal from "./AddPaymentMethodModal";

function PaymentSettings() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const {paymentMethods, isLoadingPaymentMethods} = usePaymentMethods();

  if (isLoadingPaymentMethods) return <Spinner />;

  return (
    <div className="py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-8">
          <Heading as="h2">Payment Settings</Heading>
          <p className="text-gray-600 mt-2">Configure your payout methods.</p>
        </div>

        <div className="space-y-4">
          {paymentMethods?.length ? (
            paymentMethods.map((method) => (
              <PaymentMethodItem key={method.id} method={method} />
            ))
          ) : (
            <p className="text-gray-500">No payment methods added yet.</p>
          )}
        </div>

        <div className="mt-6">
          <Button variation="primary" onClick={() => setIsAddOpen(true)}>
            + Add payment method
          </Button>
        </div>
      </div>

      {isAddOpen && (
        <AddPaymentMethodModal onClose={() => setIsAddOpen(false)} />
      )}
    </div>
  );
}

export default PaymentSettings;
