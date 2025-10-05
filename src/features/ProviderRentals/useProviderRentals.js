import { useQuery } from "@tanstack/react-query";
import { getProviderRentals } from "../../services/apiRentals";
import useUser from "../auth/useUser";
import { useSearchParams } from "react-router-dom";

function useProviderRentals() {
    const { user } = useUser();
    const [searchParams] = useSearchParams();

    const statusFilter = searchParams.get("status");

    const filters = [];
    if (statusFilter && statusFilter !== "All") {
        filters.push({ field: "status", value: statusFilter });
    }

    const { data: rentals, isPending: isLoadingRentals } = useQuery({
        queryKey: ["provider-rentals", user?.id, filters],
        queryFn: () => getProviderRentals(user?.id, filters),
    })

    return { rentals, isLoadingRentals }
}

export default useProviderRentals;