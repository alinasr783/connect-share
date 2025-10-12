import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getUsers } from "../../services/apiUsers";
import { PAGE_SIZE } from "../../constant/const";

function useUsers() {
    const [searchParams] = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;
    const userTypeFilter = searchParams.get("userType") || "";

    const { data, isPending: isLoadingUsers } = useQuery({
        queryKey: ["users", currentPage, userTypeFilter],
        queryFn: () => getUsers({
            page: currentPage,
            pageSize: PAGE_SIZE,
            userType: userTypeFilter
        }),
        keepPreviousData: true,
        staleTime: 0,
        gcTime: 0,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

    return { users: data?.data ?? [], count: data?.count ?? 0, isLoadingUsers };
}

export default useUsers;