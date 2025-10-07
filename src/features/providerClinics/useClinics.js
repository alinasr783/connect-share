import { useQuery } from "@tanstack/react-query";
import { getProviderClinics } from "../../services/apiClinics";
import useUser from "../auth/useUser";

function useClinics() {
    const { user: { id } } = useUser();

    const { data: clinics, isPending: isLoadingClinics } = useQuery({
        queryKey: ["provider-clinics", id],
        queryFn: () => getProviderClinics(id),
    });

    return { clinics, isLoadingClinics };
}

export default useClinics;