import {useEffect} from "react";
import Row from "../../ui/Row";
import SearchInput from "../../ui/SearchInput";
import useRentalSearch from "./useRentalSearch";
import Filter from "../../ui/Filter";

function ProviderRentalsOperations({rentals, onFilteredRentalsChange}) {
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredRentals,
  } = useRentalSearch(rentals || []);

  // Pass filtered results back to parent component
  useEffect(() => {
    onFilteredRentalsChange?.(filteredRentals);
  }, [filteredRentals, onFilteredRentalsChange]);

  return (
    <Row type="row">
      <div>
        <SearchInput
          placeholder="Search rentals..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>

      <div>
        <Filter
          options={["pending", "confirmed", "completed", "cancelled"]}
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="All Statuses"
        />
      </div>
    </Row>
  );
}

export default ProviderRentalsOperations;
