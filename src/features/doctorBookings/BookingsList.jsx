import Spinner from "../../ui/Spinner";
import BookingItem from "./BookingItem";
import useDoctorBokings from "./useDoctorBokings";

function BookingsList() {
  const {bookings, isLoadingBookings} = useDoctorBokings();

  if (isLoadingBookings) return <Spinner />;

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <BookingItem key={booking.id} booking={booking} />
      ))}
    </div>
  );
}

export default BookingsList;
