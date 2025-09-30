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
        return "bg-orange-100 text-orange-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "available":
        return "bg-green-100 text-green-800";
      case "busy":
        return "bg-yellow-100 text-yellow-800";
      case "unavailable":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 
            rounded-full font-semibold text-xs ${getStatusStyles(
              status
            )} ${className}`}>
      {status}
    </span>
  );
}

export default StatusBadge;
