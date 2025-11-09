import {useForm} from "react-hook-form";
import {useState, useRef, useEffect} from "react";
import { useSearchParams } from "react-router-dom";
import Button from "../../ui/Button";
import useSignup from "./useSignup";
import SpinnerMini from "../../ui/SpinnerMini";
import FormRow from "../../ui/FormRow";
import SpecialtiesSelector from "../../ui/SpecialtiesSelector";
import StepIndicator from "../../ui/StepIndicator";

const userTypeOptions = [
  {value: "provider", label: "Provider"},
  {value: "doctor", label: "Doctor"},
];

const steps = [
  {
    title: "Account info",
    description: "Basic details",
  },
  {
    title: "Choose role",
    description: "Select account type",
  },
  {
    title: "Verification",
    description: "Upload documents",
  },
];

function SignupForm() {
  const [searchParams] = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: {errors},
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      referralCode: "",
    },
  });

  const {signUp, isSignUpPending} = useSignup();
  const [syndicateCardFile, setSyndicateCardFile] = useState(null);
  const [syndicateCardPreview, setSyndicateCardPreview] = useState("");
  const [syndicateCardError, setSyndicateCardError] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputRef = useRef(null);
  // Show/hide password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = watch("password");
  const userType = watch("userType");
  const referralCode = watch("referralCode");

  useEffect(() => {
    const urlRef = searchParams.get("ref");
    if (urlRef) {
      setValue("referralCode", urlRef);
    }
  }, [searchParams, setValue]);

  const handleSyndicateCardChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setSyndicateCardError("Please choose a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSyndicateCardError("File size must be under 5MB");
        return;
      }

      setSyndicateCardFile(file);
      setSyndicateCardError("");
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setSyndicateCardPreview(previewUrl);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1: {
        // Check if all required fields are filled and valid
        const step1Valid =
          watch("fullName")?.trim() &&
          watch("email")?.trim() &&
          watch("phone")?.trim() &&
          watch("password")?.trim() &&
          watch("confirmPassword")?.trim() &&
          !errors.fullName &&
          !errors.email &&
          !errors.phone &&
          !errors.password &&
          !errors.confirmPassword;
        return step1Valid;
      }
      case 2: {
        const step2Valid =
          watch("userType") && watch("userType") !== "" && !errors.userType;
        return step2Valid;
      }
      case 3: {
        if (userType === "doctor") {
          const step3Valid =
            syndicateCardFile &&
            selectedSpecialties.length > 0 &&
            !syndicateCardError;
          return step3Valid;
        }
        return true;
      }
      default:
        return false;
    }
  };

  const onSubmit = async ({fullName, email, phone, userType, password}) => {
    if (userType === "doctor") {
      if (!syndicateCardFile) {
        setSyndicateCardError("Syndicate card image is required");
        return;
      }
      if (syndicateCardError) {
        return;
      }
      if (selectedSpecialties.length === 0) {
        alert("Please select at least one medical specialty");
        return;
      }
    }

    signUp({
      fullName,
      email,
      phone,
      userType,
      password,
      referralCode: referralCode || "",
      syndicateCardFile: userType === "doctor" ? syndicateCardFile : undefined,
      specialties: userType === "doctor" ? selectedSpecialties : undefined,
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Create your account
              </h2>
              <p className="text-gray-600">
                Let's start with your basic details
              </p>
            </div>

            <FormRow label="Full name" errors={errors.fullName}>
              <input
                id="fullName"
                disabled={isSignUpPending}
                type="text"
                {...register("fullName", {required: "Full name is required"})}
                className={`input ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                }`}
              />
            </FormRow>

            <FormRow label="Email" errors={errors.email}>
              <input
                id="email"
                disabled={isSignUpPending}
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Invalid email format",
                  },
                })}
                className={`input ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
            </FormRow>

            <FormRow 
              label={
                <span>
                  Mobile number <span className="text-red-500">*</span>
                  <span className="block text-sm text-gray-500 font-normal mt-1">
                    Required for account activation and important notifications
                  </span>
                </span>
              } 
              errors={errors.phone}
            >
              <input
                id="phone"
                disabled={isSignUpPending}
                type="tel"
                placeholder="e.g., +201234567890"
                {...register("phone", {
                  required: "Mobile number is required",
                  pattern: {
                    value: /^[\+]?[1-9][\d]{0,15}$/,
                    message: "Please enter a valid mobile number",
                  },
                })}
                className={`input ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
            </FormRow>

            <FormRow 
              label={<span>Referral code <span className="text-gray-400">(optional)</span></span>}
              errors={errors.referralCode}
            >
              <input
                id="referralCode"
                disabled={isSignUpPending}
                type="text"
                placeholder="Enter referral code if available"
                {...register("referralCode")}
                className={`input border-gray-300`}
              />
              {referralCode && (
                <p className="mt-2 text-xs text-green-600">Referral code captured from the URL</p>
              )}
            </FormRow>

            <FormRow label="Password" errors={errors.password}>
              <div className="relative">
                <input
                  id="password"
                  disabled={isSignUpPending}
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  className={`input pr-12 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  <i className={showPassword ? "ri-eye-off-line text-xl" : "ri-eye-line text-xl"} />
                </button>
              </div>
            </FormRow>

            <FormRow label="Confirm password" errors={errors.confirmPassword}>
              <div className="relative">
                <input
                  id="confirmPassword"
                  disabled={isSignUpPending}
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  className={`input pr-12 ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  <i className={showConfirmPassword ? "ri-eye-off-line text-xl" : "ri-eye-line text-xl"} />
                </button>
              </div>
            </FormRow>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Choose your role
              </h2>
              <p className="text-gray-600">
                Tell us which account type you need
              </p>
            </div>

            <FormRow
              label={<span>I am <span className="text-red-500">*</span></span>}
              errors={errors.userType}>
              <select
                id="userType"
                disabled={isSignUpPending}
                {...register("userType", {
                  required: "Please select a user type",
                  validate: (value) =>
                    value !== "" || "Please select a user type",
                })}
                className={`input ${
                  errors.userType ? "border-red-500" : "border-gray-300"
                }`}>
                <option value="">Choose account type...</option>
                {userTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FormRow>

            {userType && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-primary mb-2">
                  {userType === "doctor" ? "Doctor account" : "Provider account"}
                </h3>
                <p className="text-sm text-primary">
                  {userType === "doctor"
                    ? "You will need to upload your syndicate card image and choose your medical specialties."
                    : "You can manage clinics, track rentals, and process payments."}
                </p>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verification
              </h2>
              <p className="text-gray-600">
                {userType === "doctor"
                  ? "Upload your documents and choose your specialties"
                  : "Review your information and complete signup"}
              </p>
            </div>

            {userType === "doctor" && (
              <>
                <FormRow
                  label={<span>Syndicate card image <span className="text-red-500">*</span></span>}
                  errors={
                    syndicateCardError ? {message: syndicateCardError} : null
                  }>
                  <div className="mt-1">
                    {syndicateCardPreview ? (
                      <div className="mb-2">
                        <img
                          src={syndicateCardPreview}
                          alt="Syndicate card preview"
                          className="w-32 h-20 object-cover rounded border"
                        />
                      </div>
                    ) : null}
                    <input
                      ref={fileInputRef}
                      id="syndicateCardImage"
                      type="file"
                      accept="image/*"
                      onChange={handleSyndicateCardChange}
                      disabled={isSignUpPending}
                      className={`block w-full text-sm text-gray-500 file:mr-4 
                          file:py-2 file:px-4 file:rounded-full file:border-0 
                          file:text-sm file:font-semibold file:bg-blue-50 
                          file:text-primary hover:file:bg-blue-100 ${
                            syndicateCardError ? "border-red-500" : ""
                          }`}
                    />
                    {!syndicateCardError && (
                      <p className="mt-1 text-sm text-gray-500">
                        Upload a clear image of your card (required)
                      </p>
                    )}
                  </div>
                </FormRow>

                <FormRow label={<span>Medical specialties <span className="text-red-500">*</span></span>}>
                  <SpecialtiesSelector
                    selectedSpecialties={selectedSpecialties}
                    onSpecialtiesChange={setSelectedSpecialties}
                    disabled={isSignUpPending}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Add your medical specialties (required)
                  </p>
                </FormRow>
              </>
            )}

            {userType === "provider" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-900 mb-2">
                  Ready to go!
                </h3>
                <p className="text-sm text-green-700">
                  Your provider account is ready. You can start managing clinics and rentals after signup.
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <StepIndicator
        currentStep={currentStep}
        totalSteps={3}
        steps={steps}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </Button>

          {currentStep < 3 ? (
            <div className="flex flex-col items-end">
              <Button
                type="button"
                onClick={nextStep}
                disabled={!canProceedToNext()}
                className="px-6 py-2 bg-primary text-white rounded-lg 
                hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                Next
              </Button>
              {!canProceedToNext() && (
                <p className="text-sm text-red-500 mt-2 text-right">
                  Please complete all required fields to continue
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-end">
              <Button
                type="submit"
                disabled={isSignUpPending || !canProceedToNext()}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
                {isSignUpPending ? (
                  <SpinnerMini />
                ) : (
                  "Complete signup"
                )}
              </Button>
              {!canProceedToNext() && !isSignUpPending && (
                <p className="text-sm text-red-500 mt-2 text-right">
                  Please complete all required fields to finish signup
                </p>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default SignupForm;