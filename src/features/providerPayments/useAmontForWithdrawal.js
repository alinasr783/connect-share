import useEarnings from "./useEarnings";
import usePayouts from "./usePayouts";

function useAmountForWithdrawal() {
    const { totalEarnings, isLoadingRentals } = useEarnings();
    const { allPayoutsAmount, isLoadingPayouts } = usePayouts();

    const calculateAvailableAmount = () => {
        if (isLoadingRentals || isLoadingPayouts) return 0;

        // استخدام القيمة المطلقة للمبالغ المسحوبة
        const totalPayouts = Math.abs(allPayoutsAmount);
        const availableAmount = totalEarnings - totalPayouts;

        console.log('💰 Available Amount Calculation:', {
            totalEarnings,
            allPayoutsAmount,
            totalPayouts: Math.abs(allPayoutsAmount),
            availableAmount
        });

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