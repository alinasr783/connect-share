import Spinner from "../../ui/Spinner";
import FinancialTrends from "./FinancialTrends";
import RequestWithdrawal from "./RequestWithdrawal";
import Stats from "./Stats";
import TransactionHistory from "./TransactionHistory";
import useEarnings from "./useEarnings";
import usePayouts from "./usePayouts";

function PaymentsLayout() {
  const {totalEarnings, isLoadingRentals, outstandingBalance, numDays} =
    useEarnings();
  const {totalPayouts, isLoadingPayouts} = usePayouts();

  if (isLoadingRentals || isLoadingPayouts)
    return (
      <div className="flex items-center justify-center w-full">
        <Spinner />
      </div>
    );

  return (
    <div className="space-y-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Stats
          totalEarnings={totalEarnings}
          totalPayouts={totalPayouts}
          outstandingBalance={outstandingBalance}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.3fr] gap-6">
        <FinancialTrends
          totalEarnings={totalEarnings}
          totalPayouts={totalPayouts}
          numDays={numDays}
        />
        <RequestWithdrawal />
      </div>

      <div>
        <TransactionHistory />
      </div>
    </div>
  );
}

export default PaymentsLayout;
