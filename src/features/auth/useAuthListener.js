import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import supabase from "../../services/supabase";

function useAuthListener() {
    const queryClient = useQueryClient();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                // Update the user query when auth state changes
                if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
                    queryClient.setQueryData(['user'], session?.user || null);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [queryClient]);
}

export default useAuthListener;
