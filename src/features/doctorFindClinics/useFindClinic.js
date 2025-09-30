import { useQuery } from "@tanstack/react-query";
import { getFindClinicsById } from "../../services/apiClinics";
import { useParams } from "react-router-dom";

function useFindClinic() {
    const { id } = useParams();

    const { data: clinic, isPending: isLoadingClinic } = useQuery({
        queryKey: ["find-clinic", id],
        queryFn: () => getFindClinicsById(id),
    })

    return { clinic, isLoadingClinic };
}

export default useFindClinic;