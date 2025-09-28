function Tag({ children, color }) {
  const colorVariants = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    yellow: "bg-yellow-100 text-yellow-800",
  };

  const colorClass = colorVariants[color] || "bg-gray-100 text-gray-800";

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}
    >
      {children}
    </span>
  );
}

export default Tag;