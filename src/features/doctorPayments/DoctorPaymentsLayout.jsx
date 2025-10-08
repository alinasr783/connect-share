import Stats from "./Stats";
import useDoctorPayments from "./useDoctorPayments";
import Spinner from "../../ui/Spinner";
import TransactionHistoryTable from "./TransactionHistoryTable";
import useDoctorTransactions from "./useDoctorTransactions";

function DoctorPaymentsLayout() {
  const {totalSpent, upcomingPayments, isLoadingBookings} = useDoctorPayments();
  const {transactionThisMonth, isLoadingTransactions} = useDoctorTransactions();

  if (isLoadingBookings || isLoadingTransactions)
    return <Spinner size="large" />;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Stats
          totalSpent={totalSpent}
          upcomingPayments={upcomingPayments}
          transactionThisMonth={transactionThisMonth}
        />
      </div>

      <TransactionHistoryTable />
    </div>
  );
}

export default DoctorPaymentsLayout;
