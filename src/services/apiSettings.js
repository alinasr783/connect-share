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

export async function createPaymentMethod(paymentMethod) {
    const { data, error } = await supabase
        .from('payment_methods')
        .insert([paymentMethod])
        .select()

    if (error) {
        console.error(error);
        throw new Error('Error creating payment method');
    }

    return data[0];
}

export async function updatePaymentMethod(id, updates) {
    const { data, error } = await supabase
        .from('payment_methods')
        .update(updates)
        .eq('id', id)
        .select()

    if (error) {
        console.error(error);
        throw new Error('Error updating payment method');
    }

    return data[0];
}

export async function deletePaymentMethod(id) {
    const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id)

    if (error) {
        console.error(error);
        throw new Error('Error deleting payment method');
    }
}