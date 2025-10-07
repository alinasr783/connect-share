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

    // Filter completed bookings for total spent calculation
    const completedBookings = bookings?.filter(booking =>
        booking.status === 'completed'
    ) || [];

    const upcomingBookings = bookings?.filter(booking =>
        booking.status === 'confirmed'
    ) || [];

    // Get current month's bookings
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const thisMonthBookings = bookings?.filter(booking => {
        const bookingDate = new Date(booking.created_at);
        return bookingDate.getMonth() === currentMonth &&
            bookingDate.getFullYear() === currentYear;
    }) || [];

    // Calculate total spent from completed bookings
    const calculateTotalSpent = () => {
        if (!completedBookings || completedBookings.length === 0) return 0;

        return completedBookings.reduce((total, booking) => {
            const bookingPrice = booking.price || 0;
            return total + bookingPrice;
        }, 0);
    };

    // Calculate upcoming payments from pending bookings
    const calculateUpcomingPayments = () => {
        if (!upcomingBookings || upcomingBookings.length === 0) return 0;

        return upcomingBookings.reduce((total, booking) => {
            const bookingPrice = booking.price || 0;
            return total + bookingPrice;
        }, 0);
    };

    // Calculate transactions this month (count of bookings)
    const calculateTransactionThisMonth = () => {
        if (!thisMonthBookings || thisMonthBookings.length === 0) return 0;

        return thisMonthBookings.length;
    };

    const totalSpent = calculateTotalSpent();
    const upcomingPayments = calculateUpcomingPayments();
    const transactionThisMonth = calculateTransactionThisMonth();

    return {
        totalSpent,
        upcomingPayments,
        transactionThisMonth,
        isLoadingBookings,
        bookings: bookings || [],
        completedBookings,
        thisMonthBookings,
    };
}

export default useDoctorPayments;
