import useEarnings from "./useEarnings";
import usePayouts from "./usePayouts";

function useAmountForWithdrawal() {
    const { totalEarnings, isLoadingRentals } = useEarnings();
    const { allPayoutsAmount, isLoadingPayouts } = usePayouts();

    const calculateAvailableAmount = () => {
        if (isLoadingRentals || isLoadingPayouts) return 0;

        const availableAmount = totalEarnings - allPayoutsAmount;

        return Math.max(availableAmount, 0);
    };

    const availableAmount = calculateAvailableAmount();
    const isLoading = isLoadingRentals || isLoadingPayouts;

    return {
        availableAmount,
        isLoading,
        hasAvailableAmount: availableAmount > 0,
    };
}

export default useAmountForWithdrawal;