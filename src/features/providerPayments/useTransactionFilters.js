import { useSearchParams } from "react-router-dom";
import { useCallback } from "react";

function useTransactionFilters() {
    const [searchParams, setSearchParams] = useSearchParams();

    const updateFilter = useCallback((key, value) => {
        const newSearchParams = new URLSearchParams(searchParams);

        if (value === "" || value === "all") {
            newSearchParams.delete(key);
        } else {
            newSearchParams.set(key, value);
        }

        // Reset to page 1 when filters change
        if (key !== "page") {
            newSearchParams.delete("page");
        }

        setSearchParams(newSearchParams);
    }, [searchParams, setSearchParams]);

    const updateMultipleFilters = useCallback((filters) => {
        const newSearchParams = new URLSearchParams(searchParams);

        Object.entries(filters).forEach(([key, value]) => {
            if (value === "" || value === "all") {
                newSearchParams.delete(key);
            } else {
                newSearchParams.set(key, value);
            }
        });

        // Reset to page 1 when filters change
        newSearchParams.delete("page");
        setSearchParams(newSearchParams);
    }, [searchParams, setSearchParams]);

    const clearFilters = useCallback(() => {
        setSearchParams({});
    }, [setSearchParams]);

    return {
        updateFilter,
        updateMultipleFilters,
        clearFilters
    };
}

export default useTransactionFilters;

