import useUser from "../auth/useUser";
import useClinics from "./useClinics";
import ClinicItem from "./ClinicItem";
import Spinner from "../../ui/Spinner";
import Empty from "../../ui/Empty";

function ClinicsList() {
  const {user} = useUser();

  const {clinics, isLoadingClinics} = useClinics(user?.id);

  if (isLoadingClinics) return <Spinner />;

  if (clinics?.length === 0) {
    return <Empty title="No clinics found" description="You have no clinics" />;
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {clinics.map((clinic) => (
        <ClinicItem key={clinic.id} clinic={clinic} />
      ))}
    </ul>
  );
}

export default ClinicsList;
