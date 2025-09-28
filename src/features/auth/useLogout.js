import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logout as logoutApi } from "../../services/apiAuth";

function useLogout() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate: logout, isPending: isLoggingOut } = useMutation({
        mutationFn: logoutApi,
        onSuccess: () => {
            toast.success("Logged out successfully");
            queryClient.clear(); // Clear all cached data
            navigate("/", { replace: true });
        },

        onError: (error) => {
            console.error('Logout error:', error);
            toast.error(error.message || 'Error logging out');
        },
    });

    return { logout, isLoggingOut };
}

export default useLogout;
