import {useMemo, useState} from "react";
import toast from "react-hot-toast";
import Button from "../../ui/Button";
import Spinner from "../../ui/Spinner";
import {formatCurrency} from "../../utils/helpers";
import useAmountForWithdrawal from "./useAmontForWithdrawal";
import useCreateWithdrawal from "./useCreateWithdrawal";
import usePaymentMethods from "../settings/usePaymentMethods";

function RequestWithdrawal() {
  const [amount, setAmount] = useState(null);
  const [selectedMethodId, setSelectedMethodId] = useState("");
  const [amountError, setAmountError] = useState("");

  const {availableAmount, isLoading, hasAvailableAmount} =
    useAmountForWithdrawal();

  const {createWithdrawal, isCreating} = useCreateWithdrawal();
  const {paymentMethods, isLoadingPaymentMethods} = usePaymentMethods();

  const options = useMemo(() => {
    return (paymentMethods || []).map((m) => {
      const details =
        typeof m.method_details === "string"
          ? tryParse(m.method_details)
          : m.method_details;
      const end = m.end_numbers
        ? ` (**** ${String(m.end_numbers).slice(-4)})`
        : "";
      const label =
        m.type === "bank"
          ? `Bank Transfer${end}`
          : m.type === "wallet"
          ? `${details?.provider || "Wallet"}${end}`
          : `${m.type}${end}`;
      return {id: m.id, type: m.type, label};
    });
  }, [paymentMethods]);

  const handleAmountChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    const maxAmount = availableAmount;

    setAmountError("");

    if (value > maxAmount) {
      setAmountError(
        `Amount cannot exceed available balance of ${formatCurrency(maxAmount)}`
      );
      setAmount(value);
      return;
    }

    const validAmount = Math.min(Math.max(value, 0), maxAmount);
    setAmount(validAmount);
  };

  const isValidAmount = () => {
    if (!amount || amount <= 0) return false;
    if (amount > availableAmount) return false;
    if (!hasAvailableAmount) return false;
    if (amountError) return false;

    return true;
  };

  const handleWithdraw = () => {
    setAmountError("");

    if (!amount || amount <= 0) {
      setAmountError("Please enter a valid amount");
      return;
    }

    if (amount > availableAmount) {
      setAmountError(
        `Amount cannot exceed available balance of ${formatCurrency(
          availableAmount
        )}`
      );
      return;
    }

    if (!hasAvailableAmount) {
      toast.error("No funds available for withdrawal");
      return;
    }

    if (amountError) {
      return;
    }

    const chosen = options.find(
      (o) => String(o.id) === String(selectedMethodId)
    );
    if (!chosen) {
      toast.error("Please select a withdrawal method");
      return;
    }

    createWithdrawal(
      {
        amount,
        methodId: chosen.id,
        methodType: chosen.type,
      },
      {
        onSuccess: () => {
          toast.success("Withdrawal request submitted successfully!");
          setAmount(null);
        },
        onError: (error) => {
          console.error("Withdrawal failed:", error);
          toast.error("Withdrawal request failed. Please try again.");
        },
      }
    );
  };

  const handleMaxAmount = () => {
    setAmountError("");
    setAmount(availableAmount);
  };

  function tryParse(json) {
    try {
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  if (isLoading || isLoadingPaymentMethods) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-xs">
        <div className="flex items-center justify-center py-8">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-xs">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        Request Withdrawal
      </h3>

      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Available for withdrawal</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(availableAmount)}
          </p>
          {!hasAvailableAmount && (
            <p className="text-sm text-red-600 mt-1">
              No funds available for withdrawal
            </p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <button
              type="button"
              onClick={handleMaxAmount}
              disabled={!hasAvailableAmount}
              className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed">
              Use Max Amount
            </button>
          </div>
          <div className="relative">
            <span
              className="absolute left-3 top-1/2 transform
              -translate-y-1/2 text-gray-500">
              EGP
            </span>
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 
                rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="0.00"
              min="0"
              max={availableAmount}
              disabled={!hasAvailableAmount}
            />
          </div>
          {amountError && (
            <p className="text-sm text-red-600 mt-1">{amountError}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Withdrawal Method
          </label>
          <select
            value={selectedMethodId}
            onChange={(e) => setSelectedMethodId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={!hasAvailableAmount}>
            <option value="" disabled>
              Select a method
            </option>
            {options.map((o) => (
              <option key={o.id} value={String(o.id)}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <Button
          onClick={handleWithdraw}
          disabled={!isValidAmount() || isCreating}
          variation="primary"
          size="medium"
          className="w-full">
          {isCreating ? (
            <>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <i className="ri-play-fill"></i>
              <span>Withdraw Funds</span>
            </>
          )}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Withdrawal requests are processed within 3-5 business days.
        </p>
      </div>
    </div>
  );
}

export default RequestWithdrawal;
