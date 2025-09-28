import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updatePassword as updatePasswordApi } from "../../services/apiAuth";

export function useUpdatePassword() {
    const { mutateAsync: updatePassword, isPending: isUpdating } = useMutation({
        mutationFn: updatePasswordApi,
        onSuccess: () => {
            toast.success("Password updated successfully");
        },
        onError: (error) => {
            console.error('Password update error:', error);
            toast.error(error.message || 'Failed to update password');
        },
    });

    return { updatePassword, isUpdating };
}
