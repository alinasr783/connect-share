import Filter from "../../ui/Filter";
import Button from "../../ui/Button";
import {useSearchParams} from "react-router-dom";

function AdminClinicsOperations({onAddClinic}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusOptions = ["available", "unavailable", "pending", "suspended"];

  const handleDateChange = (e) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (e.target.value) {
      newSearchParams.set("date", e.target.value);
    } else {
      newSearchParams.delete("date");
    }
    setSearchParams(newSearchParams);
  };

  return (
    <div className="flex gap-4 items-center justify-between">
      <div className="flex gap-4 items-center">
        <Filter
          options={statusOptions}
          placeholder="All Status"
          urlParam="status"
          className="w-48"
        />

        <input
          type="date"
          className="px-4 py-2 border border-gray-300 rounded-lg 
              focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
          value={searchParams.get("date") || ""}
          onChange={handleDateChange}
        />
      </div>

      <Button variation="primary" onClick={onAddClinic} className="px-4 py-2">
        Add Clinic
      </Button>
    </div>
  );
}

export default AdminClinicsOperations;
