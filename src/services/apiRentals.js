import supabase from "./supabase";

export async function getProviderRentals(userId, filters = []) {
    const query =
        supabase
            .from("rentals")
            .select("*, clinicId(name), docId(fullName)")
            .eq("provId", userId);

    // filters
    filters.forEach(filter => {
        if (filter && filter.field && filter.value) {
            query.eq(filter.field, filter.value);
        }
    });

    const { data, error } = await query;

    if (error) {
        console.error(error);
        throw new Error('Error getting provider rentals');
    }

    return data;
}

export async function createRental(rental) {
    const { data, error } = await supabase
        .from("rentals")
        .insert([rental]);

    if (error) {
        console.error(error);
        throw new Error('Error creating rental');
    }

    return data;
}

export async function getProviderWithdrawals(userId) {
    const { data, error } = await supabase
        .from("payouts")
        .select("amount, status, created_at")
        .eq("userId", userId)

    if (error) {
        console.error(error);
        throw new Error('Error getting provider withdrawals');
    }

    return data;
}