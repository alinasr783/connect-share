import Row from "../ui/Row";
import AddClinic from "../features/providerClinics/AddClinic";
import ClinicsLis from "../features/providerClinics/ClinicsList";
import Heading from "../ui/Heading";

function ProviderClinics() {
  return (
    <>
      <Row type="col">
        <Heading as="h1">Clinics</Heading>
      </Row>

      <Row type="col">
        <AddClinic />
        <ClinicsLis />
      </Row>
    </>
  );
}

export default ProviderClinics;
