import { useState, useMemo } from "react";

function useRentalSearch(rentals = []) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const filteredRentals = useMemo(() => {
        let filtered = rentals;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(rental => {
                const searchableFields = [
                    rental.clinicId?.name,
                    rental.docId?.fullName,
                ];

                return searchableFields.some(field =>
                    field && field.toLowerCase().includes(searchTerm.toLowerCase())
                );
            });
        }

        // Apply status filter
        if (statusFilter) {
            filtered = filtered.filter(rental =>
                rental.status?.toLowerCase() === statusFilter.toLowerCase()
            );
        }

        return filtered;
    }, [rentals, searchTerm, statusFilter]);

    return {
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        filteredRentals,
    };
}

export default useRentalSearch;
