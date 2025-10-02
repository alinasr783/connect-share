import PaymentSettings from "../features/providerSettings/PaymentSettings";
import UpdateProviderData from "../features/providerSettings/UpdateProviderData";
import Row from "../ui/Row";

function ProviderSettings() {
  return (
    <Row type="col">
      <UpdateProviderData />
      {/* <PaymentSettings /> */}
    </Row>
  );
}

export default ProviderSettings;
