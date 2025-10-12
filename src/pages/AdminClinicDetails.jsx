import {useParams} from "react-router-dom";
import Button from "../ui/Button";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import Spinner from "../ui/Spinner";
import CreateClinicForm from "../features/providerClinics/CreateClinicForm";
import {useQuery} from "@tanstack/react-query";
import {getClinicById} from "../services/apiClinics";

function AdminClinicDetails() {
  const {id} = useParams();

  const {data: clinic, isLoading} = useQuery({
    queryKey: ["clinic", id],
    queryFn: () => getClinicById(id),
  });

  if (isLoading) return <Spinner />;

  if (!clinic) return <div>Clinic not found</div>;

  return (
    <div className="space-y-6">
      <Row type="row">
        <Heading as="h1">Clinic Details - {clinic.name}</Heading>
        <Button
          variation="link"
          to="/admin/clinics"
          className="flex items-center gap-2">
          <i className="ri-arrow-left-line"></i>
          <span>Back</span>
        </Button>
      </Row>

      <Row type="col">
        <div className="bg-white rounded-xl shadow-xs p-6">
          <CreateClinicForm
            clinicToEdit={clinic}
            onClose={() => window.history.back()}
          />
        </div>
      </Row>
    </div>
  );
}

export default AdminClinicDetails;
