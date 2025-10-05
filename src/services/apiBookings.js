import supabase from "./supabase";

export async function getDoctorBookings(userId) {
    const { data, error } = await supabase
        .from("rentals")
        .select("*, clinicId(name)")
        .eq("docId", userId)

    if (error) {
        console.error(error);
        throw new Error("Error getting doctor bookings");
    }

    return data;
}

export async function updateBooking({ id, updateData }) {
    const { error } = await supabase
        .from("rentals")
        .update(updateData)
        .eq("id", id);

    if (error) {
        console.error(error);
        throw new Error("Error updating booking");
    }
}
