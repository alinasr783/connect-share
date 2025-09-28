import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuth";

function useUser() {
    const { data: user, isPending: isUserPending, error } = useQuery({
        queryKey: ["user"],
        queryFn: getCurrentUser,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })

    return {
        user,
        isUserPending,
        isAuthenticated: user?.role === "authenticated",
        error,
    }
}

export default useUser;