import supabase from "./supabase";

export async function getDoctorBookings(userId) {
    const { data, error } = await supabase
        .from("rentals")
        .select("*")
        .eq("docId", userId)

    if (error) {
        console.error(error);
        throw new Error("Error getting doctor bookings");
    }

    return data;
}