
// Extract date from created_at timestamp
export const getDateFromCreatedAt = (createdAt) => {
    if (!createdAt) return '';
    return new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
};

// Extract time from created_at timestamp
export const getTimeFromCreatedAt = (createdAt) => {
    if (!createdAt) return '';
    return new Date(createdAt).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
};

export const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return "EGP 0.00";
    }

    return amount.toLocaleString("en-US", {
        style: "currency",
        currency: "EGP",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

export const formatDateRange = (from, to) => {
    if (!from || !to) return "";
    const fromDate = new Date(from);
    const toDate = new Date(to);

    const formatDateShort = (date) => {
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return `${formatDateShort(fromDate)} - ${formatDateShort(toDate)}`;
};

export const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
};

export const getToday = function (options = {}) {
  const today = new Date();

    // This is necessary to compare with created_at from Supabase, because it it not at 0.0.0.0, so we need to set the date to be END of the day when we compare it with earlier dates
    if (options?.end)
        // Set to the last second of the day
        today.setUTCHours(23, 59, 59, 999);
  else today.setUTCHours(0, 0, 0, 0);
  return today.toISOString();
};

export const slugify = (str) => {
  return String(str || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}