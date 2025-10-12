import Filter from "../../ui/Filter";

function UserTableOperations() {
  const userTypeOptions = ["admin", "provider", "doctor"];

  return (
    <div className="flex gap-4 items-center">
      <Filter
        options={userTypeOptions}
        placeholder="All User Types"
        urlParam="userType"
        className="w-48"
      />
    </div>
  );
}

export default UserTableOperations;
