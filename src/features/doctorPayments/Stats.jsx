import Stat from "./Stat";

function Stats({totalSpent, upcomingPayments, transactionThisMonth}) {
  return (
    <>
      <Stat
        title="Total Spent"
        value={totalSpent}
        icon="ri-wallet-line"
        color="green"
      />
      <Stat
        title="Upcoming Payments"
        value={upcomingPayments}
        icon="ri-bank-card-line"
        color="blue"
      />
      <Stat
        title="Transaction This Month"
        num={transactionThisMonth}
        icon="ri-calendar-line"
        color="orange"
      />
    </>
  );
}

export default Stats;
