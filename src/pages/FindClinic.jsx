import {useState} from "react";
import {DayPicker} from "react-day-picker";
import "react-day-picker/dist/style.css";
import useUser from "../features/auth/useUser";
import RenderPricing from "../features/doctorFindClinics/RenderPricing";
import useCheckIfBooked from "../features/doctorFindClinics/useCheckIfBooked";
import useCreateRental from "../features/doctorFindClinics/useCreactRental";
import useFindClinic from "../features/doctorFindClinics/useFindClinic";
import Button from "../ui/Button";
import ConfirmAction from "../ui/ConfirmAction";
import Empty from "../ui/Empty";
import ImagesSlider from "../ui/ImagesSlider";
import Spinner from "../ui/Spinner";
import StatusBadge from "../ui/StatusBadge";
import {formatDate} from "../utils/helpers";

function FindClinic() {
  const {user} = useUser();
  const {clinic, isLoadingClinic} = useFindClinic();
  const {createRental, isCreatingRental} = useCreateRental();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState({
    from: null,
    to: null,
  });
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [selectedPricing, setSelectedPricing] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(null);

  const {rentals: isBooked, isLoadingRentals} = useCheckIfBooked(clinic?.id);

  const handleStartTimeChange = (e) => {
    const selectedTime = e.target.value;
    if (availableHours) {
      if (
        selectedTime >= availableHours.startTime &&
        selectedTime <= availableHours.endTime
      ) {
        setSelectedStartTime(selectedTime);
        if (selectedEndTime && selectedTime >= selectedEndTime) {
          setSelectedEndTime("");
        }
      }
    } else {
      setSelectedStartTime(selectedTime);
    }
  };

  const handleEndTimeChange = (e) => {
    const selectedTime = e.target.value;
    if (availableHours) {
      // Ensure selected time is within available range
      if (
        selectedTime >= availableHours.startTime &&
        selectedTime <= availableHours.endTime
      ) {
        setSelectedEndTime(selectedTime);
        // If start time is after new end time, clear it
        if (selectedStartTime && selectedTime <= selectedStartTime) {
          setSelectedStartTime("");
        }
      }
    } else {
      setSelectedEndTime(selectedTime);
    }
  };

  if (isLoadingClinic || isLoadingRentals) return <Spinner />;

  if (!clinic) {
    return (
      <Empty
        title="Clinic Not Found"
        description="The clinic you're looking for doesn't exist."
      />
    );
  }

  const {
    name,
    address,
    images,
    created_at,
    availableDate,
    availableHours,
    features,
    district,
    mapLink,
    status,
    pricing,
  } = clinic;

  const handlePricingSelect = (pricingType) => {
    setSelectedPricing(pricingType);

    // Set the price amount based on the selected pricing type
    let priceAmount = null;
    if (pricing) {
      switch (pricingType) {
        case "Hourly Rate":
          priceAmount = pricing.hourlyRate || 0;
          break;
        case "Daily Rate":
          priceAmount = pricing.dailyRate || 0;
          break;
        case "Monthly Rate":
          priceAmount = pricing.monthlyRate || 0;
          break;
        default:
          priceAmount = null;
      }
    }
    setSelectedPrice(priceAmount);
  };

  const handleBookClick = () => {
    if (!selectedDateRange.from || !selectedDateRange.to) {
      alert("Please select a date range first");
      return;
    }
    if (!selectedStartTime || !selectedEndTime) {
      alert("Please select start and end times");
      return;
    }
    if (selectedStartTime >= selectedEndTime) {
      alert("End time must be after start time");
      return;
    }
    if (pricing?.pricingModel === "standard" && !selectedPricing) {
      alert("Please select a pricing option");
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (
      !selectedDateRange.from ||
      !selectedDateRange.to ||
      isNaN(selectedDateRange.from.getTime()) ||
      isNaN(selectedDateRange.to.getTime())
    ) {
      alert("Please select a valid date range");
      return;
    }

    const newRental = {
      clinicId: clinic.id,
      docId: user.id,
      provId: clinic.userId,
      status: "pending",
      price: selectedPrice,
      selected_date: {
        from: selectedDateRange.from.toISOString().split("T")[0],
        to: selectedDateRange.to.toISOString().split("T")[0],
      },
      selected_hours: {
        startTime: selectedStartTime,
        endTime: selectedEndTime,
      },
      selected_pricing:
        pricing?.pricingModel === "standard" ? selectedPricing : null,
    };

    createRental(newRental, {
      onSuccess: () => {
        setShowConfirm(false);
        setSelectedDateRange({from: null, to: null});
        setSelectedStartTime("");
        setSelectedEndTime("");
        setSelectedPricing("");
        setSelectedPrice(null);
      },
      onError: (error) => {
        console.error("Error creating rental:", error);
      },
    });
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-[70vh] group">
        <ImagesSlider images={images} className="h-full" />

        <div className="absolute bottom-6 left-6 right-6 text-white z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">
                {name}
              </h1>
              <div className="flex items-center gap-2 mb-2">
                <i className="ri-map-pin-line text-lg"></i>
                <p className="text-lg drop-shadow">{address}</p>
              </div>
              {district && <p className="text-white/80 text-sm">{district}</p>}
            </div>
            <div className="text-right">
              <StatusBadge status={status} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              {features && features.length > 0 && (
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8">
                  <div>
                    <div className="flex gap-2">
                      <i className="ri-star-line text-primary text-lg"></i>
                      <h3>Features</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-white 
                            rounded-xl shadow-xs">
                        <i className="ri-check-line text-lg"></i>
                        <span className="text-gray-700 font-semibold text-sm">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {availableDate && (
                <div className="bg-green-50 rounded-2xl p-6">
                  <div className="flex gap-3">
                    <i className="ri-calendar-check-line text-green-500 text-xl"></i>
                    <h3 className="text-xl font-bold text-gray-700">
                      Availability
                    </h3>
                  </div>

                  <div className="bg-white rounded-xl p-4 mb-4">
                    <div>
                      <div className="text-center mb-3">
                        <h4 className="font-semibold text-gray-700">
                          Select Date Range
                        </h4>
                        <p className="text-sm text-gray-500">
                          Choose your preferred date range from available dates
                        </p>
                        {availableDate &&
                          availableDate.from &&
                          availableDate.to && (
                            <p className="text-xs text-green-600 mt-1">
                              Available from{" "}
                              {formatDate(new Date(availableDate.from))} to{" "}
                              {formatDate(new Date(availableDate.to))}
                            </p>
                          )}
                      </div>

                      <div className="space-y-3 p-3">
                        <div className="flex justify-center">
                          <DayPicker
                            mode="range"
                            selected={selectedDateRange}
                            onSelect={setSelectedDateRange}
                            disabled={(date) => {
                              if (
                                !availableDate ||
                                !availableDate.from ||
                                !availableDate.to
                              ) {
                                return true;
                              }

                              const availableFrom = new Date(
                                availableDate.from
                              );
                              const availableTo = new Date(availableDate.to);

                              return date < availableFrom || date > availableTo;
                            }}
                            className="rdp"
                            styles={{
                              day_disabled: {
                                cursor: "not-allowed",
                                backgroundColor: "#f9fafb",
                                color: "#d1d5db",
                                opacity: 0.5,
                                pointerEvents: "none",
                              },
                            }}
                          />
                        </div>

                        {(selectedDateRange?.from || selectedDateRange?.to) && (
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Selected:</span>{" "}
                              {selectedDateRange?.from && (
                                <span>
                                  From: {formatDate(selectedDateRange.from)}
                                </span>
                              )}
                              {selectedDateRange?.from &&
                                selectedDateRange?.to && <span> - </span>}
                              {selectedDateRange?.to && (
                                <span>
                                  To: {formatDate(selectedDateRange.to)}
                                </span>
                              )}
                            </div>
                            <button
                              className="text-sm bg-gray-800 hover:bg-gray-900 
                                text-white font-semibold 
                                p-2 rounded-lg cursor-pointer"
                              onClick={() =>
                                setSelectedDateRange({from: null, to: null})
                              }>
                              Reset
                            </button>
                          </div>
                        )}

                        {(!selectedDateRange?.from ||
                          !selectedDateRange?.to) && (
                          <p className="text-red-500 text-xs text-center">
                            Please select both start and end dates to continue
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Time Selection */}
                  {availableHours && (
                    <div className="bg-white rounded-xl p-4 mb-4">
                      <div className="text-center mb-3">
                        <h4 className="font-semibold text-gray-700">
                          Select Time Range
                        </h4>
                        <p className="text-sm text-gray-500">
                          Choose your preferred time range (Available:{" "}
                          {availableHours.startTime} - {availableHours.endTime})
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Start Time
                          </label>
                          <input
                            type="time"
                            value={selectedStartTime}
                            onChange={handleStartTimeChange}
                            min={availableHours.startTime}
                            max={availableHours.endTime}
                            step="1800"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            style={{
                              colorScheme: "light",
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            End Time
                          </label>
                          <input
                            type="time"
                            value={selectedEndTime}
                            onChange={handleEndTimeChange}
                            min={availableHours.startTime}
                            max={availableHours.endTime}
                            step="1800"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 
                              focus:ring-green-500 focus:border-transparent"
                            style={{
                              colorScheme: "light",
                            }}
                          />
                        </div>
                      </div>

                      {selectedStartTime && selectedEndTime && (
                        <div className="mt-4 p-3 bg-green-50 rounded-md">
                          <p className="text-sm text-green-800 font-medium">
                            Selected Time Range:
                          </p>
                          <p className="text-sm text-green-600 mt-1">
                            {selectedStartTime} - {selectedEndTime}
                          </p>
                        </div>
                      )}

                      {(!selectedStartTime || !selectedEndTime) && (
                        <p className="text-red-500 text-xs text-center mt-2">
                          Please select both start and end times to continue
                        </p>
                      )}

                      <div className="mt-3 p-2 bg-primary/10 rounded-md">
                        <p className="text-xs text-blue-700 text-center">
                          <i className="ri-information-line mr-1"></i>
                          Only times between {availableHours.startTime} and{" "}
                          {availableHours.endTime} are available for booking
                        </p>
                      </div>
                    </div>
                  )}

                  <Button
                    type="primary"
                    size="large"
                    className="w-full"
                    disabled={
                      isCreatingRental ||
                      !selectedDateRange?.from ||
                      !selectedDateRange?.to ||
                      (availableHours &&
                        (!selectedStartTime || !selectedEndTime)) ||
                      (pricing?.pricingModel === "standard" &&
                        !selectedPricing) ||
                      isBooked
                    }
                    onClick={handleBookClick}>
                    <i className="ri-calendar-check-line mr-2"></i>
                    {isBooked
                      ? "You have already booked this clinic"
                      : isCreatingRental
                      ? "Booking..."
                      : "Book Now"}
                  </Button>
                </div>
              )}
            </div>

            {/*  Pricing & Actions */}
            <div className="lg:col-span-5">
              <div className="sticky top-8">
                <div className="bg-primary/10 rounded-2xl p-6 mb-6">
                  <div className="flex  gap-3 mb-6">
                    <i className="ri-price-tag-3-line text-primary text-lg"></i>
                    <h3>Pricing</h3>
                  </div>

                  {pricing?.pricingModel === "standard" ? (
                    <div className="space-y-4">
                      {pricing.hourlyEnabled && (
                        <RenderPricing
                          pricing={pricing}
                          title="Hourly Rate"
                          isSelectable={true}
                          isSelected={selectedPricing === "Hourly Rate"}
                          onSelect={handlePricingSelect}
                        />
                      )}

                      {pricing.dailyEnabled && (
                        <RenderPricing
                          pricing={pricing}
                          title="Daily Rate"
                          isSelectable={true}
                          isSelected={selectedPricing === "Daily Rate"}
                          onSelect={handlePricingSelect}
                        />
                      )}
                      {pricing.monthlyEnabled && (
                        <RenderPricing
                          pricing={pricing}
                          title="Monthly Rate"
                          isSelectable={true}
                          isSelected={selectedPricing === "Monthly Rate"}
                          onSelect={handlePricingSelect}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
                      <i className="ri-percent-line text-4xl mb-3"></i>
                      <p className="text-lg font-semibold">
                        Percentage-based Pricing
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-primary/10 rounded-2xl p-6 mb-6">
                  <div className="flex gap-3 mb-4">
                    <i className="ri-map-pin-line text-primary text-xl"></i>
                    <h3>Location</h3>
                  </div>
                  <p className="text-gray-700 mb-4">{address}</p>
                  <div className="flex lg:flex-row flex-col lg:items-center justify-between gap-2">
                    {district && (
                      <span
                        className="inline-block px-3 py-1 bg-primary/20 
                        text-gray-700 rounded-full text-sm font-medium">
                        {district}
                      </span>
                    )}

                    {mapLink && (
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => window.open(mapLink, "_blank")}>
                        <i className="ri-map-2-line mr-2"></i>
                        View on Map
                      </Button>
                    )}
                  </div>
                </div>

                <div className="bg-gray-100 rounded-2xl p-6">
                  <div className="flex gap-3 mb-4">
                    <i className="ri-information-line text-primary text-lg"></i>
                    <h3>Clinic Info</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status</span>
                      <StatusBadge status={status} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Created</span>
                      <span className="text-gray-900 text-sm">
                        {formatDate(created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Action Modal */}
      {showConfirm && (
        <ConfirmAction
          title="Confirm Booking"
          description={`Are you sure you want to book "${name}"? This will 
            send a booking request to the clinic owner.`}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          isLoading={isCreatingRental}
        />
      )}
    </div>
  );
}

export default FindClinic;
