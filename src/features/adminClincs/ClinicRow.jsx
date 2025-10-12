import Button from "../../ui/Button";
import StatusBadge from "../../ui/StatusBadge";
import Table from "../../ui/Table";
import {useNavigate} from "react-router-dom";

function ClinicRow({clinic}) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/admin/clinics/${clinic.id}`);
  };

  return (
    <Table.Row>
      <Table.Cell>{clinic.name}</Table.Cell>
      <Table.Cell>{clinic.address}</Table.Cell>
      <Table.Cell>
        <StatusBadge status={clinic.status} />
      </Table.Cell>
      <Table.Cell>
        <Button onClick={handleViewDetails} variation="link" size="small">
          View Details
        </Button>
      </Table.Cell>
    </Table.Row>
  );
}

export default ClinicRow;
