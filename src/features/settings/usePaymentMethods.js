import { useQuery } from "@tanstack/react-query";
import { getPaymentMethods } from "../../services/apiSettings";
import useUser from "../auth/useUser";

function usePaymentMethods() {
    const { user } = useUser();

    const { data: paymentMethods, isPending: isLoadingPaymentMethods } = useQuery({
        queryKey: ["payment-methods"],
        queryFn: () => getPaymentMethods(user?.id),
    })

    return { paymentMethods, isLoadingPaymentMethods };
}

export default usePaymentMethods;