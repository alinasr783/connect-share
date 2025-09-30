import {useState} from "react";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import CreateClinicForm from "./CreateClinicForm";

function AddClinic() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-end">
      <Button onClick={() => setOpen(true)} className="self-end">
        Add Clinic
      </Button>

      {open && (
        <Modal
          type="large"
          onClose={() => setOpen(false)}
          title="Add New Clinic">
          <CreateClinicForm onClose={() => setOpen(false)} />
        </Modal>
      )}
    </div>
  );
}

export default AddClinic;
