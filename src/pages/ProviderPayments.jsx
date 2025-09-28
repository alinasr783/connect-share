import PaymentsLayout from "../features/providerPayments/PaymentsLayout";
import Heading from "../ui/Heading";
import Row from "../ui/Row";

function ProviderPayments() {
  return (
    <>
      <Row type="col">
        <Heading as="h1">Payments</Heading>
      </Row>

      <Row>
        <PaymentsLayout />
      </Row>
    </>
  );
}

export default ProviderPayments;
