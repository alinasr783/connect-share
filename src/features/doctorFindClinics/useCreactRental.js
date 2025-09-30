import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createRental as createRentalApi } from "../../services/apiRentals";

function useCreateRental() {
    const { mutate: createRental, isPending: isCreatingRental } = useMutation({
        mutationFn: (rental) => createRentalApi(rental),

        onSuccess: () => {
            toast.success("Rental created successfully");
        },
        onError: () => {
            toast.error("Failed to create rental");
        },
    });

    return { createRental, isCreatingRental };
}

export default useCreateRental;