import { useQuery } from "@tanstack/react-query";
import { getProviderRentals } from "../../services/apiRentals";
import useUser from "../auth/useUser";
import { useSearchParams } from "react-router-dom";

function useEarnings() {
    const { user } = useUser();
    const [searchParams] = useSearchParams();

    const numDays = Number(searchParams?.get("last")) || 7;

    const { data: rentals, isPending: isLoadingRentals } = useQuery({
        queryKey: ["provider-rentals", user?.id],
        queryFn: () => getProviderRentals(user?.id),
    });

    const completedRentals = rentals?.filter(rental =>
        rental.status === 'completed') || [];
    const busyRentals = rentals?.filter(rental => rental.status === 'busy');

    const calculateTotalEarnings = () => {
        if (!rentals || rentals.length === 0) return 0;

        return completedRentals
            .reduce((total, rental) => {
                const rentalPrice = rental.price || 0;
                return total + rentalPrice;
            }, 0);
    };

    const calculateOutstandingBalance = () => {
        if (!rentals || rentals.length === 0) return 0;
        return busyRentals
            .reduce((total, rental) => {
                const rentalPrice = rental.price || 0;
                return total + rentalPrice;
            }, 0);
    };

    const totalEarnings = calculateTotalEarnings();
    const outstandingBalance = calculateOutstandingBalance();

    return {
        totalEarnings,
        outstandingBalance,
        isLoadingRentals,
        numDays,
        rentals,
    };
}

export default useEarnings;