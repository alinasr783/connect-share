import { useQuery } from "@tanstack/react-query";
import { getFindClinics } from "../../services/apiClinics";

function useFindClinics() {
    const { data: clinics, isPending: isLoadingClinics } = useQuery({
        queryKey: ["find-clinics"],
        queryFn: () => getFindClinics(),
    })

    return { clinics, isLoadingClinics }
}

export default useFindClinics;