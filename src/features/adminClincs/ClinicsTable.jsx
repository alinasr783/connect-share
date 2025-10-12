import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import Pagination from "../../ui/Pagination";
import ClinicRow from "./ClinicRow";
import useClinics from "./useClinics";

function ClinicsTable() {
  const {clinics, count, isLoadingClinics} = useClinics();

  if (isLoadingClinics) return <Spinner />;

  return (
    <>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>Name</Table.Head>
            <Table.Head>Address</Table.Head>
            <Table.Head>Status</Table.Head>
            <Table.Head>Action</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {clinics.length === 0 ? (
            <Table.Empty message="No clinics found" />
          ) : (
            clinics.map((clinic) => (
              <ClinicRow key={clinic.id} clinic={clinic} />
            ))
          )}
        </Table.Body>
      </Table>
      <Pagination count={count} />
    </>
  );
}

export default ClinicsTable;
