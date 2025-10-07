import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePaymentMethod } from "../../services/apiSettings";
import toast from "react-hot-toast";

function useUpdateMethod() {
    const queryClient = useQueryClient();

    const { mutate: updateMethod, isPending: isUpdating } = useMutation({
        mutationFn: ({ id, updates }) => updatePaymentMethod(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
            toast.success("Payment method updated successfully");
        },
        onError: (error) => {
            console.error(error);
            toast.error("Failed to update payment method");
        }
    });

    return { updateMethod, isUpdating };
}

export default useUpdateMethod;


