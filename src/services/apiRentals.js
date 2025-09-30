import supabase from "./supabase";

export async function getProviderRentals(userId) {
    const { data, error } = await supabase
        .from("rentals")
        .select("*, clinicId(name), docId(fullName)")
        .eq("provId", userId);

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