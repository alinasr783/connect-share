import {useState} from "react";
import Table from "../../ui/Table";
import StatusBadge from "../../ui/StatusBadge";
import ClinicDetailsModal from "./ClinicDetailsModal";
import {formatDate, formatCurrency} from "../../utils/helpers";

function TransactionRow({transaction}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const rental = transaction.rentals;
  const status = transaction.status;

  const handleInvoiceClick = () => {
    if (status === "Due") {
      // Handle "Pay Now" action
      console.log("Pay Now clicked for transaction:", transaction.id);
    } else {
      // Handle "View" invoice action
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <Table.Row>
        <Table.Cell>{formatDate(rental?.created_at)}</Table.Cell>
        <Table.Cell>
          <div>
            <div className="font-medium text-gray-900">
              {rental?.clinicId?.name || "Unknown Clinic"}
            </div>
          </div>
        </Table.Cell>
        <Table.Cell className="font-medium">
          {formatCurrency(rental?.price || 0)}
        </Table.Cell>
        <Table.Cell>
          <StatusBadge status={status} />
        </Table.Cell>
        <Table.Cell>
          <button
            onClick={handleInvoiceClick}
            className="text-primary hover:text-primary/80 cursor-pointer
              font-medium text-sm transition-colors">
            {status === "Due" ? "-" : "View"}
          </button>
        </Table.Cell>
      </Table.Row>

      <ClinicDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transaction={transaction}
      />
    </>
  );
}

export default TransactionRow;
