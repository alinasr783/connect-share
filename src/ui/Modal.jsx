import {createPortal} from "react-dom";
import Button from "./Button";

function Modal({children, onClose, title}) {
  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/50 
        backdrop-blur-sm flex items-center justify-center p-4
      overflow-y-auto">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-100 rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <Button
            type="icon"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full">
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
