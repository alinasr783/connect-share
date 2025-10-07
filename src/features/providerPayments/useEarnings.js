import { useQuery } from "@tanstack/react-query";
import { getProviderRentals } from "../../services/apiRentals";
import { getProviderClinics } from "../../services/apiClinics";
import useUser from "../auth/useUser";
import { useSearchParams } from "react-router-dom";

function useEarnings() {
    const { user } = useUser();
    const [searchParams] = useSearchParams();

    const numDays = Number(searchParams?.get("last")) || 7;

    const { data: { data: rentals } = {}, isPending: isLoadingRentals } = useQuery({
        queryKey: ["provider-rentals", user?.id],
        queryFn: () => getProviderRentals(user?.id),
    });

    const { data: clinics, isPending: isLoadingClinics } = useQuery({
        queryKey: ["provider-clinics", user?.id],
        queryFn: () => getProviderClinics(user?.id),
    });

    const completedRentals = rentals?.filter(rental =>
        rental.status === 'completed') || [];

    const busyRentals = rentals?.filter(rental => rental.status === 'busy');

    const upcomingRentals = rentals?.filter(rental => rental.status === 'pending').length || 0;

    const calculateTotalEarnings = () => {
        if (!rentals || rentals.length === 0) return 0;

        return completedRentals
            .reduce((total, rental) => {
                const rentalPrice = rental.price || 0;
                return total + rentalPrice;
            }, 0);
    }

    const calculateOutstandingBalance = () => {
        if (!rentals || rentals.length === 0) return 0;
        return busyRentals
            .reduce((total, rental) => {
                const rentalPrice = rental.price || 0;
                return total + rentalPrice;
            }, 0);
    };

    const calculateClinicOccupancy = () => {
        if (!rentals || rentals.length === 0 || !clinics || clinics.length === 0) return 0;

        // Get today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayString = today.toISOString().split('T')[0];

        // Filter today's rentals
        const todayRentals = rentals.filter(rental => {
            const rentalDate = new Date(rental.created_at).toISOString().split('T')[0];
            return rentalDate === todayString;
        });

        // Count active rentals (confirmed, busy, pending)
        const activeRentals = todayRentals.filter(rental =>
            ['confirmed', 'busy', 'pending', 'unconfirmed'].includes(rental.status)
        ).length;

        const workingHoursPerClinic = 8;
        const totalAvailableSlots = clinics.length * workingHoursPerClinic;

        if (totalAvailableSlots === 0) return 0;

        // Calculate occupancy percentage
        const occupancyPercentage = Math.round((activeRentals / totalAvailableSlots) * 100);

        return Math.min(occupancyPercentage, 100);
    };

    const totalEarnings = calculateTotalEarnings();
    const outstandingBalance = calculateOutstandingBalance();
    const clinicOccupancy = calculateClinicOccupancy();

    return {
        totalEarnings,
        outstandingBalance,
        clinicOccupancy,
        isLoadingRentals: isLoadingRentals || isLoadingClinics,
        upcomingRentals,
        numDays,
        rentals,
    };
}

export default useEarnings;