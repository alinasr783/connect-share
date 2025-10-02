import Heading from "../../ui/Heading";
import Button from "../../ui/Button";
import usePaymentMethods from "./usePaymentMethods";
import Spinner from "../../ui/Spinner";

function PaymentSettings() {
  const {paymentMethods, isLoadingPaymentMethods} = usePaymentMethods();

  if (isLoadingPaymentMethods) return <Spinner />;
  console.log(paymentMethods);
  return (
    <div className="py-8">
      <div className="max-w-5xl mx-auto px-4 bg-white rounded-2xl shadow-xs p-8">
        <Heading as="h2">Payment Settings</Heading>
        <p className="text-gray-600">
          Manage your payment settings and preferences.
        </p>

        <div className="space-y-8 mt-8">
          {paymentMethods.map((method) => {
            if (method.type === "bank") {
              const {bankName, accountNumber, holderName, swiftCode} =
                method.bank_details;

              return (
                <div
                  key={method.id}
                  className="border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Bank Transfer
                  </h3>
                  <p className="text-gray-600">{accountNumber}</p>
                  <p className="text-gray-600">{holderName}</p>
                  <p className="text-gray-600">{swiftCode}</p>
                </div>
              );
            } else {
              return (
                <div
                  key={method.id}
                  className="border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {method.name}
                  </h3>
                </div>
              );
            }
          })}
        </div>

        <div className="mt-8">
          <Button variation="primary" size="medium">
            Add New Method
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSettings;
