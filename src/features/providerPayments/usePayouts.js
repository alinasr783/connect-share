import { useQuery } from "@tanstack/react-query";
import { getProviderWithdrawals } from "../../services/apiRentals";
import useUser from "../auth/useUser";

function usePayouts() {
    const { user } = useUser();

    const { data: payouts, isPending: isLoadingPayouts } = useQuery({
        queryKey: ["provider-payouts", user?.id],
        queryFn: () => getProviderWithdrawals(user?.id),
    });

    // Filter confirmed payouts
    const confirmedPayouts = payouts?.filter(payout =>
        payout.status === 'confirmed' || payout.status === 'completed'
    ) || [];

    // Calculate total confirmed payouts
    const calculateTotalPayouts = () => {
        if (!payouts || payouts.length === 0) return 0;

        return confirmedPayouts.reduce((total, payout) => {
            const payoutAmount = payout.amount || 0;
            return total + payoutAmount;
        }, 0);
    };

    const calculateAllPayoutsAmount = () => {
        if (!payouts || payouts.length === 0) return 0;
        return payouts.reduce((total, payout) => {
            const payoutAmount = payout.amount || 0;
            return total + payoutAmount;
        }, 0);
    }

    const totalPayouts = calculateTotalPayouts();
    const allPayoutsAmount = calculateAllPayoutsAmount();

    return {
        totalPayouts,
        isLoadingPayouts,
        confirmedPayouts,
        allPayouts: payouts || [],
        allPayoutsAmount
    };
}

export default usePayouts;
