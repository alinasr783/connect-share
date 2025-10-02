import { useQuery } from "@tanstack/react-query";
import { getFindClinics } from "../../services/apiClinics";
import { useSearchParams } from "react-router-dom";

function useFindClinics() {
    const [searchParams] = useSearchParams();
    // pagination
    const page = Number(searchParams.get("page")) || 1;

    const { data: { data: clinics, count } = {}, isPending: isLoadingClinics } = useQuery({
        queryKey: ["find-clinics", page],
        queryFn: () => getFindClinics({ page }),
    })

    return {
        clinics,
        count,
        isLoadingClinics
    }
}

export default useFindClinics;