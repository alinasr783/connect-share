import Stats from "./Stats";
import FinancialTrends from "./FinancialTrends";
import RequestWithdrawal from "./RequestWithdrawal";
import TransactionHistory from "./TransactionHistory";

function PaymentsLayout() {
  return (
    <div className="space-y-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Stats />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.3fr] gap-6">
        <FinancialTrends />
        <RequestWithdrawal />
      </div>

      <div>
        <TransactionHistory />
      </div>
    </div>
  );
}

export default PaymentsLayout;
