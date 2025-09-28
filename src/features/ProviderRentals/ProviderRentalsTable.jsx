import {useState} from "react";
import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import useProviderRentals from "./useProviderRentals";
import ProviderRentalsRow from "./ProviderRentalsRow";
import ProviderRentalsOperations from "./ProviderRentalsOperations";

function ProviderRentalsTable() {
  const {rentals, isLoadingRentals} = useProviderRentals();
  const [filteredRentals, setFilteredRentals] = useState([]);

  if (isLoadingRentals) return <Spinner />;

  return (
    <div className="space-y-4">
      <ProviderRentalsOperations
        rentals={rentals}
        onFilteredRentalsChange={setFilteredRentals}
      />

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
          {filteredRentals && filteredRentals.length > 0 ? (
            filteredRentals.map((rental) => (
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
