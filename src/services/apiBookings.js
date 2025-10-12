import supabase from "./supabase";
import { PAGE_SIZE } from "../constant/const";

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

export async function getAdminBookings({ page = 1, pageSize = PAGE_SIZE, filters = {} } = {}) {
    const query = supabase
        .from("rentals")
        .select("*, clinicId(name), docId(fullName), provId(fullName)", { count: "exact" })
        .order("created_at", { ascending: false })

    // Apply filters
    if (filters.status && filters.status !== "all") {
        query.eq("status", filters.status);
    }

    if (filters.date) {
        const startOfDay = new Date(filters.date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(filters.date);
        endOfDay.setHours(23, 59, 59, 999);

        query.gte("created_at", startOfDay.toISOString())
            .lte("created_at", endOfDay.toISOString());
    }

    // pagination
    if (page) {
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query.range(from, to);
    }

    const { data, error, count } = await query;

    if (error) {
        console.error(error);
        throw new Error("Error getting admin bookings");
    }

    return { data, count: count ?? 0 };
}

export async function getAdminBookingDetails(id) {
    const { data, error } = await supabase
        .from("rentals")
        .select("*, clinicId(name, address), docId(fullName, email), provId(fullName, email)")
        .eq("id", id)
        .single();

    if (error) {
        console.error(error);
        throw new Error("Error getting admin booking details");
    }

    return data;
}