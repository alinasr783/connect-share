import { useQuery } from "@tanstack/react-query";
import { getDoctorTransactions } from "../../services/apiTransactions";
import useUser from "../auth/useUser";

function useDoctorTransactions() {
    const { user } = useUser();

    const { data: transactions, isPending: isLoadingTransactions } = useQuery({
        queryKey: ["doctor-transactions", user?.id],
        queryFn: () => getDoctorTransactions(user?.id),
        enabled: !!user?.id,
    })

    return { transactions, isLoadingTransactions };
}

export default useDoctorTransactions;

