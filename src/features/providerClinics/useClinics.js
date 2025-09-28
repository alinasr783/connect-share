import { useQuery } from "@tanstack/react-query";
import { getProviderClinics } from "../../services/apiClinics";

function useClinics(userId) {
    const { data: clinics, isPending: isLoadingClinics } = useQuery({
        queryKey: ["provider-clinics", userId],
        queryFn: () => getProviderClinics(userId),
    });

    return { clinics, isLoadingClinics };
}

export default useClinics;
