import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getAdminBookings } from "../../services/apiBookings";
import { PAGE_SIZE } from "../../constant/const";

function useBookings() {
    const [searchParams] = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;
    const statusFilter = searchParams.get("status") || "all";
    const dateFilter = searchParams.get("date") || "";

    const filters = {
        status: statusFilter,
        date: dateFilter
    };

    const { data, isPending: isLoadingBookings } = useQuery({
        queryKey: ["admin-bookings", currentPage, filters],
        queryFn: () => getAdminBookings({ page: currentPage, pageSize: PAGE_SIZE, filters }),
        keepPreviousData: true,
    });

    return { bookings: data?.data ?? [], count: data?.count ?? 0, isLoadingBookings };
}

export default useBookings;
