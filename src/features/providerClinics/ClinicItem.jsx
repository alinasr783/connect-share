import {useState} from "react";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import StatusBadge from "../../ui/StatusBadge";
import CreateClinicForm from "./CreateClinicForm";

function ClinicItem({clinic}) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const {name, address, status} = clinic;

  function handleEdit() {
    setIsEditOpen(true);
  }

  return (
    <li
      className="bg-white rounded-lg transition-shadow duration-300 shadow-sm 
      ease-in-out flex flex-col justify-between px-6 py-4">
      <div className="flex flex-col gap-1 mb-4">
        <span className="text-xl font-semibold">{name}</span>
        <span className="text-gray-500">{address}</span>
      </div>

      <div>
        <StatusBadge status={status} />
      </div>

      <div className="flex justify-end mt-6">
        <Button
          onClick={handleEdit}
          type="link"
          size="small"
          className="flex items-center gap-1">
          Edit Clinic Details
          <i className="ri-arrow-right-line"></i>
        </Button>
      </div>
      {isEditOpen && (
        <Modal title="Edit Clinic" onClose={() => setIsEditOpen(false)}>
          <CreateClinicForm
            clinicToEdit={clinic}
            onClose={() => setIsEditOpen(false)}
          />
        </Modal>
      )}
    </li>
  );
}

export default ClinicItem;
