import Button from "./Button";
import Modal from "./Modal";

function ConfirmAction({title, description, onConfirm, onCancel, isLoading}) {
  return (
    <Modal title={title} onClose={onCancel} type="small">
      <p className="text-gray-700 max-w-md">{description}?</p>
      <div className="flex justify-end gap-2 mt-6">
        <Button onClick={onCancel} variation="secondary" className="ml-2">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          variation="primary"
          className="ml-2">
          {isLoading ? "Confirming..." : "Confirm"}
        </Button>
      </div>
    </Modal>
  );
}

export default ConfirmAction;
