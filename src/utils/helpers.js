
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
    return amount.toLocaleString("en-US", {
        style: "currency",
        currency: "EGP",
    });
};