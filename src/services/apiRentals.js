import { RENTALS_PAGE_SIZE } from "../constant/const";
import supabase from "./supabase";

export async function getProviderRentals(userId, filters = [], page = 1) {
    if (!userId) {
        return {
            data: [],
            count: 0,
        };
    }

    const query =
        supabase
            .from("rentals")
            .select("*, clinicId(name), docId(fullName)", { count: 'exact' })
            .eq("provId", userId);

    // filters
    if (filters.length > 0) {
        filters.forEach(filter => {
            if (filter && filter.field && filter.value) {
                query.eq(filter.field, filter.value);
            }
        });
    }

    // pagination
    const from = (page - 1) * RENTALS_PAGE_SIZE;
    const to = from + RENTALS_PAGE_SIZE - 1;
    query.range(from, to);

    const { data, error, count } = await query
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error getting provider rentals:', error);
        throw new Error('Error getting provider rentals');
    }

    return {
        data: data || [],
        count: count || 0,
    };
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