import { useQuery } from "@tanstack/react-query";
import { getProviders } from "../../services/apiUsers";

function useProviders() {
    const { data: providers, isLoading: isLoadingProviders } = useQuery({
        queryKey: ["providers"],
        queryFn: getProviders,
        staleTime: 5 * 60 * 1000,
    });

    return { providers: providers || [], isLoadingProviders };
}

export default useProviders;
