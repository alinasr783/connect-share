import DoctorPaymentsLayout from "../features/doctorPayments/DoctorPaymentsLayout";
import Heading from "../ui/Heading";
import Row from "../ui/Row";

function DoctorPayments() {
  return (
    <>
      <Row type="col">
        <Heading as="h1">Payments</Heading>
      </Row>
      <Row type="col">
        <DoctorPaymentsLayout />
      </Row>
    </>
  );
}

export default DoctorPayments;
