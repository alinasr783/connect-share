import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createRental as createRentalApi } from "../../services/apiRentals";

function useCreateRental() {
    const queryClient = useQueryClient();

    const { mutate: createRental, isPending: isCreatingRental } = useMutation({
        mutationFn: (rental) => createRentalApi(rental),

        onSuccess: () => {
            toast.success("Rental created successfully");
            queryClient.invalidateQueries({ queryKey: ["check-if-booked"] });
        },
        onError: () => {
            toast.error("Failed to create rental");
        },
    });

    return { createRental, isCreatingRental };
}

export default useCreateRental;