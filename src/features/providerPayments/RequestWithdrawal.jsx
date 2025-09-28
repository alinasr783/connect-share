import {useState} from "react";
import useEarnings from "./useEarnings";
import {formatCurrency} from "../../utils/helpers";
import Button from "../../ui/Button";

function RequestWithdrawal() {
  const {outstandingBalance} = useEarnings();
  const [amount, setAmount] = useState(0);
  const [withdrawalMethod, setWithdrawalMethod] = useState("bank");

  const handleWithdraw = () => {
    if (amount > 0 && amount <= outstandingBalance) {
      // Handle withdrawal logic here
      console.log("Withdrawing:", amount);
      alert(`Withdrawal request for $${amount} submitted successfully!`);
    } else {
      alert("Please enter a valid amount within your available balance.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xs">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        Request Withdrawal
      </h3>

      <div className="space-y-4">
        {/* Available Balance */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Available for withdrawal</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(outstandingBalance)}
          </p>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full pl-8 pr-4 py-3 border border-gray-300 
                rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                focus:border-transparent"
              placeholder="0.00"
              min="0"
              max={outstandingBalance}
            />
          </div>
        </div>

        {/* Withdrawal Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Withdrawal Method
          </label>
          <select
            value={withdrawalMethod}
            onChange={(e) => setWithdrawalMethod(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="bank">Bank Transfer (**** 1234)</option>
            <option value="paypal">PayPal</option>
            <option value="crypto">Cryptocurrency</option>
          </select>
        </div>

        {/* Withdraw Button */}
        <Button
          onClick={handleWithdraw}
          type="primary"
          size="medium"
          className="w-full">
          <i className="ri-play-fill"></i>
          <span>Withdraw Funds</span>
        </Button>

        {/* Note */}
        <p className="text-xs text-gray-500 text-center">
          Withdrawal requests are processed within 3-5 business days.
        </p>
      </div>
    </div>
  );
}

export default RequestWithdrawal;
