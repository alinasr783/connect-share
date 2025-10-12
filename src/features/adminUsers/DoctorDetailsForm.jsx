import {useState, useEffect} from "react";
import {useForm} from "react-hook-form";
import Button from "../../ui/Button";
import StatusBadge from "../../ui/StatusBadge";
import SpecialtiesSelector from "../../ui/SpecialtiesSelector";
import {updateDoctorDetails} from "../../services/apiUsers";
import toast from "react-hot-toast";

function DoctorDetailsForm({doctor}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);

  const {
    register,
    handleSubmit,
    formState: {errors},
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      status: doctor?.status || "inactive",
    },
  });

  const watchedStatus = watch("status");

  useEffect(() => {
    if (doctor) {
      setSelectedSpecialties(doctor.specialties || []);
      setValue("status", doctor.status);
    }
  }, [doctor, setValue]);

  const onSubmit = async (data) => {
    setIsUpdating(true);
    try {
      const updateData = {
        status: data.status,
        specialties: selectedSpecialties,
      };

      await updateDoctorDetails(doctor.userId, updateData);
      toast.success("Doctor details updated successfully");
    } catch (error) {
      toast.error("Failed to update doctor details");
      console.error("Error updating doctor details:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!doctor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Doctor Details
        </h2>
        <p className="text-gray-600">Manage doctor status and specialties</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Doctor Information (Read-only) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={doctor.fullName}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={doctor.email}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="text"
              value={doctor.phone || "Not provided"}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medical License Number
            </label>
            <input
              type="text"
              value={doctor.medicalLicenseNumber || "Not provided"}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
          </div>
        </div>

        {/* Editable Fields */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Editable Information
          </h3>

          {/* Status */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex items-center gap-4">
              <select
                {...register("status", {required: "Status is required"})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <StatusBadge status={watchedStatus} />
            </div>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">
                {errors.status.message}
              </p>
            )}
          </div>

          {/* Specialties */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medical Specialties
            </label>
            <SpecialtiesSelector
              selectedSpecialties={selectedSpecialties}
              onSpecialtiesChange={setSelectedSpecialties}
              disabled={isUpdating}
            />
            <p className="mt-1 text-sm text-gray-500">
              Select the medical specialties for this doctor
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button
            type="button"
            onClick={() => window.history.back()}
            variation="secondary"
            disabled={isUpdating}>
            Cancel
          </Button>
          <Button type="submit" variation="primary" disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update Doctor"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default DoctorDetailsForm;
