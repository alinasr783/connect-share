import {useState} from "react";
import useUser from "../features/auth/useUser";
import useCreateRental from "../features/doctorFindClinics/useCreactRental";
import useFindClinic from "../features/doctorFindClinics/useFindClinic";
import Button from "../ui/Button";
import Empty from "../ui/Empty";
import ImagesSlider from "../ui/ImagesSlider";
import Spinner from "../ui/Spinner";
import StatusBadge from "../ui/StatusBadge";
import ConfirmAction from "../ui/ConfirmAction";
import {formatCurrency, formatDate} from "../utils/helpers";
import {DayPicker} from "react-day-picker";
import "react-day-picker/dist/style.css";

function RenderPricing({pricing, title}) {
  return (
    <div
      className="flex justify-between items-center p-4 bg-gray-200/60 
        rounded-2xl">
      <span className="text-gray-700 text-base">{title}</span>
      <span className="text-lg font-bold">
        {formatCurrency(pricing.dailyRate || 0)}
      </span>
    </div>
  );
}

function FindClinic() {
  const {user} = useUser();
  const {clinic, isLoadingClinic} = useFindClinic();
  const {createRental, isCreatingRental} = useCreateRental();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState({
    from: null,
    to: null,
  });

  if (isLoadingClinic) return <Spinner />;

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
    features,
    district,
    mapLink,
    status,
    pricing,
  } = clinic;

  const handleBookClick = () => {
    if (!selectedDateRange.from || !selectedDateRange.to) {
      alert("Please select a date range first");
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
      selected_date: {
        from: selectedDateRange.from.toISOString().split("T")[0],
        to: selectedDateRange.to.toISOString().split("T")[0],
      },
    };

    createRental(newRental, {
      onSuccess: () => {
        setShowConfirm(false);
        setSelectedDateRange({from: null, to: null});
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
      {/* Main Image Hero with Slider */}
      <div className="relative h-[70vh] group">
        <ImagesSlider images={images} className="h-full" />

        {/* Clinic Info Overlay */}
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

                        {selectedDateRange?.from && selectedDateRange?.to && (
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Selected:</span>{" "}
                              {formatDate(selectedDateRange.from)} -{" "}
                              {formatDate(selectedDateRange.to)}
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
                            Please select a date range to continue
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    type="primary"
                    size="large"
                    className="w-full"
                    disabled={
                      isCreatingRental ||
                      !selectedDateRange?.from ||
                      !selectedDateRange?.to
                    }
                    onClick={handleBookClick}>
                    <i className="ri-calendar-check-line mr-2"></i>
                    {isCreatingRental ? "Booking..." : "Book Now"}
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
                        <RenderPricing pricing={pricing} title="Hourly Rate" />
                      )}

                      {pricing.dailyEnabled && (
                        <RenderPricing pricing={pricing} title="Daily Rate" />
                      )}
                      {pricing.monthlyEnabled && (
                        <RenderPricing pricing={pricing} title="Monthly Rate" />
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
