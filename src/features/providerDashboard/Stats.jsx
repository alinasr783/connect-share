import Stat from "./State";

function Stats({totalEarnings, upcomingRentals, clinicOccupancy}) {
  return (
    <>
      <Stat title="Total Earnings" value={totalEarnings} color="green" />
      <Stat title="Upcoming Bookings" num={upcomingRentals} color="blue" />
      <Stat title="Clinic Occupancy" rate={clinicOccupancy} color="orange" />
    </>
  );
}

export default Stats;
