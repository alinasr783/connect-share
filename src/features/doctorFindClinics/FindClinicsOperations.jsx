import Filter from "../../ui/Filter";

function FindClinicsOperations() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Filter
          options={["All", "standard", "percentage"]}
          placeholder="Price"
          urlParam="price"
        />
        <Filter
          options={["All", "teeth", "eyes", "skin", "hair"]}
          placeholder="Specialty"
          urlParam="specialty"
        />
      </div>
    </div>
  );
}

export default FindClinicsOperations;
