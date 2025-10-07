import Stats from "./Stats";
import useDoctorPayments from "./useDoctorPayments";
import Spinner from "../../ui/Spinner";
import TransactionHistoryTable from "./TransactionHistoryTable";

function DoctorPaymentsLayout() {
  const {
    totalSpent,
    upcomingPayments,
    transactionThisMonth,
    isLoadingBookings,
  } = useDoctorPayments();

  if (isLoadingBookings) return <Spinner />;

  return (
    <div className="space-y-8">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Stats
          totalSpent={totalSpent}
          upcomingPayments={upcomingPayments}
          transactionThisMonth={transactionThisMonth}
        />
      </div>

      {/* Transaction History Table */}
      <TransactionHistoryTable />
    </div>
  );
}

export default DoctorPaymentsLayout;
