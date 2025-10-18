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


export async function updateUser(userId, updateData) {
    const { data, error } = await supabase
        .from("users")
        .update(updateData)
        .eq("userId", userId)
        .select()
        .single();

    if (error) {
        console.error("Error updating user:", error);
        throw new Error("Error updating user");
    }

    // Also update the auth user metadata if needed
    const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: updateData
    });

    if (authError) {
        console.error("Error updating auth user metadata:", authError);
        // Don't throw error here as the main update succeeded
    }

    return data;
}

export async function deleteUser(userId) {
    const { error } = await supabase
        .from("users")
        .delete()
        .eq("userId", userId);

    if (error) {
        console.error("Error deleting user:", error);
        throw new Error("Error deleting user");
    }

    // Also delete the auth user
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);

    if (authError) {
        console.error("Error deleting auth user:", authError);
        // Don't throw error here as the main delete succeeded
    }

    return true;
}

// services/apiUsers.js - إضافات جديدة

// export async function getUsers({ userId, page = 1, pageSize = 10, userType = '' } = {}) {
//   let query = supabase
//     .from("users")
//     .select("*", { count: "exact" });

//   // إذا كان هناك userId معين، جلب هذا المستخدم فقط
//   if (userId) {
//     query = query.eq("userId", userId);
//   }

//   // تصفية حسب نوع المستخدم إذا كان محدد
//   if (userType && userType !== 'all') {
//     query = query.eq("userType", userType);
//   }

//   // ترتيب حسب تاريخ الإنشاء
//   query = query.order("created_at", { ascending: false });

//   // Pagination
//   if (page && !userId) {
//     const from = (page - 1) * pageSize;
//     const to = from + pageSize - 1;
//     query = query.range(from, to);
//   }

//   const { data, error, count } = await query;

//   if (error) {
//     console.error("Error getting users:", error);
//     throw new Error("Error getting users");
//   }

//   return { data, count: count ?? 0 };
// }

export async function getUserStats(userId) {
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("userId", userId)
    .single();

  if (userError) {
    console.error("Error getting user:", userError);
    throw new Error("Error getting user");
  }

  // جلب إحصائيات الحجوزات
  const { data: bookings, error: bookingsError } = await supabase
    .from("rentals")
    .select("status, price, payment_status")
    .or(`docId.eq.${userId},provId.eq.${userId}`);

  if (bookingsError) {
    console.error("Error getting user bookings:", bookingsError);
    throw new Error("Error getting user bookings");
  }

  const stats = {
    totalBookings: bookings.length,
    completed: bookings.filter(b => b.status === 'completed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    revenue: bookings
      .filter(b => (b.status === 'completed' || b.status === 'confirmed') && b.payment_status === 'paid')
      .reduce((sum, b) => sum + (b.price || 0), 0)
  };

  return { user, stats };
}