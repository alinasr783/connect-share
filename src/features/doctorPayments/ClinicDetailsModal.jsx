import Modal from "../../ui/Modal";
import {formatCurrency, formatDate} from "../../utils/helpers";

function ClinicDetailsModal({isOpen, onClose, transaction}) {
  if (!transaction || !transaction.rentals) return null;

  const rental = transaction.rentals;
  const clinic = rental.clinicId;
  const doctor = rental.docId;
  const provider = rental.provId;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transaction Details"
      type="large">
      <div className="space-y-6">
        {/* Transaction Overview */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Transaction Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Transaction ID</p>
              <p className="font-medium">{transaction.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">{formatDate(rental.created_at)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className="font-medium text-lg">
                {formatCurrency(rental.price || 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium">{transaction.status}</p>
            </div>
          </div>
        </div>

        {/* Clinic Information */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Clinic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Clinic Name</p>
              <p className="font-medium">{clinic?.name || "Not available"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">
                {clinic?.address || "Not available"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{clinic?.phone || "Not available"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{clinic?.email || "Not available"}</p>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Booking Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Doctor</p>
              <p className="font-medium">
                {doctor?.fullName || "Not available"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Provider</p>
              <p className="font-medium">
                {provider?.fullName || "Not available"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pricing Type</p>
              <p className="font-medium">
                {rental.selected_pricing || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Booking Date</p>
              <p className="font-medium">
                {rental.selected_date?.from && rental.selected_date?.to
                  ? `${formatDate(rental.selected_date.from)} - ${formatDate(
                      rental.selected_date.to
                    )}`
                  : "Not specified"}
              </p>
            </div>
            {rental.selected_hours && (
              <div>
                <p className="text-sm text-gray-500">Time Slot</p>
                <p className="font-medium">
                  {rental.selected_hours.startTime} -{" "}
                  {rental.selected_hours.endTime}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Doctor Contact</p>
              <p className="font-medium">{doctor?.email || "Not available"}</p>
              <p className="text-sm text-gray-500">
                {doctor?.phone || "Not available"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Provider Contact</p>
              <p className="font-medium">
                {provider?.email || "Not available"}
              </p>
              <p className="text-sm text-gray-500">
                {provider?.phone || "Not available"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ClinicDetailsModal;
