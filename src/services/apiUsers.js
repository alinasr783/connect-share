import supabase from "./supabase";
import { PAGE_SIZE } from "../constant/const";

export async function getUsers({ page = 1, pageSize = PAGE_SIZE, userType = "" } = {}) {
    const query = supabase
        .from("users")
        .select("*", { count: 'exact' })
        .order('created_at', { ascending: false });

    // Apply userType filter
    if (userType) {
        query.eq('userType', userType);
    }

    if (page) {
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query.range(from, to);
    }

    const { data, error, count } = await query;

    if (error) {
        console.error("Error getting users:", error);
        throw new Error("Error getting users");
    }

    return { data, count: count ?? 0 };
}

export async function getProviders() {
    const { data, error } = await supabase
        .from("users")
        .select("userId, fullName, email")
        .eq("userType", "provider")
        .order('fullName', { ascending: true });

    if (error) {
        console.error("Error getting providers:", error);
        throw new Error("Error getting providers");
    }

    return data || [];
}

export async function searchProviders(searchTerm) {
    if (!searchTerm || searchTerm.trim().length < 2) {
        return [];
    }

    const { data, error } = await supabase
        .from("users")
        .select("userId, fullName, email")
        .eq("userType", "provider")
        .or(`fullName.ilike.%${searchTerm}%,userId.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .order('fullName', { ascending: true })
        .limit(10);

    if (error) {
        console.error("Error searching providers:", error);
        throw new Error("Error searching providers");
    }

    return data || [];
}

export async function updateUserStatus(userId, status) {
    const { data, error } = await supabase
        .from("users")
        .update({ status })
        .eq("userId", userId)
        .select()
        .single();

    if (error) {
        console.error("Error updating user status:", error);
        throw new Error("Error updating user status");
    }

    // Also update the auth user metadata
    const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { status }
    });

    if (authError) {
        console.error("Error updating auth user metadata:", authError);
        // Don't throw error here as the main update succeeded
    }

    return data;
}

export async function getDoctorById(userId) {
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("userId", userId)
        .eq("userType", "doctor")
        .single();

    if (error) {
        console.error("Error getting doctor:", error);
        throw new Error("Error getting doctor");
    }

    return data;
}

export async function updateDoctorDetails(userId, updateData) {
    const { data, error } = await supabase
        .from("users")
        .update(updateData)
        .eq("userId", userId)
        .eq("userType", "doctor")
        .select()
        .single();

    if (error) {
        console.error("Error updating doctor details:", error);
        throw new Error("Error updating doctor details");
    }

    // Also update the auth user metadata
    const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: updateData
    });

    if (authError) {
        console.error("Error updating auth user metadata:", authError);
        // Don't throw error here as the main update succeeded
    }

    return data;
}