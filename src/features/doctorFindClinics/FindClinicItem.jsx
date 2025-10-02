import {Link} from "react-router-dom";

function FindClinicItem({clinic}) {
  const {
    name,
    address,
    images: [image],
  } = clinic;

  const standardPrice =
    clinic.pricing.pricingModel === "standard"
      ? [
          ...(clinic.pricing.hourlyEnabled ? ["Hourly"] : []),
          ...(clinic.pricing.dailyEnabled ? ["Daily"] : []),
          ...(clinic.pricing.monthlyEnabled ? ["Monthly"] : []),
        ]
      : [];
  const percentagePrice =
    clinic.pricing.pricingModel === "percentage" ? true : false;

  return (
    <div className="group bg-white rounded-2xl shadow-xs overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 
            transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white drop-shadow-lg">
            {name}
          </h3>
        </div>
      </div>

      <div className="pt-3 px-4 pb-5">
        <div className="flex items-center gap-2 mb-4">
          <i className="ri-map-pin-line text-[var(--color-primary)] text-lg"></i>
          <p className="text-sm text-gray-600">
            {address.split(" ").slice(0, 3).join(" ")}
          </p>
        </div>

        <div className="flex items-center gap-2 mb-4">
          {percentagePrice ? (
            <span className="text-sm text-gray-600 bg-blue-100  rounded-md px-2 py-1">
              Percentage
            </span>
          ) : standardPrice.length > 0 ? (
            standardPrice.map((price) => (
              <span
                key={price}
                className="text-xs text-gray-600 bg-gray-100 rounded-md px-2 py-1">
                {price}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-400">No pricing available</span>
          )}
        </div>

        {/* Action Button */}
        <Link
          to={`/doctor/clinics/${clinic.id}`}
          className="w-full flex items-center gap-1 bg-primary text-white 
          rounded-lg px-4 py-2">
          <span className="text-sm">View Details</span>
          <i className="ri-arrow-right-line"></i>
        </Link>
      </div>
    </div>
  );
}

export default FindClinicItem;
