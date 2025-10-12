import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateBooking as updateBookingApi } from "../../services/apiBookings";

function useUpdateBooking() {
    const queryClient = useQueryClient();

    const { mutate: updateBooking, isPending: isUpdatingBooking } = useMutation({
        mutationFn: ({ id, updateData }) => updateBookingApi({ id, updateData }),
        onSuccess: () => {
            toast.success("Booking updated successfully");
            queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return { updateBooking, isUpdatingBooking };
}

export default useUpdateBooking;