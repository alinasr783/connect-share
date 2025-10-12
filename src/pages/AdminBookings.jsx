import BookingsOperations from "../features/adminBookings/BookingsOperations";
import BookingsTable from "../features/adminBookings/BookingsTable";
import Heading from "../ui/Heading";
import Row from "../ui/Row";

function AdminBookings() {
  return (
    <>
      <Row type="col">
        <Heading as="h1">Bookings</Heading>

        <BookingsOperations />
      </Row>

      <Row type="col">
        <BookingsTable />
      </Row>
    </>
  );
}

export default AdminBookings;
