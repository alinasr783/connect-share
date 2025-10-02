import useFindClinics from "./useFindClinics";
import Spinner from "../../ui/Spinner";
import FindClinicItem from "./FindClinicItem";
import Empty from "../../ui/Empty";
import Pagination from "../../ui/Pagination";

function FindClinicsList() {
  const {clinics, isLoadingClinics, count} = useFindClinics();

  if (isLoadingClinics) return <Spinner />;
  if (clinics?.length === 0)
    return <Empty title="No clinics found" description="No clinics found" />;

  return (
    <>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {clinics.map((clinic) => (
          <FindClinicItem key={clinic.id} clinic={clinic} />
        ))}
      </ul>

      <Pagination count={count} />
    </>
  );
}

export default FindClinicsList;
