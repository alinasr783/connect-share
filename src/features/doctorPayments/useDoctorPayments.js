import { useQuery } from "@tanstack/react-query";
import useUser from "../auth/useUser";
import { getDoctorBookings } from "../../services/apiBookings";

function useDoctorPayments() {
    const { user } = useUser();

    const { data: bookings, isPending: isLoadingBookings } = useQuery({
        queryKey: ["doctor-bookings", user?.id],
        queryFn: () => getDoctorBookings(user?.id),
        enabled: !!user?.id,
    });

    const completedBookings = bookings?.filter(booking =>
        booking.status === 'completed'
    ) || [];

    const upcomingBookings = bookings?.filter(booking =>
        booking.status === 'confirmed'
    ) || [];

    const calculateTotalSpent = () => {
        if (!completedBookings || completedBookings.length === 0) return 0;

        return completedBookings.reduce((total, booking) => {
            const bookingPrice = booking.price || 0;
            return total + bookingPrice;
        }, 0);
    };

    const calculateUpcomingPayments = () => {
        if (!upcomingBookings || upcomingBookings.length === 0) return 0;

        return upcomingBookings.reduce((total, booking) => {
            const bookingPrice = booking.price || 0;
            return total + bookingPrice;
        }, 0);
    };

    const totalSpent = calculateTotalSpent();
    const upcomingPayments = calculateUpcomingPayments();

    return {
        totalSpent,
        upcomingPayments,
        isLoadingBookings,
        bookings: bookings || [],
        completedBookings,
    };
}

export default useDoctorPayments;
