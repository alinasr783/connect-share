import Row from "../ui/Row";
import Heading from "../ui/Heading";
import DoctorStatusCheck from "../ui/DoctorStatusCheck";
import FindClinicsList from "../features/doctorFindClinics/FindClinicsList";
import FindClinicsOperations from "../features/doctorFindClinics/FindClinicsOperations";

function DoctorFindClinics() {
  return (
    <DoctorStatusCheck>
      <Row type="col">
        <Heading as="h1">Clinics</Heading>
        <FindClinicsOperations />
      </Row>

      <Row type="col">
        <FindClinicsList />
      </Row>
    </DoctorStatusCheck>
  );
}

export default DoctorFindClinics;
