import { useState, useRef } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import useUser from "../features/auth/useUser";
import useCheckIfBooked from "../features/doctorFindClinics/useCheckIfBooked";
import useCreateRental from "../features/doctorFindClinics/useCreactRental";
import useFindClinic from "../features/doctorFindClinics/useFindClinic";
import { useDiscount } from "../features/discount/useDiscount";
import Button from "../ui/Button";
import ConfirmAction from "../ui/ConfirmAction";
import DoctorStatusCheck from "../ui/DoctorStatusCheck";
import Empty from "../ui/Empty";
import ImagesSlider from "../ui/ImagesSlider";
import Spinner from "../ui/Spinner";
import StatusBadge from "../ui/StatusBadge";
import { formatDate } from "../utils/helpers";

// Badge Component
const Badge = ({ 
  variant = 'default',
  className,
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-blue-500 text-white',
    secondary: 'bg-gray-200 text-gray-800',
    destructive: 'bg-red-500 text-white',
    outline: 'border border-gray-300 bg-white text-gray-700',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
  };

  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Components
const Card = ({ className, children, ...props }) => {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardContent = ({ className, children, ...props }) => {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
};

// Payment Methods Popup Component
const PaymentPopup = ({ isOpen, onClose, onPaymentSubmit, isLoading }) => {
  const [paymentText, setPaymentText] = useState("");

  const paymentDetails = {
    bank: {
      title: "Instapay or Bank Transfer",
      details: [
        "Bank Name: Arab African International Bank (AAIB)",
        "Account Name: DID",
        "Account Number: 1155695010010201", 
        "IBAN: EG770057093101155695010010201",
        "SWIFT Code: ARAIEGCXXXX"
      ]
    },
    mobile: {
      title: "Mobile Wallet",
      details: [
        "+201009003711"
      ]
    }
  };

  // WhatsApp sharing function
  const handleShareToWhatsApp = () => {
    // WhatsApp number
    const whatsappNumber = "+201009003711";
    
    // Create a message with payment reference if available
    let message = "Payment Screenshot";
    if (paymentText.trim()) {
      message += ` - Reference: ${paymentText.trim()}`;
    }
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
  };

  const handleSubmit = () => {
    // Submit payment text only, no screenshot upload
    onPaymentSubmit({
      payment_text: paymentText.trim(),
      whatsapp_shared: true // Indicate that WhatsApp sharing was the method
    });
  };

  const handleClose = () => {
    setPaymentText("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <i className="ri-bank-card-line text-green-600 text-lg"></i>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Complete Payment</h3>
                <p className="text-gray-600">Choose payment method and share proof via WhatsApp</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="p-6 space-y-6">
          {/* Bank Transfer Details */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700 text-lg">Payment Methods</h4>
            
            {/* Bank Transfer */}
            <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
              <div className="flex items-start gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <i className="ri-bank-line text-blue-600 text-lg"></i>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 text-sm">{paymentDetails.bank.title}</h5>
                </div>
              </div>
              <div className="space-y-2 pl-13">
                {paymentDetails.bank.details.map((detail, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <i className="ri-check-line text-green-500 text-sm"></i>
                    <p className="text-sm text-gray-700 font-mono">{detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Wallet */}
            <div className="border border-gray-200 rounded-lg p-4 bg-green-50">
              <div className="flex items-start gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <i className="ri-smartphone-line text-green-600 text-lg"></i>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 text-sm">{paymentDetails.mobile.title}</h5>
                </div>
              </div>
              <div className="space-y-2 pl-13">
                {paymentDetails.mobile.details.map((detail, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <i className="ri-check-line text-green-500 text-sm"></i>
                    <p className="text-sm text-gray-700 font-mono">{detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Reference (Optional) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-700">Payment Reference (Optional)</h4>
              <span className="text-xs text-gray-500">Transaction number or account reference</span>
            </div>
            <input
              type="text"
              value={paymentText}
              onChange={(e) => setPaymentText(e.target.value)}
              placeholder="Enter transaction number or account reference..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* WhatsApp Share Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-700">Share Payment Proof</h4>
              <span className="text-xs text-gray-500">Required</span>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <i className="ri-whatsapp-line text-green-600 text-3xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Send Screenshot via WhatsApp</h3>
              <p className="text-gray-600 mb-6">
                After completing your payment, take a screenshot and share it directly through WhatsApp
              </p>
              
              <button
                onClick={handleShareToWhatsApp}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 mx-auto shadow-lg hover:shadow-xl"
              >
                <i className="ri-whatsapp-line text-2xl"></i>
                <span className="text-lg font-semibold">Send Screenshot to WhatsApp</span>
              </button>
              
              <p className="text-sm text-gray-500 mt-4">
                Click the button above to open WhatsApp and send your payment screenshot
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex gap-3">
            <Button
              type="secondary"
              className="flex-1"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              className="flex-1"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner size="small" className="mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <i className="ri-check-line mr-2"></i>
                  Confirm Payment
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

function FindClinic() {
  const { user } = useUser();
  const { clinic, isLoadingClinic, error: clinicError } = useFindClinic();
  const { createRental, isCreatingRental } = useCreateRental();
  const { validateDiscount, isValidating } = useDiscount();
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [selectedPricing, setSelectedPricing] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [pendingRentalData, setPendingRentalData] = useState(null);
  
  // حالة كود الخصم
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountError, setDiscountError] = useState("");

  const { rentals: bookedRentals, isLoadingRentals } = useCheckIfBooked(clinic?.id);
  
  const isBooked = bookedRentals && bookedRentals.length > 0;

  // حساب السعر بعد الخصم
  const calculateDiscountedPrice = () => {
    if (!selectedPrice) return null;
    
    if (appliedDiscount) {
      const discountAmount = (selectedPrice * appliedDiscount.percentage) / 100;
      return selectedPrice - discountAmount;
    }
    
    return selectedPrice;
  };

  const finalPrice = calculateDiscountedPrice();
  const discountAmount = appliedDiscount ? selectedPrice - finalPrice : 0;

  // تطبيق كود الخصم
  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setDiscountError("Please enter a discount code");
      return;
    }

    try {
      setDiscountError("");
      validateDiscount(discountCode, {
        onSuccess: (discountData) => {
          setAppliedDiscount(discountData);
          setDiscountError("");
        },
        onError: (error) => {
          setDiscountError(error.message);
          setAppliedDiscount(null);
        }
      });
    } catch (error) {
      setDiscountError("Failed to validate discount code");
      setAppliedDiscount(null);
    }
  };

  // إزالة الخصم
  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode("");
    setDiscountError("");
  };

  const handleStartTimeChange = (e) => {
    const selectedTime = e.target.value;
    if (!clinic?.availableHours) {
      setSelectedStartTime(selectedTime);
      return;
    }
    
    const { availableHours } = clinic;
    if (
      selectedTime >= availableHours.startTime &&
      selectedTime <= availableHours.endTime
    ) {
      setSelectedStartTime(selectedTime);
      if (selectedEndTime && selectedTime >= selectedEndTime) {
        setSelectedEndTime("");
      }
    }
  };

  const handleEndTimeChange = (e) => {
    const selectedTime = e.target.value;
    if (!clinic?.availableHours) {
      setSelectedEndTime(selectedTime);
      return;
    }
    
    const { availableHours } = clinic;
    if (
      selectedTime >= availableHours.startTime &&
      selectedTime <= availableHours.endTime
    ) {
      setSelectedEndTime(selectedTime);
      if (selectedStartTime && selectedTime <= selectedStartTime) {
        setSelectedStartTime("");
      }
    }
  };

  const handlePricingSelect = (pricingType) => {
    setSelectedPricing(pricingType);

    let priceAmount = null;
    const { pricing } = clinic || {};
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
    if (!selectedDays.length) {
      alert("Please select at least one available day");
      return;
    }
    
    if (clinic?.availableHours && (!selectedStartTime || !selectedEndTime)) {
      alert("Please select start and end times");
      return;
    }
    
    if (clinic?.availableHours && selectedStartTime >= selectedEndTime) {
      alert("End time must be after start time");
      return;
    }
    
    if (clinic?.pricing?.pricingModel === "standard" && !selectedPricing) {
      alert("Please select a pricing option");
      return;
    }
    
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (!clinic) return;

    const rentalData = {
      clinicId: clinic.id,
      docId: user?.id,
      provId: clinic.userId,
      status: "pending",
      price: finalPrice || selectedPrice,
      original_price: selectedPrice,
      discount_code: appliedDiscount?.code,
      discount_percentage: appliedDiscount?.percentage,
      selected_date: {
        days: selectedDays.map((d) => formatDate(d, 'yyyy-MM-dd')),
      },
      selected_hours: clinic.availableHours ? {
        startTime: selectedStartTime,
        endTime: selectedEndTime,
      } : null,
      selected_pricing:
        clinic.pricing?.pricingModel === "standard" ? selectedPricing : null,
    };

    setPendingRentalData(rentalData);
    setShowConfirm(false);
    setShowPaymentPopup(true);
  };

  const handlePaymentSubmit = async (paymentData) => {
    try {
      // Create booking with payment text only (no screenshot upload)
      const rentalWithPayment = {
        ...pendingRentalData,
        payment_text: paymentData.payment_text || "",
        payment_status: 'pending',
        whatsapp_shared: paymentData.whatsapp_shared || false
      };

      createRental(rentalWithPayment, {
        onSuccess: () => {
          setShowPaymentPopup(false);
          setSelectedDays([]);
          setSelectedStartTime("");
          setSelectedEndTime("");
          setSelectedPricing("");
          setSelectedPrice(null);
          setPendingRentalData(null);
          setAppliedDiscount(null);
          setDiscountCode("");
          
          // Show success message
          alert('Booking request sent successfully! It will be reviewed by the clinic owner.');
        },
        onError: (error) => {
          console.error("Error creating rental:", error);
          alert("Failed to create booking. Please try again.");
        },
      });
    } catch (error) {
      console.error("Error in payment process:", error);
      alert(`Failed to process payment: ${error.message}`);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  const formatDateForDisplay = (date) => {
    return formatDate(date);
  };

  // تحقق من وجود clinic قبل الوصول إلى خصائصه
  if (isLoadingClinic || isLoadingRentals) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (clinicError) {
    return (
      <Empty
        title="Error Loading Clinic"
        description="There was a problem loading the clinic information. Please try again."
      />
    );
  }

  if (!clinic) {
    return (
      <Empty
        title="Clinic Not Found"
        description="The clinic you're looking for doesn't exist."
      />
    );
  }

  // استخراج الخصائص بعد التأكد من وجود clinic
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

  const hasAvailability = availableDate && (
    (Array.isArray(availableDate.days) && availableDate.days.length > 0) ||
    (availableDate.from && availableDate.to)
  );

  return (
    <DoctorStatusCheck>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative h-[60vh] group overflow-hidden">
          <ImagesSlider images={images} className="h-full w-full object-cover" />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30"></div>
          
          {/* Content */}
          <div className="absolute bottom-6 left-6 right-6 text-white z-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">
                  {name}
                </h1>
                <div className="flex items-center gap-2 mb-2">
                  <i className="ri-map-pin-line text-lg"></i>
                  <p className="text-lg drop-shadow">{address}</p>
                </div>
                {district && (
                  <div className="flex items-center gap-2">
                    <i className="ri-building-2-line text-sm"></i>
                    <p className="text-white/80 text-sm">{district}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Badge 
                  variant={
                    status === 'confirmed' ? 'success' : 
                    status === 'pending' ? 'warning' : 'secondary'
                  }
                >
                  {status === 'confirmed' ? 'Available' : 
                   status === 'pending' ? 'Pending' : 'Unavailable'}
                </Badge>
                {isBooked && (
                  <Badge variant="default">
                    Already Booked
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column - Features & Booking */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Features Section */}
              {features && features.length > 0 && (
                <Card className="overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <i className="ri-star-line text-blue-600 text-lg"></i>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">Features & Amenities</h3>
                        <p className="text-gray-600">What this clinic offers</p>
                      </div>
                    </div>
                  </div>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <i className="ri-check-line text-green-500 text-lg"></i>
                          <span className="text-gray-700 font-medium text-sm">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Availability & Booking Section */}
              <Card>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <i className="ri-calendar-check-line text-green-600 text-lg"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Book This Clinic</h3>
                      <p className="text-gray-600">Select your preferred dates and times</p>
                    </div>
                  </div>
                </div>
                
                <CardContent className="space-y-6">
                  
                  {/* Date Selection */}
                  <div className="space-y-4">
                    <div className="text-center">
                      <h4 className="font-semibold text-gray-700 text-lg">Select Available Days</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Choose from the available dates below
                      </p>
                    </div>

                    {availableDate ? (
                      <div className="flex justify-center">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <DayPicker
                            mode="multiple"
                            selected={selectedDays}
                            onSelect={(days) => setSelectedDays(Array.isArray(days) ? days : [])}
                            modifiers={{
                              available: (date) => {
                                if (availableDate.days) {
                                  const dateStr = date.toISOString().split('T')[0];
                                  return availableDate.days.includes(dateStr);
                                }
                                if (availableDate.from && availableDate.to) {
                                  const from = new Date(availableDate.from);
                                  const to = new Date(availableDate.to);
                                  return date >= from && date <= to;
                                }
                                return false;
                              },
                            }}
                            disabled={(date) => {
                              if (availableDate.days) {
                                const dateStr = date.toISOString().split('T')[0];
                                return !availableDate.days.includes(dateStr);
                              }
                              if (availableDate.from && availableDate.to) {
                                const from = new Date(availableDate.from);
                                const to = new Date(availableDate.to);
                                return date < from || date > to;
                              }
                              return true;
                            }}
                            className="border-0"
                            classNames={{
                              day_selected: "bg-blue-500 text-white hover:bg-blue-600",
                              day_disabled: "text-gray-300 cursor-not-allowed",
                              day_today: "font-bold",
                              day_outside: "text-gray-300",
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <i className="ri-calendar-close-line text-4xl text-gray-300 mb-3"></i>
                        <p className="text-gray-500">No availability information</p>
                      </div>
                    )}

                    {selectedDays.length > 0 && (
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-800">
                              Selected {selectedDays.length} day{selectedDays.length > 1 ? 's' : ''}:
                            </p>
                            <p className="text-sm text-blue-600 mt-1">
                              {selectedDays.map((day, index) => (
                                <span key={index} className="mr-2">
                                  {formatDateForDisplay(day)}
                                  {index < selectedDays.length - 1 ? ',' : ''}
                                </span>
                              ))}
                            </p>
                          </div>
                          <button
                            onClick={() => setSelectedDays([])}
                            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md transition-colors"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Time Selection */}
                  {availableHours && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <h4 className="font-semibold text-gray-700 text-lg">Select Time Range</h4>
                        <p className="text-sm text-gray-500">
                          Available hours: {availableHours.startTime} - {availableHours.endTime}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Start Time
                          </label>
                          <input
                            type="time"
                            value={selectedStartTime}
                            onChange={handleStartTimeChange}
                            min={availableHours.startTime}
                            max={availableHours.endTime}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            End Time
                          </label>
                          <input
                            type="time"
                            value={selectedEndTime}
                            onChange={handleEndTimeChange}
                            min={availableHours.startTime}
                            max={availableHours.endTime}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          />
                        </div>
                      </div>

                      {selectedStartTime && selectedEndTime && (
                        <div className="bg-green-50 rounded-lg p-4">
                          <p className="text-sm font-medium text-green-800">
                            Selected Time: {selectedStartTime} - {selectedEndTime}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pricing Selection */}
                  {pricing?.pricingModel === "standard" && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <h4 className="font-semibold text-gray-700 text-lg">Select Pricing Option</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {pricing.hourlyEnabled && (
                          <div
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                              selectedPricing === "Hourly Rate"
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => handlePricingSelect("Hourly Rate")}
                          >
                            <div className="text-center">
                              <i className="ri-time-line text-2xl text-blue-500 mb-2"></i>
                              <h5 className="font-semibold text-gray-900">Hourly Rate</h5>
                              <p className="text-2xl font-bold text-blue-600 mt-2">
                                EGP {pricing.hourlyRate || 0}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">per hour</p>
                            </div>
                          </div>
                        )}

                        {pricing.dailyEnabled && (
                          <div
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                              selectedPricing === "Daily Rate"
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => handlePricingSelect("Daily Rate")}
                          >
                            <div className="text-center">
                              <i className="ri-sun-line text-2xl text-green-500 mb-2"></i>
                              <h5 className="font-semibold text-gray-900">Daily Rate</h5>
                              <p className="text-2xl font-bold text-green-600 mt-2">
                                EGP {pricing.dailyRate || 0}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">per day</p>
                            </div>
                          </div>
                        )}

                        {pricing.monthlyEnabled && (
                          <div
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                              selectedPricing === "Monthly Rate"
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => handlePricingSelect("Monthly Rate")}
                          >
                            <div className="text-center">
                              <i className="ri-calendar-2-line text-2xl text-purple-500 mb-2"></i>
                              <h5 className="font-semibold text-gray-900">Monthly Rate</h5>
                              <p className="text-2xl font-bold text-purple-600 mt-2">
                                EGP {pricing.monthlyRate || 0}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">per month</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Book Button */}
                  <Button
                    type="primary"
                    size="large"
                    className="w-full py-3 text-lg font-semibold"
                    disabled={
                      isCreatingRental ||
                      !hasAvailability ||
                      selectedDays.length === 0 ||
                      (availableHours && (!selectedStartTime || !selectedEndTime)) ||
                      (pricing?.pricingModel === "standard" && !selectedPricing) ||
                      isBooked
                    }
                    onClick={handleBookClick}
                  >
                    {isCreatingRental ? (
                      <>
                        <Spinner size="small" className="mr-2" />
                        Processing Booking...
                      </>
                    ) : isBooked ? (
                      <>
                        <i className="ri-check-double-line mr-2"></i>
                        Already Booked
                      </>
                    ) : (
                      <>
                        <i className="ri-calendar-check-line mr-2"></i>
                        Book This Clinic
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Pricing Summary */}
              <Card>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <i className="ri-price-tag-3-line text-purple-600 text-lg"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Pricing Summary</h3>
                      <p className="text-gray-600">Cost breakdown</p>
                    </div>
                  </div>
                </div>
                <CardContent>
                  {selectedPricing && selectedPrice ? (
                    <div className="space-y-4">
                      {/* السعر الأصلي */}
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="text-gray-700 font-medium">{selectedPricing}</span>
                          {appliedDiscount && (
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="success" className="text-xs">
                                -{appliedDiscount.percentage}% OFF
                              </Badge>
                              <span className="text-xs text-gray-500 line-through">
                                EGP {selectedPrice}
                              </span>
                            </div>
                          )}
                        </div>
                        <span className={`text-2xl font-bold ${appliedDiscount ? 'text-green-600' : 'text-gray-900'}`}>
                          EGP {finalPrice}
                        </span>
                      </div>

                      {/* قسم كود الخصم */}
                      <div className="space-y-3">
                        {!appliedDiscount ? (
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={discountCode}
                                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                                placeholder="Enter discount code"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                disabled={isValidating}
                              />
                              <Button
                                type="secondary"
                                size="small"
                                onClick={handleApplyDiscount}
                                disabled={isValidating || !discountCode.trim()}
                              >
                                {isValidating ? <Spinner size="small" /> : "Apply"}
                              </Button>
                            </div>
                            {discountError && (
                              <p className="text-red-500 text-sm">{discountError}</p>
                            )}
                          </div>
                        ) : (
                          <div className="bg-green-50 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <i className="ri-check-line text-green-500"></i>
                                <span className="text-green-700 font-medium">
                                  Discount applied: {appliedDiscount.code}
                                </span>
                              </div>
                              <button
                                onClick={handleRemoveDiscount}
                                className="text-red-500 hover:text-red-700 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                            {discountAmount > 0 && (
                              <p className="text-green-600 text-sm mt-1">
                                You saved EGP {discountAmount}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* تفاصيل الخصم */}
                      {appliedDiscount && discountAmount > 0 && (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-gray-600">
                            <span>Original Price:</span>
                            <span>EGP {selectedPrice}</span>
                          </div>
                          <div className="flex justify-between text-green-600">
                            <span>Discount ({appliedDiscount.percentage}%):</span>
                            <span>- EGP {discountAmount}</span>
                          </div>
                          <div className="flex justify-between font-semibold text-lg border-t pt-2">
                            <span>Final Price:</span>
                            <span className="text-green-600">EGP {finalPrice}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <i className="ri-price-tag-line text-4xl text-gray-300 mb-3"></i>
                      <p className="text-gray-500">Select a pricing option to see details</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Location Card */}
              <Card>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                      <i className="ri-map-pin-line text-red-600 text-lg"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Location</h3>
                      <p className="text-gray-600">Clinic address and map</p>
                    </div>
                  </div>
                </div>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <i className="ri-map-pin-2-line text-gray-400 mt-1"></i>
                    <div>
                      <p className="text-gray-700 font-medium">{address}</p>
                      {district && (
                        <p className="text-sm text-gray-500 mt-1">{district}</p>
                      )}
                    </div>
                  </div>
                  
                  {mapLink && (
                    <Button
                      type="primary"
                      size="medium"
                      className="w-full"
                      onClick={() => window.open(mapLink, "_blank")}
                    >
                      <i className="ri-map-2-line mr-2"></i>
                      View on Google Maps
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Clinic Information */}
              <Card>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <i className="ri-information-line text-gray-600 text-lg"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Clinic Information</h3>
                      <p className="text-gray-600">Details and status</p>
                    </div>
                  </div>
                </div>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status</span>
                      <Badge 
                        variant={
                          status === 'confirmed' ? 'success' : 
                          status === 'pending' ? 'warning' : 'secondary'
                        }
                      >
                        {status === 'confirmed' ? 'Available' : 
                         status === 'pending' ? 'Pending' : 'Unavailable'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Listed Since</span>
                      <span className="text-gray-900 font-medium">
                        {formatDateForDisplay(created_at)}
                      </span>
                    </div>
                    {isBooked && (
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <i className="ri-information-line text-blue-500"></i>
                          <span className="text-sm text-blue-700">
                            You have an existing booking for this clinic
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Confirm Action Modal */}
        {showConfirm && (
          <ConfirmAction
            title="Confirm Clinic Booking"
            description={`Are you sure you want to book "${name}" for ${selectedDays.length} day${selectedDays.length > 1 ? 's' : ''}? This will send a booking request to the clinic owner.`}
            confirmText={isCreatingRental ? "Booking..." : "Confirm Booking"}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            isLoading={isCreatingRental}
          />
        )}

        {/* Payment Methods Popup */}
        <PaymentPopup
          isOpen={showPaymentPopup}
          onClose={() => setShowPaymentPopup(false)}
          onPaymentSubmit={handlePaymentSubmit}
          isLoading={isCreatingRental}
        />
      </div>
    </DoctorStatusCheck>
  );
}

export default FindClinic;