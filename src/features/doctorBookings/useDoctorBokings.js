import { useQuery } from "@tanstack/react-query";
import useUser from "../auth/useUser";
import { getDoctorBookings } from "../../services/apiBookings";

function useDoctorBokings() {
    const { user } = useUser();

    const { data: bookings, isPending: isLoadingBookings } = useQuery({
        queryKey: ["doctor-bookings", user?.id],
        queryFn: () => getDoctorBookings(user?.id),
        enabled: !!user?.id,
    })

    return { bookings, isLoadingBookings };
}

export default useDoctorBokings;