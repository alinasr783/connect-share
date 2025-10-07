import StatusBadge from "../../ui/StatusBadge";
import Table from "../../ui/Table";
import {getDateFromCreatedAt, getTimeFromCreatedAt} from "../../utils/helpers";

function ProviderRentalsRow({rental}) {
  const {
    created_at,
    status,
    clinicId: {name},
    docId: {fullName},
    price,
  } = rental;

  return (
    <Table.Row>
      <Table.Cell className="font-medium text-gray-900">
        {name || "no clinic name"}
      </Table.Cell>
      <Table.Cell>{getDateFromCreatedAt(created_at)}</Table.Cell>
      <Table.Cell>{getTimeFromCreatedAt(created_at)}</Table.Cell>
      <Table.Cell>{fullName || "Dr. Unknown"}</Table.Cell>
      <Table.Cell>
        <StatusBadge status={status} />
      </Table.Cell>
      <Table.Cell>{price || "N/A"}</Table.Cell>
    </Table.Row>
  );
}

export default ProviderRentalsRow;
