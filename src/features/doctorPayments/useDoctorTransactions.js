import { useQuery } from "@tanstack/react-query";
import { getDoctorTransactions, getDoctorTransactionsThisMonth } from "../../services/apiTransactions";
import useUser from "../auth/useUser";

function useDoctorTransactions() {
    const { user } = useUser();

    const { data: transactions, isPending: isLoadingTransactions } = useQuery({
        queryKey: ["doctor-transactions", user?.id],
        queryFn: () => getDoctorTransactions(user?.id),
        enabled: !!user?.id,
    })

    const { data: transactionsThisMonth, isPending: isLoadingTransactionsThisMonth } = useQuery({
        queryKey: ["doctor-transactions-this-month", user?.id],
        queryFn: () => getDoctorTransactionsThisMonth(user?.id),
        enabled: !!user?.id,
    })

    const transactionThisMonth = transactionsThisMonth?.length || 0;

    return {
        transactions,
        isLoadingTransactions,
        isLoadingTransactionsThisMonth,
        transactionThisMonth,
    };
}

export default useDoctorTransactions;
