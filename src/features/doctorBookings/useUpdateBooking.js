import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking as updateBookingApi } from "../../services/apiBookings";
import toast from "react-hot-toast";

function useUpdateBooking() {
    const queryClient = useQueryClient();

    const { mutate: updateBooking, isPending: isUpdatingBooking } = useMutation({
        mutationFn: ({ id, updateData }) => updateBookingApi({ id, updateData }),

        onSuccess: () => {
            toast.success("Booking updated successfully");
            queryClient.invalidateQueries({ queryKey: ["doctor-bookings"] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return { updateBooking, isUpdatingBooking };
}

export default useUpdateBooking;