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

export async function getAdminBookings({ page = 1, pageSize = PAGE_SIZE, filters = {} } = {}) {
    const query = supabase
        .from("rentals")
        .select("*, clinicId(name, address), docId(fullName, email), provId(fullName, email)", { count: "exact" })
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
        .select("*, clinicId(*), docId(*), provId(*)")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error getting admin booking details:", error);
        throw new Error("Error getting admin booking details");
    }

    return data;
}

export async function updateBooking({ id, updateData }) {
    const { data, error } = await supabase
        .from("rentals")
        .update(updateData)
        .eq("id", id)
        .select("*, clinicId(*), docId(*), provId(*)")
        .single();

    if (error) {
        console.error("Error updating booking:", error);
        throw new Error("Error updating booking");
    }

    return data;
}

export async function cancelBooking(id, reason) {
    const { data, error } = await supabase
        .from("rentals")
        .update({ 
            status: 'cancelled',
            cancellation_reason: reason 
        })
        .eq("id", id)
        .select("*, clinicId(*), docId(*), provId(*)")
        .single();

    if (error) {
        console.error("Error cancelling booking:", error);
        throw new Error("Error cancelling booking");
    }

    return data;
}

export async function createBooking(bookingData) {
    const { data, error } = await supabase
        .from("rentals")
        .insert([bookingData])
        .select("*, clinicId(*), docId(*), provId(*)")
        .single();

    if (error) {
        console.error("Error creating booking:", error);
        throw new Error("Error creating booking");
    }

    return data;
}

export async function deleteBooking(id) {
    const { error } = await supabase
        .from("rentals")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting booking:", error);
        throw new Error("Error deleting booking");
    }

    return true;
}

export async function getBookingStats() {
    const { data, error } = await supabase
        .from("rentals")
        .select("status, price, created_at");

    if (error) {
        console.error("Error getting booking stats:", error);
        throw new Error("Error getting booking stats");
    }

    const stats = {
        total: data.length,
        confirmed: data.filter(b => b.status === 'confirmed').length,
        pending: data.filter(b => b.status === 'pending').length,
        completed: data.filter(b => b.status === 'completed').length,
        cancelled: data.filter(b => b.status === 'cancelled').length,
        revenue: data
            .filter(b => b.status === 'completed' || b.status === 'confirmed')
            .reduce((sum, b) => sum + (b.price || 0), 0)
    };

    return stats;
}

export async function searchBookings(searchTerm) {
    if (!searchTerm || searchTerm.trim().length < 2) {
        return [];
    }

    const { data: doctorBookings, error: doctorError } = await supabase
        .from("rentals")
        .select("*, clinicId(*), docId(*), provId(*)")
        .textSearch('docId.fullName', searchTerm);

    const { data: providerBookings, error: providerError } = await supabase
        .from("rentals")
        .select("*, clinicId(*), docId(*), provId(*)")
        .textSearch('provId.fullName', searchTerm);

    const { data: clinicBookings, error: clinicError } = await supabase
        .from("rentals")
        .select("*, clinicId(*), docId(*), provId(*)")
        .textSearch('clinicId.name', searchTerm);

    if (doctorError || providerError || clinicError) {
        console.error("Error searching bookings:", { doctorError, providerError, clinicError });
        throw new Error("Error searching bookings");
    }

    // Combine and remove duplicates
    const allBookings = [...doctorBookings, ...providerBookings, ...clinicBookings];
    const uniqueBookings = allBookings.filter((booking, index, self) => 
        index === self.findIndex(b => b.id === booking.id)
    );

    return uniqueBookings;
}

export async function getBookingsByDateRange(startDate, endDate) {
    const { data, error } = await supabase
        .from("rentals")
        .select("*, clinicId(*), docId(*), provId(*)")
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error getting bookings by date range:", error);
        throw new Error("Error getting bookings by date range");
    }

    return data;
}

export async function updateBookingStatus(id, status, reason = '') {
    const updateData = { status };
    
    if (reason && status === 'cancelled') {
        updateData.cancellation_reason = reason;
    }

    const { data, error } = await supabase
        .from("rentals")
        .update(updateData)
        .eq("id", id)
        .select("*, clinicId(*), docId(*), provId(*)")
        .single();

    if (error) {
        console.error("Error updating booking status:", error);
        throw new Error("Error updating booking status");
    }

    return data;
}

export async function getRecentBookings(limit = 10) {
    const { data, error } = await supabase
        .from("rentals")
        .select("*, clinicId(name, address), docId(fullName), provId(fullName)")
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error("Error getting recent bookings:", error);
        throw new Error("Error getting recent bookings");
    }

    return data;
}

export async function getBookingFinancials(rentalId) {
  const { data, error } = await supabase
    .from("rentals")
    .select(`
      *,
      clinicId(*),
      docId(*),
      provId(*),
      doc_transactions(*),
      prov_transactions(*),
      payouts(*)
    `)
    .eq("id", rentalId)
    .single();

  if (error) {
    console.error("Error getting booking financials:", error);
    throw new Error("Error getting booking financials");
  }

  return data;
}

export async function updateBookingFinancials({ id, financialData }) {
  const { data, error } = await supabase
    .from("rentals")
    .update(financialData)
    .eq("id", id)
    .select("*, clinicId(*), docId(*), provId(*)")
    .single();

  if (error) {
    console.error("Error updating booking financials:", error);
    throw new Error("Error updating booking financials");
  }

  return data;
}

export async function createFinancialTransaction(transactionData) {
  const { data, error } = await supabase
    .from("doc_transactions")
    .insert([transactionData])
    .select()
    .single();

  if (error) {
    console.error("Error creating financial transaction:", error);
    throw new Error("Error creating financial transaction");
  }

  return data;
}

export async function createPayout(payoutData) {
  const { data, error } = await supabase
    .from("payouts")
    .insert([payoutData])
    .select()
    .single();

  if (error) {
    console.error("Error creating payout:", error);
    throw new Error("Error creating payout");
  }

  return data;
}

export async function getBookingAnalytics() {
  const { data: bookings, error } = await supabase
    .from("rentals")
    .select("status, price, payment_status, created_at, selected_pricing");

  if (error) {
    console.error("Error getting booking analytics:", error);
    throw new Error("Error getting booking analytics");
  }

  const analytics = {
    totalRevenue: bookings
      .filter(b => b.payment_status === 'paid')
      .reduce((sum, b) => sum + (b.price || 0), 0),
    pendingPayouts: bookings
      .filter(b => b.status === 'completed' && b.payment_status === 'paid')
      .reduce((sum, b) => sum + (b.price || 0) * 0.8, 0), // Assuming 80% goes to host
    commission: bookings
      .filter(b => b.payment_status === 'paid')
      .reduce((sum, b) => sum + (b.price || 0) * 0.2, 0), // Assuming 20% commission
    monthlyRevenue: calculateMonthlyRevenue(bookings),
    paymentStatusBreakdown: calculatePaymentStatusBreakdown(bookings)
  };

  return analytics;
}

function calculateMonthlyRevenue(bookings) {
  const monthly = {};
  bookings.forEach(booking => {
    if (booking.payment_status === 'paid') {
      const month = new Date(booking.created_at).toLocaleString('en', { month: 'long', year: 'numeric' });
      monthly[month] = (monthly[month] || 0) + (booking.price || 0);
    }
  });
  return monthly;
}

function calculatePaymentStatusBreakdown(bookings) {
  const breakdown = {
    paid: 0,
    unpaid: 0,
    refunded: 0,
    pending: 0
  };
  
  bookings.forEach(booking => {
    if (breakdown[booking.payment_status] !== undefined) {
      breakdown[booking.payment_status]++;
    }
  });
  
  return breakdown;
}


// export async function getBookingStats(userId) {
//   const { data, error } = await supabase
//     .from("rentals")
//     .select("status, price, payment_status")
//     .or(`docId.eq.${userId},provId.eq.${userId}`);

//   if (error) {
//     console.error("Error getting booking stats:", error);
//     throw new Error("Error getting booking stats");
//   }

//   const stats = {
//     total: data.length,
//     confirmed: data.filter(b => b.status === 'confirmed').length,
//     pending: data.filter(b => b.status === 'pending').length,
//     completed: data.filter(b => b.status === 'completed').length,
//     cancelled: data.filter(b => b.status === 'cancelled').length,
//     revenue: data
//       .filter(b => (b.status === 'completed' || b.status === 'confirmed') && b.payment_status === 'paid')
//       .reduce((sum, b) => sum + (b.price || 0), 0)
//   };

//   return stats;
// }