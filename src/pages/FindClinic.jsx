import { useState, useRef } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import useUser from "../features/auth/useUser";
import useCheckIfBooked from "../features/doctorFindClinics/useCheckIfBooked";
import useCreateRental from "../features/doctorFindClinics/useCreactRental";
import useFindClinic from "../features/doctorFindClinics/useFindClinic";
import { useUploadPaymentScreenshot } from "../features/doctorFindClinics/useUploadPaymentScreenshot"; // ستحتاج لإنشاء هذا الهوك
import Button from "../ui/Button";
import ConfirmAction from "../ui/ConfirmAction";
import DoctorStatusCheck from "../ui/DoctorStatusCheck";
import Empty from "../ui/Empty";
import ImagesSlider from "../ui/ImagesSlider";
import Spinner from "../ui/Spinner";
import StatusBadge from "../ui/StatusBadge";
import { formatDate } from "../utils/helpers";

// Badge Component متوافق مع الثيم
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

// Card Components متوافقة مع الثيم
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
  const [selectedMethod, setSelectedMethod] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState("");
  const fileInputRef = useRef(null);

  const paymentMethods = [
    {
      id: "bank",
      name: "الحساب البنكي",
      icon: "ri-bank-line",
      description: "Account Number: 1155695010010201"
    },
    {
      id: "instapay",
      name: "انستا باي",
      icon: "ri-smartphone-line",
      description: "تحويل فوري عبر التطبيق"
    },
    {
      id: "ewallet",
      name: "المحفظة الإلكترونية",
      icon: "ri-wallet-3-line",
      description: "01009003711"
    }
  ];

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshot(file);
      const previewUrl = URL.createObjectURL(file);
      setScreenshotPreview(previewUrl);
    }
  };

  const handleRemoveScreenshot = () => {
    setScreenshot(null);
    setScreenshotPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    if (!selectedMethod) {
      alert("يرجى اختيار طريقة الدفع");
      return;
    }
    if (!screenshot) {
      alert("يرجى رفع صورة إثبات التحويل");
      return;
    }

    onPaymentSubmit({
      paymentMethod: selectedMethod,
      screenshot: screenshot
    });
  };

  const handleClose = () => {
    setSelectedMethod("");
    setScreenshot(null);
    setScreenshotPreview("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <i className="ri-bank-card-line text-green-600 text-lg"></i>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">إتمام عملية الدفع</h3>
                <p className="text-gray-600">اختر طريقة الدفع وأرفق إثبات التحويل</p>
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
        <div className="p-6 space-y-4">
          <h4 className="font-semibold text-gray-700">طرق الدفع المتاحة</h4>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedMethod === method.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedMethod(method.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                    selectedMethod === method.id ? "bg-blue-100" : "bg-gray-100"
                  }`}>
                    <i className={`${method.icon} text-xl ${
                      selectedMethod === method.id ? "text-blue-600" : "text-gray-600"
                    }`}></i>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900">{method.name}</h5>
                    <p className="text-sm text-gray-500">{method.description}</p>
                  </div>
                  {selectedMethod === method.id && (
                    <i className="ri-check-line text-blue-600 text-xl"></i>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Screenshot Upload */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-700">إثبات عملية التحويل</h4>
            
            {!screenshotPreview ? (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <i className="ri-upload-cloud-line text-3xl text-gray-400 mb-3"></i>
                <p className="text-gray-600 font-medium">انقر لرفع صورة إثبات التحويل</p>
                <p className="text-sm text-gray-500 mt-1">PNG, JPG, JPEG (الحد الأقصى 5MB)</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleScreenshotChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">الصورة المرفوعة</span>
                  <button
                    onClick={handleRemoveScreenshot}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
                <div className="relative">
                  <img
                    src={screenshotPreview}
                    alt="Screenshot preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              </div>
            )}
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
              إلغاء
            </Button>
            <Button
              type="primary"
              className="flex-1"
              onClick={handleSubmit}
              disabled={!selectedMethod || !screenshot || isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner size="small" className="mr-2" />
                  جاري المعالجة...
                </>
              ) : (
                <>
                  <i className="ri-check-line mr-2"></i>
                  تأكيد الدفع
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
  const { uploadScreenshot, isUploading } = useUploadPaymentScreenshot();
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [selectedPricing, setSelectedPricing] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [pendingRentalData, setPendingRentalData] = useState(null);

  const { rentals: bookedRentals, isLoadingRentals } = useCheckIfBooked(clinic?.id);
  
  const isBooked = bookedRentals && bookedRentals.length > 0;

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

  const handleStartTimeChange = (e) => {
    const selectedTime = e.target.value;
    const { availableHours } = clinic;
    
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
    const { availableHours } = clinic;
    
    if (availableHours) {
      if (
        selectedTime >= availableHours.startTime &&
        selectedTime <= availableHours.endTime
      ) {
        setSelectedEndTime(selectedTime);
        if (selectedStartTime && selectedTime <= selectedStartTime) {
          setSelectedStartTime("");
        }
      }
    } else {
      setSelectedEndTime(selectedTime);
    }
  };

  const handlePricingSelect = (pricingType) => {
    setSelectedPricing(pricingType);

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
    if (!selectedDays.length) {
      alert("Please select at least one available day");
      return;
    }
    
    if (availableHours && (!selectedStartTime || !selectedEndTime)) {
      alert("Please select start and end times");
      return;
    }
    
    if (availableHours && selectedStartTime >= selectedEndTime) {
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
    const rentalData = {
      clinicId: clinic.id,
      docId: user?.id,
      provId: clinic.userId,
      status: "pending",
      price: selectedPrice,
      selected_date: {
        days: selectedDays.map((d) => formatDate(d, 'yyyy-MM-dd')),
      },
      selected_hours: availableHours ? {
        startTime: selectedStartTime,
        endTime: selectedEndTime,
      } : null,
      selected_pricing:
        pricing?.pricingModel === "standard" ? selectedPricing : null,
    };

    setPendingRentalData(rentalData);
    setShowConfirm(false);
    setShowPaymentPopup(true);
  };

  // في دالة handlePaymentSubmit في FindClinic.jsx
const handlePaymentSubmit = async (paymentData) => {
  try {
    // رفع الصورة إلى Supabase والحصول على الرابط
    const screenshotUrl = await uploadScreenshot(paymentData.screenshot);
    
    // إنشاء الحجز مع رابط الصورة
    const rentalWithImage = {
      ...pendingRentalData,
      image: screenshotUrl,
      payment_method: paymentData.paymentMethod,
      payment_status: 'pending' // إضافة حالة الدفع
    };

    createRental(rentalWithImage, {
      onSuccess: () => {
        setShowPaymentPopup(false);
        setSelectedDays([]);
        setSelectedStartTime("");
        setSelectedEndTime("");
        setSelectedPricing("");
        setSelectedPrice(null);
        setPendingRentalData(null);
        
        // إظهار رسالة نجاح
        alert('تم إرسال طلب الحجز بنجاح! سيتم المراجعة من قبل مالك العيادة.');
      },
      onError: (error) => {
        console.error("Error creating rental:", error);
        alert("فشل في إنشاء الحجز. يرجى المحاولة مرة أخرى.");
      },
    });
  } catch (error) {
    console.error("Error in payment process:", error);
    alert(`فشل في رفع صورة التحويل: ${error.message}`);
  }
};

  const handleCancel = () => {
    setShowConfirm(false);
  };

  const formatDateForDisplay = (date) => {
    return formatDate(date);
  };

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
                                ${pricing.hourlyRate || 0}
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
                                ${pricing.dailyRate || 0}
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
                                ${pricing.monthlyRate || 0}
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
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700 font-medium">{selectedPricing}</span>
                        <span className="text-2xl font-bold text-green-600">
                          ${selectedPrice}
                        </span>
                      </div>
                      <div className="text-center text-sm text-gray-500">
                        Selected pricing option
                      </div>
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
          isLoading={isCreatingRental || isUploading}
        />
      </div>
    </DoctorStatusCheck>
  );
}

export default FindClinic;