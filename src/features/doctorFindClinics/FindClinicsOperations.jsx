import Filter from "../../ui/Filter";

function FindClinicsOperations() {
  return (
    <div className="flex items-center gap-4">
      <Filter
        options={["All", "Pending", "Confirmed", "Completed", "Cancelled"]}
      />
      <Filter
        options={["All", "Pending", "Confirmed", "Completed", "Cancelled"]}
      />
    </div>
  );
}

export default FindClinicsOperations;
