import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuth";
import { useEffect } from "react";
import supabase from "../../services/supabase";

function useUser() {
    const queryClient = useQueryClient();

    const { data: user, isPending: isUserPending, error } = useQuery({
        queryKey: ["user"],
        queryFn: getCurrentUser,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    })

    // Subscribe in real-time to current user's status updates
    useEffect(() => {
        if (!user?.id) return;

        const channel = supabase
            .channel(`user-status-${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'users',
                    filter: `userId=eq.${user.id}`,
                },
                (payload) => {
                    const newStatus = payload?.new?.status;
                    const newUserType = payload?.new?.userType;
                    const newFullName = payload?.new?.fullName;

                    // Update the cached user immediately so UI reflects activation without refresh
                    queryClient.setQueryData(["user"], (prev) => {
                        if (!prev) return prev;
                        return {
                            ...prev,
                            user_metadata: {
                                ...prev.user_metadata,
                                status: newStatus ?? prev.user_metadata?.status,
                                userType: newUserType ?? prev.user_metadata?.userType,
                                fullName: newFullName ?? prev.user_metadata?.fullName,
                            },
                        };
                    });
                }
            )
            .subscribe();

        return () => {
            try {
                channel.unsubscribe();
            } catch {}
        };
    }, [user?.id, queryClient]);

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