function SpecialtiesDisplay({
  specialties = [],
  className = "",
  maxDisplay = 3,
}) {
  if (!specialties || specialties.length === 0) {
    return (
      <div className={`text-sm text-gray-500 ${className}`}>
        No specialties listed
      </div>
    );
  }

  const visibleSpecialties = specialties.slice(0, maxDisplay);
  const remainingCount = specialties.length - maxDisplay;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {visibleSpecialties.map((specialty, index) => (
        <span
          key={index}
          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-sm">
          <i className="ri-medicine-bottle-line mr-1 text-blue-600"></i>
          {specialty}
        </span>
      ))}

      {remainingCount > 0 && (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
          +{remainingCount} more
        </span>
      )}
    </div>
  );
}

export default SpecialtiesDisplay;
