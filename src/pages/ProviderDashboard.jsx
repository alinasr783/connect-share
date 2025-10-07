import Heading from "../ui/Heading";
import Row from "../ui/Row";
import useUser from "../features/auth/useUser";
import useEarnings from "../features/providerPayments/useEarnings";
import Spinner from "../ui/Spinner";
import ProviderRentalsTable from "../features/ProviderRentals/ProviderRentalsTable";
import ClinicManagment from "../features/providerDashboard/ClinicManagment";
import Stats from "../features/providerDashboard/Stats";

function ProviderDashboard() {
  const {user} = useUser();
  const {fullName} = user.user_metadata;

  const {totalEarnings, upcomingRentals, clinicOccupancy, isLoadingRentals} =
    useEarnings();

  if (isLoadingRentals) return <Spinner />;

  return (
    <>
      <Row type="col">
        <Heading as="h1">Dashboard</Heading>
        <p className="text-gray-500 text-sm">
          Welcome back, Dr. {fullName.split(" ")[0]}, Here is an overview of
          your clinic and rentals.
        </p>
      </Row>

      <Row type="col">
        <Heading as="h2">Overview</Heading>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Stats
            totalEarnings={totalEarnings}
            upcomingRentals={upcomingRentals}
            clinicOccupancy={clinicOccupancy}
          />
        </div>

        <div className="mt-6">
          <Heading as="h3">Clinic Management</Heading>
          <ClinicManagment />
        </div>

        <div className="mt-6">
          <p className="text-xl mb-2 text-gray-700 font-bold">
            Rental Activity
          </p>
          <ProviderRentalsTable />
        </div>
      </Row>
    </>
  );
}

export default ProviderDashboard;
