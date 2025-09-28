import { useQuery } from "@tanstack/react-query";
import { getProviderRentals } from "../../services/apiRentals";
import useUser from "../auth/useUser";

function useEarnings() {
    const { user } = useUser();

    const { data: rentals, isPending: isLoadingRentals } = useQuery({
        queryKey: ["provider-rentals", user?.id],
        queryFn: () => getProviderRentals(user?.id),
    });

    const completedRentals = rentals?.filter(rental =>
        rental.status === 'completed' || rental.status === 'confirmed'
    ) || [];

    // حساب إجمالي الأرباح
    const calculateTotalEarnings = () => {
        if (!rentals || rentals.length === 0) return 0;

        return completedRentals
            .reduce((total) => {
                // حساب بسيط - يمكن تحسينه لاحقاً بناءً على نوع التسعير
                // افتراضياً: 100 دولار لكل إيجار مكتمل
                const baseEarning = 100;
                return total + baseEarning;
            }, 0);
    };

    // حساب إجمالي المدفوعات (أقل من الأرباح بسبب العمولة)
    const calculateTotalPayouts = () => {
        if (!rentals || rentals.length === 0) return 0;

        return completedRentals
            .reduce((total) => {
                // حساب بسيط: 85 دولار لكل إيجار مكتمل (15% عمولة)
                const baseEarning = 100;
                const commission = 0.15; // 15% عمولة
                const payout = baseEarning * (1 - commission);
                return total + payout;
            }, 0);
    };

    const totalEarnings = calculateTotalEarnings();
    const totalPayouts = calculateTotalPayouts();

    // حساب الرصيد المستحق (الفرق بين الأرباح والمدفوعات)
    const outstandingBalance = totalEarnings - totalPayouts;

    return {
        totalEarnings,
        totalPayouts,
        outstandingBalance,
        isLoadingRentals,
        completedRentals: rentals?.filter(rental =>
            rental.status === 'completed' || rental.status === 'confirmed'
        ) || []
    };
}

export default useEarnings;
