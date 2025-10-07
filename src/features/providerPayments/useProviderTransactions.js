import { useQuery } from "@tanstack/react-query";
import { getProviderTransactions } from "../../services/apiTransactions";
import useUser from "../auth/useUser";
import { useSearchParams } from "react-router-dom";

function useProviderTransactions() {
    const { user } = useUser();
    const [searchParams] = useSearchParams();

    // Get filter parameters from URL
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 10;
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "all";
    const status = searchParams.get("status") || "all";
    const date = searchParams.get("date") || "";
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const {
        data,
        isPending: isLoadingTransactions,
        error
    } = useQuery({
        queryKey: [
            "provider-transactions",
            user?.id,
            page,
            pageSize,
            search,
            type,
            status,
            sortBy,
            sortOrder,
            date
        ],
        queryFn: () => getProviderTransactions(user?.id, {
            page,
            pageSize,
            search,
            type,
            status,
            sortBy,
            sortOrder,
            date
        }),
        enabled: !!user?.id,
    });

    return {
        transactions: data?.data || [],
        totalCount: data?.totalCount || 0,
        totalPages: data?.totalPages || 0,
        currentPage: data?.page || 1,
        pageSize: data?.pageSize || 10,
        isLoadingTransactions,
        error
    };
}

export default useProviderTransactions;
