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

            console.log('💳 Creating withdrawal with:', {
                userId: user?.id,
                amount: amount, // إرسال القيمة الموجبة فقط
                payment_method: methodType,
                method_id: methodId,
                status: 'pending'
            });

            return createProviderWithdrawalWithTransaction({
                userId: user?.id,
                amount: amount, // إرسال القيمة الموجبة - سيتولى السيرفر تحويلها لسلبية
                payment_method: methodType,
                method_id: methodId,
                status: 'pending'
            });
        },
        onSuccess: (data) => {
            console.log('✅ Withdrawal created successfully:', data);
            
            // تحديث جميع الاستعلامات ذات الصلة
            queryClient.invalidateQueries({
                queryKey: ["provider-payouts", user?.id]
            });

            queryClient.invalidateQueries({
                queryKey: ["provider-rentals", user?.id]
            });

            queryClient.invalidateQueries({
                queryKey: ["provider-transactions", user?.id]
            });

            queryClient.invalidateQueries({
                queryKey: ["earnings", user?.id]
            });

            queryClient.invalidateQueries({
                queryKey: ["payouts", user?.id]
            });
        },
        onError: (error) => {
            console.error("❌ Withdrawal creation failed:", error);
        }
    });

    return {
        createWithdrawal,
        isCreating
    };
}

export default useCreateWithdrawal;