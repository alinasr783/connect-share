import {useState} from "react";
import Table from "../../ui/Table";
import StatusBadge from "../../ui/StatusBadge";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import CreateClinicForm from "../providerClinics/CreateClinicForm";

function ClinicManagementRow({clinic}) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const {name, address, status} = clinic;

  function handleEdit() {
    setIsEditOpen(true);
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <Table.Row>
        <Table.Cell className="font-medium text-gray-900">
          {name || "No clinic name"}
        </Table.Cell>
        <Table.Cell className="text-gray-600">
          {address || "No address"}
        </Table.Cell>
        <Table.Cell>
          <StatusBadge status={status} />
        </Table.Cell>
        <Table.Cell>
          <Button onClick={handleEdit} variation="link" size="small">
            View Details
          </Button>
        </Table.Cell>
      </Table.Row>

      {isEditOpen && (
        <Modal title="Edit Clinic" onClose={() => setIsEditOpen(false)}>
          <CreateClinicForm
            clinicToEdit={clinic}
            onClose={() => setIsEditOpen(false)}
          />
        </Modal>
      )}
    </>
  );
}

export default ClinicManagementRow;
