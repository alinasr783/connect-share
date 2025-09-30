import {createPortal} from "react-dom";
import Button from "./Button";

function Modal({children, onClose, title, type = "create"}) {
  const typeStyles = {
    large: "max-w-7xl w-full max-h-[95vh]",
    small: "max-w-md ",
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/50 
        backdrop-blur-sm flex items-center justify-center p-4
        overflow-y-auto">
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-gray-100 rounded-xl overflow-hidden ${typeStyles[type]}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <Button variation="icon" size="small" onClick={onClose}>
            ✕
          </Button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default Modal;
