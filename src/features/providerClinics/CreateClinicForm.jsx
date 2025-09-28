import {useState} from "react";
import {DayPicker} from "react-day-picker";
import "react-day-picker/dist/style.css";
import {useForm} from "react-hook-form";
import Button from "../../ui/Button";
import useUser from "../auth/useUser";
import useCreateClinic from "./useCreateClinic";
import useUpdateClinic from "./updateClinic";

function CreateClinicForm({clinicToEdit = {}, onClose}) {
  const {id: editId, ...editValues} = clinicToEdit;
  const isEditSession = Boolean(editId);
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: isEditSession
      ? {
          ...editValues,
          hourlyRate: editValues.pricing?.hourlyRate || "",
          dailyRate: editValues.pricing?.dailyRate || "",
          monthlyRate: editValues.pricing?.monthlyRate || "",
          serviceName: editValues.pricing?.serviceName || "",
          minimumServiceValue: editValues.pricing?.minimumServiceValue || "",
          ownerCommission: editValues.pricing?.ownerCommission || "",
        }
      : {},
  });

  const [range, setRange] = useState(
    isEditSession
      ? {
          from: new Date(clinicToEdit.availableDate?.from),
          to: new Date(clinicToEdit.availableDate?.to),
        }
      : undefined
  );
  const [rangeError, setRangeError] = useState(null);

  // Features state management
  const [features, setFeatures] = useState(
    isEditSession && clinicToEdit.features ? clinicToEdit.features : []
  );
  const [newFeature, setNewFeature] = useState("");

  // Images state management
  const [images, setImages] = useState(() => {
    if (isEditSession && clinicToEdit.images) {
      // If editing and images exist, they are URLs from the database
      return clinicToEdit.images;
    }
    return [];
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  // Pricing state management
  const [pricingModel, setPricingModel] = useState(() => {
    if (isEditSession && clinicToEdit.pricing) {
      return clinicToEdit.pricing.pricingModel || "standard";
    }
    return "standard";
  });

  const [hourlyEnabled, setHourlyEnabled] = useState(() => {
    if (isEditSession && clinicToEdit.pricing) {
      return (
        clinicToEdit.pricing.hourlyEnabled ||
        Boolean(clinicToEdit.pricing.hourlyRate)
      );
    }
    return false;
  });

  const [dailyEnabled, setDailyEnabled] = useState(() => {
    if (isEditSession && clinicToEdit.pricing) {
      return (
        clinicToEdit.pricing.dailyEnabled ||
        Boolean(clinicToEdit.pricing.dailyRate)
      );
    }
    return true;
  });

  const [monthlyEnabled, setMonthlyEnabled] = useState(() => {
    if (isEditSession && clinicToEdit.pricing) {
      return (
        clinicToEdit.pricing.monthlyEnabled ||
        Boolean(clinicToEdit.pricing.monthlyRate)
      );
    }
    return false;
  });

  const [percentageEnabled, setPercentageEnabled] = useState(() => {
    if (isEditSession && clinicToEdit.pricing) {
      return (
        clinicToEdit.pricing.percentageEnabled ||
        Boolean(clinicToEdit.pricing.serviceName)
      );
    }
    return false;
  });

  const {user} = useUser();
  const {createClinic, isCreatingClinic} = useCreateClinic();
  const {updateClinic, isUpdatingClinic} = useUpdateClinic();

  const isLoading = isCreatingClinic || isUpdatingClinic || isUploadingImages;

  const handleRangeSelect = (selectedRange) => {
    setRange(selectedRange);
    if (selectedRange?.from) {
      setRangeError(null);
    }
  };

  // Feature management functions
  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (featureToRemove) => {
    setFeatures(features.filter((feature) => feature !== featureToRemove));
  };

  const handleFeatureKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFeature();
    }
  };

  // Image handling functions
  const handleImageUpload = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(
      (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024 // 5MB limit
    );

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          id: Date.now() + Math.random(),
          file: file,
          preview: e.target.result,
          name: file.name,
        };
        setImages((prev) => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (imageIdOrIndex) => {
    setImages(
      images.filter((img, index) => {
        // For new images (with id), match by id
        if (img.id) {
          return img.id !== imageIdOrIndex;
        }
        // For existing images (URLs), match by index
        return index !== imageIdOrIndex;
      })
    );
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleImageUpload(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e) => {
    handleImageUpload(e.target.files);
  };

  // Pricing model handlers
  const handlePricingModelChange = (model) => {
    setPricingModel(model);
    if (model === "standard") {
      setPercentageEnabled(false);
      // If in edit mode, restore the enabled states based on existing data
      if (isEditSession && clinicToEdit.pricing) {
        setHourlyEnabled(Boolean(clinicToEdit.pricing.hourlyRate));
        setDailyEnabled(Boolean(clinicToEdit.pricing.dailyRate));
        setMonthlyEnabled(Boolean(clinicToEdit.pricing.monthlyRate));
      }
    } else {
      setHourlyEnabled(false);
      setDailyEnabled(false);
      setMonthlyEnabled(false);
      setPercentageEnabled(true);
    }
  };

  const onSubmit = async (data) => {
    if (!range || !range.from) {
      setRangeError("Please select a date range.");
      return;
    }

    // Separate new images (with file property) from existing URLs
    const newImages = images.filter((img) => img.file);
    const existingImages = images.filter((img) => typeof img === "string");

    // Set uploading state if there are new images to upload
    if (newImages.length > 0) {
      setIsUploadingImages(true);
    }

    // Prepare pricing data based on selected model
    const pricingData = {
      pricingModel,
      ...(pricingModel === "standard" && {
        hourlyEnabled,
        dailyEnabled,
        monthlyEnabled,
        ...(hourlyEnabled && {hourlyRate: data.hourlyRate}),
        ...(dailyEnabled && {dailyRate: data.dailyRate}),
        ...(monthlyEnabled && {monthlyRate: data.monthlyRate}),
      }),
      ...(pricingModel === "percentage" && {
        percentageEnabled,
        ...(percentageEnabled && {
          serviceName: data.serviceName,
          minimumServiceValue: data.minimumServiceValue,
          ownerCommission: data.ownerCommission,
        }),
      }),
    };

    // Remove pricing fields from main data object since they're now in pricing object
    const {
      hourlyRate: _hourlyRate,
      dailyRate: _dailyRate,
      monthlyRate: _monthlyRate,
      serviceName: _serviceName,
      minimumServiceValue: _minimumServiceValue,
      ownerCommission: _ownerCommission,
      ...cleanData
    } = data;

    const clinicData = {
      ...cleanData,
      userId: user.id,
      features: features,
      pricing: pricingData,
      images: newImages,
      availableDate: {
        from: range?.from.toISOString(),
        to: range?.to.toISOString(),
      },
    };

    const callback = {
      onSuccess: () => {
        setIsUploadingImages(false);
        onClose?.();
      },
      onError: () => {
        setIsUploadingImages(false);
      },
    };

    try {
      if (isEditSession) {
        updateClinic({newClinic: clinicData, id: editId}, callback);
      } else {
        createClinic(clinicData, callback);
      }
    } catch (error) {
      setIsUploadingImages(false);
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="">
        {/* Left side*/}
        <div className="flex flex-col gap-6">
          {/* first section */}
          <div className="flex flex-col gap-4 p-4 bg-white rounded-md">
            <h3 className="text-lg font-semibold text-gray-800">
              Clinic Details
            </h3>

            <div>
              <input
                type="text"
                disabled={isLoading}
                id="name"
                placeholder="Enter clinic name"
                {...register("name", {required: "Clinic name is required"})}
                className="input"
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                disabled={isLoading}
                id="address"
                placeholder="Enter clinic address"
                {...register("address", {required: "Address is required"})}
                className="input"
              />
              {errors.address && (
                <p className="text-red-500">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="url"
                  disabled={isLoading}
                  id="mapLink"
                  placeholder="Enter google map link"
                  {...register("mapLink", {required: "Map link is required"})}
                  className="input"
                />
                {errors.mapLink && (
                  <p className="text-red-500">{errors.mapLink.message}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  disabled={isLoading}
                  id="district"
                  placeholder="Enter district"
                  {...register("district", {required: "District is required"})}
                  className="input"
                />
                {errors.district && (
                  <p className="text-red-500">{errors.district.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* second section */}
          <div className="flex flex-col gap-4 p-4 bg-white rounded-md">
            <h3 className="text-lg font-semibold text-gray-800">
              Clinic Features
            </h3>
            <p className="text-sm text-gray-600">
              Select or add clinic features
            </p>

            {/* Features display */}
            <div className="flex flex-wrap gap-2 mb-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-100 
                    text-blue-800 rounded-full text-sm">
                  <span>{feature}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(feature)}
                    disabled={isLoading}
                    className="text-blue-600 hover:text-blue-800 font-bold text-lg leading-none"
                    aria-label={`Remove ${feature}`}>
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Add feature input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={handleFeatureKeyPress}
                placeholder="Add a feature..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button
                type="button"
                onClick={addFeature}
                disabled={isLoading || !newFeature.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-md 
                  hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed 
                    transition-colors">
                Add
              </Button>
            </div>
          </div>

          {/* third section - Clinic Images */}
          <div className="flex flex-col gap-4 p-4 bg-white rounded-md">
            <h3 className="text-lg font-semibold text-gray-800">
              Clinic Images
            </h3>
            <p className="text-sm text-gray-600">Upload Images</p>

            {/* Image Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              } ${isUploadingImages ? "opacity-50 pointer-events-none" : ""}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}>
              {/* Upload Icon */}
              <div className="flex flex-col items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>

                <p className="text-gray-600 mb-2">
                  Drag and drop images here, or{" "}
                  <label className="text-blue-500 hover:text-blue-600 cursor-pointer underline">
                    browse
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                      disabled={isLoading}
                    />
                  </label>
                </p>
                <p className="text-sm text-gray-400">
                  PNG, JPG, GIF up to 5MB each
                </p>
                {isUploadingImages && (
                  <p className="text-sm text-blue-600 mt-2 font-medium">
                    Uploading images to cloud storage...
                  </p>
                )}
              </div>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {images.map((image, index) => (
                  <div key={image.id || index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={image.preview || image}
                        alt={`Clinic image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeImage(image.id || index)}
                      disabled={isLoading}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full 
                        w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 opacity-0 
                          group-hover:opacity-100 transition-opacity"
                      aria-label={`Remove image ${index + 1}`}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            variation="primary"
            type="submit"
            className="px-6 py-2"
            disabled={isLoading}>
            {isUploadingImages
              ? "Uploading Images..."
              : isCreatingClinic
              ? "Creating Clinic..."
              : isUpdatingClinic
              ? "Updating..."
              : isEditSession
              ? "Update Clinic"
              : "Create Clinic"}
          </Button>
        </div>
      </div>

      {/* Right side: Pricing and Calendar */}
      <div className="flex flex-col gap-6">
        {/* Rental Pricing Section */}
        <div className="bg-white p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Rental Pricing
          </h3>

          {/* Pricing Model Selection */}
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => handlePricingModelChange("standard")}
              className={`px-3 py-1.5 text-sm rounded border transition-colors ${
                pricingModel === "standard"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300 hover:border-blue-500"
              }`}
              disabled={isLoading}>
              Standard Rates
            </button>
            <button
              type="button"
              onClick={() => handlePricingModelChange("percentage")}
              className={`px-3 py-1.5 text-sm rounded border transition-colors ${
                pricingModel === "percentage"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300 hover:border-blue-500"
              }`}
              disabled={isLoading}>
              Percentage Model
            </button>
          </div>

          {/* Standard Rates Section */}
          {pricingModel === "standard" && (
            <div className="space-y-3">
              {/* Hourly Rental */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-gray-600 font-medium">
                    Hourly Rental
                  </label>
                  <button
                    type="button"
                    onClick={() => setHourlyEnabled(!hourlyEnabled)}
                    disabled={isLoading}
                    className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
                      hourlyEnabled ? "bg-blue-500" : "bg-gray-300"
                    }`}>
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-md ${
                        hourlyEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                {hourlyEnabled && (
                  <input
                    type="number"
                    placeholder="Hourly Rate (EGP)"
                    disabled={isLoading}
                    {...register("hourlyRate", {
                      required: hourlyEnabled
                        ? "Hourly rate is required"
                        : false,
                      valueAsNumber: true,
                    })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600 placeholder-gray-400"
                  />
                )}
              </div>

              {/* Daily Rental */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-gray-600 font-medium">
                    Daily Rental
                  </label>
                  <button
                    type="button"
                    onClick={() => setDailyEnabled(!dailyEnabled)}
                    disabled={isLoading}
                    className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
                      dailyEnabled ? "bg-blue-500" : "bg-gray-300"
                    }`}>
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-md ${
                        dailyEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                {dailyEnabled && (
                  <input
                    type="number"
                    placeholder="Daily Rate (EGP)"
                    disabled={isLoading}
                    {...register("dailyRate", {
                      required: dailyEnabled ? "Daily rate is required" : false,
                      valueAsNumber: true,
                    })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600 placeholder-gray-400"
                  />
                )}
              </div>

              {/* Monthly Rental */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-gray-600 font-medium">
                    Monthly Rental
                  </label>
                  <button
                    type="button"
                    onClick={() => setMonthlyEnabled(!monthlyEnabled)}
                    disabled={isLoading}
                    className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
                      monthlyEnabled ? "bg-blue-500" : "bg-gray-300"
                    }`}>
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-md ${
                        monthlyEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                {monthlyEnabled && (
                  <input
                    type="number"
                    placeholder="Monthly Rate (EGP)"
                    disabled={isLoading}
                    {...register("monthlyRate", {
                      required: monthlyEnabled
                        ? "Monthly rate is required"
                        : false,
                      valueAsNumber: true,
                    })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600 placeholder-gray-400"
                  />
                )}
              </div>
            </div>
          )}

          {/* Percentage Model Section */}
          {pricingModel === "percentage" && (
            <div className="space-y-3">
              {/* Percentage Toggle */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-gray-600 font-medium">
                    Percentage of Service Value
                  </label>
                  <button
                    type="button"
                    onClick={() => setPercentageEnabled(!percentageEnabled)}
                    disabled={isLoading}
                    className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
                      percentageEnabled ? "bg-blue-500" : "bg-gray-300"
                    }`}>
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-md ${
                        percentageEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Percentage Fields */}
              {percentageEnabled && (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Service Name"
                    disabled={isLoading}
                    {...register("serviceName", {
                      required: percentageEnabled
                        ? "Service name is required"
                        : false,
                    })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600 placeholder-gray-400"
                  />
                  <input
                    type="number"
                    placeholder="Minimum Service Value (EGP)"
                    disabled={isLoading}
                    {...register("minimumServiceValue", {
                      required: percentageEnabled
                        ? "Minimum service value is required"
                        : false,
                      valueAsNumber: true,
                    })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600 placeholder-gray-400"
                  />
                  <input
                    type="number"
                    placeholder="Owner's Commission (%)"
                    disabled={isLoading}
                    min="0"
                    max="100"
                    {...register("ownerCommission", {
                      required: percentageEnabled
                        ? "Owner's commission is required"
                        : false,
                      valueAsNumber: true,
                      min: {
                        value: 0,
                        message: "Commission must be at least 0%",
                      },
                      max: {
                        value: 100,
                        message: "Commission cannot exceed 100%",
                      },
                    })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600 placeholder-gray-400"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Availability Calendar */}
        <div className="flex flex-col items-center bg-gray-50 py-6 px-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Availability
          </h3>
          <div className="flex items-center justify-center">
            <DayPicker
              mode="range"
              selected={range}
              disabled={isLoading}
              onSelect={handleRangeSelect}
            />
          </div>
          {rangeError && <p className="text-red-500 mt-2">{rangeError}</p>}
        </div>
      </div>
    </form>
  );
}

export default CreateClinicForm;
