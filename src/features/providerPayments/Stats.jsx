import Stat from "./Stat";
import useEarnings from "./useEarnings";
import Spinner from "../../ui/Spinner";

function Stats() {
  const {totalEarnings, totalPayouts, outstandingBalance, isLoadingRentals} =
    useEarnings();

  if (isLoadingRentals) {
    return <Spinner />;
  }

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
