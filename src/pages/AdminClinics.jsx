import {useState} from "react";
import AdminClinicsOperations from "../features/adminClincs/AdminClinicsOperations";
import ClinicsTable from "../features/adminClincs/ClinicsTable";
import CreateClinicForm from "../features/providerClinics/CreateClinicForm";
import Modal from "../ui/Modal";
import Heading from "../ui/Heading";
import Row from "../ui/Row";

function AdminClinics() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddClinic = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Row type="col">
        <Heading as="h1">Clinics</Heading>

        <AdminClinicsOperations onAddClinic={handleAddClinic} />
      </Row>

      <Row type="col">
        <ClinicsTable />
      </Row>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add New Clinic"
        type="large">
        <CreateClinicForm onClose={handleCloseModal} />
      </Modal>
    </>
  );
}

export default AdminClinics;
