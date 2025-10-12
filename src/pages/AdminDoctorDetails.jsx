import {useQuery} from "@tanstack/react-query";
import {useNavigate, useParams} from "react-router-dom";
import DoctorDetailsForm from "../features/adminUsers/DoctorDetailsForm";
import {getDoctorById} from "../services/apiUsers";
import Button from "../ui/Button";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import Spinner from "../ui/Spinner";

function AdminDoctorDetails() {
  const {userId} = useParams();
  const navigate = useNavigate();

  const {
    data: doctor,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["doctor", userId],
    queryFn: () => getDoctorById(userId),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Heading as="h2">Doctor Not Found</Heading>
          <p className="text-gray-600 mb-6">
            The doctor you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
          <Button onClick={() => navigate("/admin/users")} variation="primary">
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Row type="row">
        <Heading as="h1">Doctor Details - {doctor.fullName}</Heading>
        <Button
          variation="link"
          onClick={() => navigate("/admin/users")}
          className="flex items-center gap-2">
          <i className="ri-arrow-left-line"></i>
          <span>Back to Users</span>
        </Button>
      </Row>

      <Row type="col">
        <DoctorDetailsForm doctor={doctor} />
      </Row>
    </div>
  );
}

export default AdminDoctorDetails;
