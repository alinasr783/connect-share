import SupportList from "../features/DoctorSupport/SupportList";
import ContactUs from "../features/DoctorSupport/ContactUs";
import Heading from "../ui/Heading";
import Row from "../ui/Row";

function DoctorSupport() {
  return (
    <>
      <Row type="col">
        <Heading as="h1">Help & Support</Heading>
      </Row>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-4">
        <SupportList />
        <ContactUs />
      </div>
    </>
  );
}

export default DoctorSupport;
