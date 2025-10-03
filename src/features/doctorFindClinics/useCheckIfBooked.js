import { useQuery } from "@tanstack/react-query";
import useUser from "../auth/useUser";
import { getCheckIfBooked } from "../../services/apiClinics";

function useCheckIfBooked(clinicId) {
    const { user } = useUser();

    const { data: rentals, isPending: isLoadingRentals } = useQuery({
        queryKey: ["check-if-booked", user?.id, clinicId],
        queryFn: () => getCheckIfBooked(user?.id, clinicId),
        enabled: !!user?.id && !!clinicId,
    })

    return { rentals: rentals?.length > 0, isLoadingRentals };
}

export default useCheckIfBooked;