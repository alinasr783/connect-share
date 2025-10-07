import Spinner from "../../ui/Spinner";
import BookingItem from "./BookingItem";
import useDoctorBokings from "./useDoctorBokings";
import Empty from "../../ui/Empty";

function BookingsList() {
  const {bookings, isLoadingBookings} = useDoctorBokings();

  if (isLoadingBookings) return <Spinner />;

  if (bookings.length === 0)
    return <Empty title="No bookings found" description="No bookings found" />;

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <BookingItem key={booking.id} booking={booking} />
      ))}
    </div>
  );
}

export default BookingsList;
