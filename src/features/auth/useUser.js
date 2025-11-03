import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuth";

function useUser() {
    const { data: user, isPending: isUserPending, error } = useQuery({
        queryKey: ["user"],
        queryFn: getCurrentUser,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    })

    return {
        user,
        isUserPending,
        isAuthenticated: user?.role === "authenticated",
        isActive: user?.user_metadata?.status === "active",
        isDoctor: user?.user_metadata?.userType === "doctor",
        error,
    }
}

export default useUser;