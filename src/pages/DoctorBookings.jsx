import BookingsList from "../features/doctorBookings/BookingsList";
import Heading from "../ui/Heading";
import Row from "../ui/Row";

function DoctorBookings() {
  return (
    <>
      <Row type="col">
        <Heading as="h1">My Bookings</Heading>
      </Row>

      <Row type="col">
        <BookingsList />
      </Row>
    </>
  );
}

export default DoctorBookings;
