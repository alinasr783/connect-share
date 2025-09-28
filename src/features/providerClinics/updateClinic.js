import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CreateUpdateClinic } from "../../services/apiClinics";

function UpdateClinic() {
    const queryClient = useQueryClient();

    const { mutate: updateClinic, isPending: isUpdatingClinic } = useMutation({
        mutationFn: ({ newClinic, id }) => CreateUpdateClinic(newClinic, id),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["provider-clinics"] });
            toast.success("Clinic updated successfully");
        },

        onError: (error) => {
            console.log(error);
            toast.error("Failed to update clinic");
        }
    })

    return {
        updateClinic,
        isUpdatingClinic
    }
}

export default UpdateClinic;