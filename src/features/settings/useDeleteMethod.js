import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePaymentMethod } from "../../services/apiSettings";
import toast from "react-hot-toast";

function useDeleteMethod() {
    const queryClient = useQueryClient();

    const { mutate: deleteMethod, isPending: isDeleting } = useMutation({
        mutationFn: (id) => deletePaymentMethod(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
            toast.success("Payment method deleted successfully");
        },
        onError: (error) => {
            console.error(error);
            toast.error("Failed to delete payment method");
        }
    });

    return { deleteMethod, isDeleting };
}

export default useDeleteMethod;


