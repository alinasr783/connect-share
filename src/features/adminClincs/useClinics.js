import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getAdminClinics } from "../../services/apiClinics";
import { PAGE_SIZE } from "../../constant/const";

function useClinics() {
    const [searchParams] = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;
    const statusFilter = searchParams.get("status") || "";
    const dateFilter = searchParams.get("date") || "";

    const { data, isPending: isLoadingClinics } = useQuery({
        queryKey: ["admin-clinics", currentPage, statusFilter, dateFilter],
        queryFn: () => getAdminClinics({
            page: currentPage,
            pageSize: PAGE_SIZE,
            status: statusFilter,
            date: dateFilter
        }),
        keepPreviousData: true,
    });

    return { clinics: data?.data ?? [], count: data?.count ?? 0, isLoadingClinics };
}

export default useClinics;