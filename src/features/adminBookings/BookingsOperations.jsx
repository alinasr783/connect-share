import Filter from "../../ui/Filter";
import {useSearchParams} from "react-router-dom";

const statusOptions = ["all", "pending", "confirmed", "cancelled", "completed"];

function BookingsOperations() {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleDateChange = (e) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (e.target.value) {
      newSearchParams.set("date", e.target.value);
    } else {
      newSearchParams.delete("date");
    }
    // Reset to page 1 when filtering
    newSearchParams.set("page", "1");
    setSearchParams(newSearchParams);
  };

  const clearFilters = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("status");
    newSearchParams.delete("date");
    newSearchParams.set("page", "1");
    setSearchParams(newSearchParams);
  };

  return (
    <div className="flex items-center gap-4 mb-6">
      {/* Date Filter */}
      <div className="relative">
        <input
          type="date"
          value={searchParams.get("date") || ""}
          onChange={handleDateChange}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
        />
        <i className="ri-calendar-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
      </div>

      {/* Status Filter */}
      <Filter
        options={statusOptions}
        placeholder="All Statuses"
        urlParam="status"
        className="w-48"
      />

      {/* Clear Filters */}
      {(searchParams.get("status") || searchParams.get("date")) && (
        <button
          onClick={clearFilters}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50">
          Clear Filters
        </button>
      )}
    </div>
  );
}

export default BookingsOperations;
