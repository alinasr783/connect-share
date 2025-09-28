import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CreateUpdateClinic } from "../../services/apiClinics";

function useCreateClinic() {
    const queryClient = useQueryClient();

    const { mutate: createClinic, isPending: isCreatingClinic } = useMutation({
        mutationFn: (clinicData) => CreateUpdateClinic(clinicData),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["provider-clinics"] });
            toast.success("Clinic created successfully");
        },

        onError: () => {
            toast.error("Failed to create clinic");
        },
    });

    return { createClinic, isCreatingClinic };
}

export default useCreateClinic;