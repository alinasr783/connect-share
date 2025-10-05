import {useState, useEffect} from "react";
import Modal from "../../ui/Modal";
import Button from "../../ui/Button";
import FormRow from "../../ui/FormRow";

function PaymentMethodModal({
  isOpen,
  onClose,
  onSubmit,
  paymentMethod = null,
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    type: "",
    details: "",
    accountNumber: "",
    email: "",
    bankName: "",
    routingNumber: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (paymentMethod) {
      setFormData({
        type: paymentMethod.type || "",
        details: paymentMethod.details || "",
        accountNumber: paymentMethod.accountNumber || "",
        email: paymentMethod.email || "",
        bankName: paymentMethod.bankName || "",
        routingNumber: paymentMethod.routingNumber || "",
      });
    } else {
      setFormData({
        type: "",
        details: "",
        accountNumber: "",
        email: "",
        bankName: "",
        routingNumber: "",
      });
    }
    setErrors({});
  }, [paymentMethod, isOpen]);

  const paymentTypes = [
    {value: "Bank Transfer", label: "Bank Transfer", icon: "ri-bank-line"},
    {
      value: "Digital Wallet",
      label: "Digital Wallet",
      icon: "ri-wallet-3-line",
    },
    {value: "PayPal", label: "PayPal", icon: "ri-paypal-line"},
    {value: "Stripe", label: "Stripe", icon: "ri-credit-card-line"},
    {value: "Venmo", label: "Venmo", icon: "ri-wallet-line"},
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.type) {
      newErrors.type = "Payment type is required";
    }

    if (formData.type === "Bank Transfer") {
      if (!formData.bankName) newErrors.bankName = "Bank name is required";
      if (!formData.accountNumber)
        newErrors.accountNumber = "Account number is required";
      if (!formData.routingNumber)
        newErrors.routingNumber = "Routing number is required";
    } else if (
      formData.type === "Digital Wallet" ||
      formData.type === "PayPal"
    ) {
      if (!formData.email) newErrors.email = "Email is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    let details = "";
    if (formData.type === "Bank Transfer") {
      details = `Account ending in ****${formData.accountNumber.slice(-4)}`;
    } else if (
      formData.type === "Digital Wallet" ||
      formData.type === "PayPal"
    ) {
      details = formData.email;
    }

    const paymentMethodData = {
      type: formData.type,
      details,
      accountNumber: formData.accountNumber,
      email: formData.email,
      bankName: formData.bankName,
      routingNumber: formData.routingNumber,
    };

    onSubmit(paymentMethodData);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({...prev, [field]: value}));
    if (errors[field]) {
      setErrors((prev) => ({...prev, [field]: ""}));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={paymentMethod ? "Edit Payment Method" : "Add Payment Method"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormRow label="Payment Type" error={errors.type}>
          <select
            value={formData.type}
            onChange={(e) => handleInputChange("type", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">Select payment type</option>
            {paymentTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </FormRow>

        {formData.type === "Bank Transfer" && (
          <>
            <FormRow label="Bank Name" error={errors.bankName}>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => handleInputChange("bankName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter bank name"
              />
            </FormRow>

            <FormRow label="Account Number" error={errors.accountNumber}>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) =>
                  handleInputChange("accountNumber", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter account number"
              />
            </FormRow>

            <FormRow label="Routing Number" error={errors.routingNumber}>
              <input
                type="text"
                value={formData.routingNumber}
                onChange={(e) =>
                  handleInputChange("routingNumber", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter routing number"
              />
            </FormRow>
          </>
        )}

        {(formData.type === "Digital Wallet" || formData.type === "PayPal") && (
          <FormRow label="Email" error={errors.email}>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter email address"
            />
          </FormRow>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : paymentMethod ? "Update" : "Add"} Payment
            Method
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default PaymentMethodModal;

