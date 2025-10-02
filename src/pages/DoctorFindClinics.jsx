import Row from "../ui/Row";
import Heading from "../ui/Heading";
import FindClinicsList from "../features/doctorFindClinics/FindClinicsList";
import FindClinicsOperations from "../features/doctorFindClinics/FindClinicsOperations";

function DoctorFindClinics() {
  return (
    <>
      <Row type="col">
        <Heading as="h1">Clinics</Heading>
        {/* <FindClinicsOperations /> */}
      </Row>

      <Row type="col">
        <FindClinicsList />
      </Row>
    </>
  );
}

export default DoctorFindClinics;
