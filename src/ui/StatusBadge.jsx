function StatusBadge({status, className = ""}) {
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "unconfirmed":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "available":
        return "bg-green-100 text-green-800";
      case "busy":
        return "bg-yellow-100 text-yellow-800";
      case "unavailable":
        return "bg-red-100 text-red-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "refunded":
        return "bg-red-100 text-red-800";
      case "unpaid":
        return "bg-red-100 text-red-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "active":
        return "bg-green-100 text-green-800 border border-green-200";
      case "inactive":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "✓";
      case "inactive":
        return "✕";
      default:
        return "";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 
            rounded-full font-semibold text-xs ${getStatusStyles(
              status
            )} ${className}`}>
      {getStatusIcon(status) && (
        <span className="mr-1">{getStatusIcon(status)}</span>
      )}
      {status}
    </span>
  );
}

export default StatusBadge;
