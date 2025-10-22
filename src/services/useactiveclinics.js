import { useQuery } from "@tanstack/react-query";
import { getAllClinics } from "../../services/apiClinics";
import { getAllRentals } from "../../services/apiRentals";

function useActiveClinics() {
    const { data: clinicsData, isLoading: isLoadingClinics } = useQuery({
        queryKey: ["all-clinics"],
        queryFn: getAllClinics,
    });

    const { data: rentalsData, isLoading: isLoadingRentals } = useQuery({
        queryKey: ["all-rentals"],
        queryFn: getAllRentals,
    });

    const isLoading = isLoadingClinics || isLoadingRentals;

    // تصفية العيادات المتاحة فقط
    const activeClinics = clinicsData?.data?.filter(clinic => {
        // الحالة أ: لم يتم عليها حجوزات - تعرض مباشرة
        const clinicRentals = rentalsData?.data?.filter(rental => rental.clinic_id === clinic.id) || [];
        
        if (clinicRentals.length === 0) {
            return true;
        }

        // الحالة ب: تم عليها حجوزات - نتحقق من التواريخ المتاحة
        const availableDates = clinic.availableDate?.days || [];
        
        // نحصل على جميع التواريخ المحجوزة لهذه العيادة
        const bookedDates = clinicRentals.map(rental => rental.selected_date);
        
        // نتحقق إذا كان هناك أي تاريخ متاح لم يتم حجزه
        const hasAvailableDates = availableDates.some(date => !bookedDates.includes(date));
        
        return hasAvailableDates;
    }) || [];

    return {
        activeClinics,
        count: activeClinics.length,
        isLoading,
        allClinics: clinicsData?.data || [],
        allRentals: rentalsData?.data || []
    };
}

export default useActiveClinics;