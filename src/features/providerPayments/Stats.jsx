import Stat from "./Stat";

function Stats({totalEarnings, totalPayouts, outstandingBalance}) {
  return (
    <>
      <Stat
        title="Total Earnings"
        value={totalEarnings}
        icon="ri-wallet-line"
        color="green"
      />
      <Stat
        title="Total Payouts"
        value={totalPayouts}
        icon="ri-bank-card-line"
        color="blue"
      />
      <Stat
        title="Outstanding Balance"
        value={outstandingBalance}
        icon="ri-time-line"
        color="orange"
      />
    </>
  );
}

export default Stats;
