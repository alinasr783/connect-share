import { useQuery } from "@tanstack/react-query";
import { getProviderRentals } from "../../services/apiRentals";
import useUser from "../auth/useUser";

function useProviderRentals() {
    const { user } = useUser();

    const { data: rentals, isPending: isLoadingRentals } = useQuery({
        queryKey: ["provider-rentals", user?.id],
        queryFn: () => getProviderRentals(user?.id),
    })

    return { rentals, isLoadingRentals }
}

export default useProviderRentals;