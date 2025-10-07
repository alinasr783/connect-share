import { useQuery } from "@tanstack/react-query";
import { getProviderRentals } from "../../services/apiRentals";
import useUser from "../auth/useUser";
import { useSearchParams } from "react-router-dom";
import { RENTALS_PAGE_SIZE } from "../../constant/const";

function useProviderRentals() {
    const { user } = useUser();
    const [searchParams] = useSearchParams();

    const statusFilter = searchParams.get("status");
    const currentPage = Number(searchParams.get("page")) || 1;

    const filters = [];
    if (statusFilter && statusFilter !== "All") {
        filters.push({ field: "status", value: statusFilter });
    }

    const { data, isPending: isLoadingRentals } = useQuery({
        queryKey: ["provider-rentals", user?.id, filters, currentPage],
        queryFn: () => getProviderRentals(user?.id, filters, currentPage),
        enabled: !!user?.id,
    })

    return {
        rentals: data?.data || [],
        totalCount: data?.count || 0,
        isLoadingRentals
    }
}

export default useProviderRentals;