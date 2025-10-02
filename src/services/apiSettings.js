import supabase from "./supabase";

export async function getPaymentMethods(userId) {
    const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('userId', userId)

    if (error) {
        console.error(error);
        throw new Error('Error getting payment methods');
    }

    return data;
}