import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPaymentMethod as createPaymentMethodApi } from "../../services/apiSettings";
import toast from "react-hot-toast";

function useCreatePaymentMethods() {
    const queryClient = useQueryClient();

    const { mutate: createPaymentMethod, isPending: isCreating } = useMutation({
        mutationFn: (paymentMethod) => createPaymentMethodApi(paymentMethod),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
            toast.success("Payment method created successfully");
        },
        onError: (error) => {
            console.error(error);
            toast.error("Failed to create payment method");
        }
    });

    return { createPaymentMethod, isCreating };
}

export default useCreatePaymentMethods;