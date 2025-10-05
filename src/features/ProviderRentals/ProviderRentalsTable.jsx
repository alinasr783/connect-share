import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import ProviderRentalsRow from "./ProviderRentalsRow";
import useProviderRentals from "./useProviderRentals";

function ProviderRentalsTable() {
  const {rentals, isLoadingRentals} = useProviderRentals();

  if (isLoadingRentals) return <Spinner />;

  return (
    <div className="space-y-4">
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>CLINIC</Table.Head>
            <Table.Head>DATE</Table.Head>
            <Table.Head>TIME</Table.Head>
            <Table.Head>TENANT</Table.Head>
            <Table.Head>STATUS</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rentals && rentals.length > 0 ? (
            rentals.map((rental) => (
              <ProviderRentalsRow key={rental.id} rental={rental} />
            ))
          ) : (
            <Table.Empty message="No rental bookings found" />
          )}
        </Table.Body>
      </Table>
    </div>
  );
}

export default ProviderRentalsTable;
