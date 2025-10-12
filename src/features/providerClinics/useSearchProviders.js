import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchProviders } from "../../services/apiUsers";

function useSearchProviders() {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { data: searchResults, isLoading: isSearching } = useQuery({
        queryKey: ["search-providers", debouncedSearchTerm],
        queryFn: () => searchProviders(debouncedSearchTerm),
        enabled: debouncedSearchTerm.length >= 2,
        staleTime: 0,
        gcTime: 0,
    });

    return {
        searchTerm,
        setSearchTerm,
        searchResults: searchResults || [],
        isSearching,
    };
}

export default useSearchProviders;

