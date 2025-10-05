import Filter from "../../ui/Filter";
import Row from "../../ui/Row";

function ProviderRentalsOperations() {
  return (
    <Row type="row">
      <Filter
        options={["pending", "confirmed", "completed", "busy", "cancelled"]}
        urlParam={"status"}
        placeholder="All Statuses"
      />
    </Row>
  );
}

export default ProviderRentalsOperations;
