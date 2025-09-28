import ProviderRentalsTable from "../features/ProviderRentals/ProviderRentalsTable";
import Heading from "../ui/Heading";
import Row from "../ui/Row";

function ProviderRentals() {
  return (
    <>
      <Row type="col">
        <Heading as="h1">Rentals</Heading>
      </Row>

      <Row type="col">
        <ProviderRentalsTable />
      </Row>
    </>
  );
}

export default ProviderRentals;
