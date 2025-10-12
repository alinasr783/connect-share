import Pagination from "../../ui/Pagination";
import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import BookingTableRow from "./BookingTableRow";
import useBookings from "./useBookings";

function BookingsTable() {
  const {bookings, count, isLoadingBookings} = useBookings();

  if (isLoadingBookings) return <Spinner />;

  return (
    <>
      <Table columnTemplate="1fr 1fr 1fr 1fr 1fr 0.3fr 1fr 0.2fr">
        <Table.Header>
          <Table.Row>
            <Table.Head>Clinic Name</Table.Head>
            <Table.Head>Doctor</Table.Head>
            <Table.Head>Host</Table.Head>
            <Table.Head>Date</Table.Head>
            <Table.Head>Rental Type</Table.Head>
            <Table.Head>Payment Status</Table.Head>
            <Table.Head>Booking Status</Table.Head>
            <Table.Head>Action</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {bookings.length === 0 ? (
            <Table.Empty message="No bookings found" />
          ) : (
            bookings.map((booking) => (
              <BookingTableRow key={booking.id} booking={booking} />
            ))
          )}
        </Table.Body>
      </Table>
      <Pagination count={count} />
    </>
  );
}

export default BookingsTable;
