import { useParams } from "react-router-dom";
import { getAdminBookingDetails } from "../../services/apiBookings";
import { useQuery } from "@tanstack/react-query";

function useBooking() {
    const { id } = useParams();

    const { data: booking, isPending: isLoadingBooking } = useQuery({
        queryKey: ["booking", id],
        queryFn: () => getAdminBookingDetails(id),
        staleTime: 0,
        gcTime: 0,
    });

    return { booking, isLoadingBooking };
}

export default useBooking;