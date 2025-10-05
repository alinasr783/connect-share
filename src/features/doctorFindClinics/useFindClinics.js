import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getFindClinics } from "../../services/apiClinics";

function useFindClinics() {
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

    // pagination
    const page = Number(searchParams.get("page")) || 1;

    // filters
    const priceFilter = searchParams.get("price");
    const specialtyFilter = searchParams.get("specialty");

    // Build filters array
    const filters = [];
    if (priceFilter && priceFilter !== "All") {
        filters.push({ field: "pricingModel", value: priceFilter });
    }
    if (specialtyFilter && specialtyFilter !== "All") {
        filters.push({ field: "specialty", value: specialtyFilter });
    }

    const { data: { data: clinics, count } = {}, isPending: isLoadingClinics } = useQuery({
        queryKey: ["find-clinics", page, filters],
        queryFn: () => getFindClinics({ page, filters }),
    })

    return {
        clinics,
        count,
        isLoadingClinics,
        searchTerm,
        setSearchTerm
    }
}

export default useFindClinics;