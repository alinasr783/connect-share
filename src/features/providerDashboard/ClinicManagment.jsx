import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import useUser from "../auth/useUser";
import useClinics from "../providerClinics/useClinics";
import ClinicManagementRow from "./ClinicManagementRow";

function ClinicManagment() {
  const {user} = useUser();

  const {clinics, isLoadingClinics} = useClinics(user?.id);

  if (isLoadingClinics) return <Spinner />;

  const slicedClinics = clinics?.slice(0, 3);

  return (
    <div className="space-y-6">
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head className="text-gray-500 font-medium uppercase tracking-wide">
              CLINIC NAME
            </Table.Head>
            <Table.Head className="text-gray-500 font-medium uppercase tracking-wide">
              LOCATION
            </Table.Head>
            <Table.Head className="text-gray-500 font-medium uppercase tracking-wide">
              STATUS
            </Table.Head>
            <Table.Head className="text-gray-500 font-medium uppercase tracking-wide">
              ACTIONS
            </Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {slicedClinics && slicedClinics.length > 0 ? (
            slicedClinics.map((clinic) => (
              <ClinicManagementRow key={clinic.id} clinic={clinic} />
            ))
          ) : (
            <Table.Empty message="No clinics found" />
          )}
        </Table.Body>
      </Table>
    </div>
  );
}

export default ClinicManagment;
