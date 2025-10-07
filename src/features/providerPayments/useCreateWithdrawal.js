import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProviderWithdrawalWithTransaction } from "../../services/apiTransactions";
import useUser from "../auth/useUser";

function useCreateWithdrawal() {
    const { user } = useUser();
    const queryClient = useQueryClient();

    const { mutate: createWithdrawal, isPending: isCreating } = useMutation({
        mutationFn: ({ amount, methodId, methodType }) => {
            if (!amount || amount <= 0) {
                throw new Error("Invalid withdrawal amount");
            }
            if (!user?.id) {
                throw new Error("User not authenticated");
            }

            return createProviderWithdrawalWithTransaction({
                userId: user?.id,
                amount: -amount,
                payment_method: methodType,
                method_id: methodId,
                status: 'pending'
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["provider-payouts", user?.id]
            });

            queryClient.invalidateQueries({
                queryKey: ["provider-rentals", user?.id]
            });

            queryClient.invalidateQueries({
                queryKey: ["provider-transactions", user?.id]
            });
        },
        onError: (error) => {
            console.error("Withdrawal creation failed:", error);
        }
    });

    return {
        createWithdrawal,
        isCreating
    };
}

export default useCreateWithdrawal;