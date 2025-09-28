function FindClinicItem({clinic}) {
  const pricing = clinic.pricing;
  const displayPricing =
    pricing.pricingModel === "standard"
      ? [pricing?.hourlyRate, pricing?.dailyRate, pricing?.monthlyRate]
      : pricing.pricingModel;

  console.log(displayPricing);

  return (
    <div
      className="bg-white rounded-lg shadow-xs 
        flex flex-col justify-between overflow-hidden">
      <img
        src={clinic.images[0]}
        alt={clinic.name}
        className="w-full h-48 object-cover"
      />
      <div className="flex flex-col gap-3 mb-4 pt-1 px-4 pb-6">
        <div className="flex flex-col gap-1">
          <span className="text-xl font-semibold text-gray-700">
            {clinic.name}
          </span>
          <span className="text-gray-500 text-sm">{clinic.address}</span>
        </div>

        <div className="flex wrap"></div>
      </div>
    </div>
  );
}

export default FindClinicItem;