import {useForm} from "react-hook-form";
import {useState, useRef} from "react";
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
    title: "Account Info",
    description: "Basic details",
  },
  {
    title: "Role Selection",
    description: "Choose your role",
  },
  {
    title: "Verification",
    description: "Upload documents",
  },
];

function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: {errors},
    watch,
  } = useForm();

  const {signUp, isSignUpPending} = useSignup();
  const [syndicateCardFile, setSyndicateCardFile] = useState(null);
  const [syndicateCardPreview, setSyndicateCardPreview] = useState("");
  const [syndicateCardError, setSyndicateCardError] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputRef = useRef(null);

  const password = watch("password");
  const userType = watch("userType");

  const handleSyndicateCardChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setSyndicateCardError("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSyndicateCardError("File size must be less than 5MB");
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
          watch("password")?.trim() &&
          watch("confirmPassword")?.trim() &&
          !errors.fullName &&
          !errors.email &&
          !errors.password &&
          !errors.confirmPassword;
        return step1Valid;
      }
      case 2: {
        // Check if user type is selected
        const step2Valid =
          watch("userType") && watch("userType") !== "" && !errors.userType;
        return step2Valid;
      }
      case 3: {
        if (userType === "doctor") {
          // Check if doctor-specific fields are filled
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

  const onSubmit = async ({fullName, email, userType, password}) => {
    // Validate doctor-specific fields
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

    // For now, we'll pass the file to be uploaded in the signup process
    signUp({
      fullName,
      email,
      userType,
      password,
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
                Create Your Account
              </h2>
              <p className="text-gray-600">
                Let's start with your basic information
              </p>
            </div>

            <FormRow label="Full Name" errors={errors.fullName}>
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

            <FormRow label="Email Address" errors={errors.email}>
              <input
                id="email"
                disabled={isSignUpPending}
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Entered value does not match email format",
                  },
                })}
                className={`input ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
            </FormRow>

            <FormRow label="Password" errors={errors.password}>
              <input
                id="password"
                disabled={isSignUpPending}
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long",
                  },
                })}
                className={`input ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
            </FormRow>

            <FormRow label="Confirm Password" errors={errors.confirmPassword}>
              <input
                id="confirmPassword"
                disabled={isSignUpPending}
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "The passwords do not match",
                })}
                className={`input ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
            </FormRow>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Choose Your Role
              </h2>
              <p className="text-gray-600">
                Tell us what type of account you need
              </p>
            </div>

            <FormRow
              label={
                <span>
                  I am a <span className="text-red-500">*</span>
                </span>
              }
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
                <option value="">Select your role...</option>
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
                  {userType === "doctor"
                    ? "Doctor Account"
                    : "Provider Account"}
                </h3>
                <p className="text-sm text-primary">
                  {userType === "doctor"
                    ? "You'll need to upload your syndicate card and specify your medical specialties."
                    : "You can manage clinics, view rentals, and handle payments."}
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
                  ? "Upload your documents and specify your specialties"
                  : "Review your information and complete registration"}
              </p>
            </div>

            {userType === "doctor" && (
              <>
                <FormRow
                  label={
                    <span>
                      Syndicate Card Image{" "}
                      <span className="text-red-500">*</span>
                    </span>
                  }
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
                        Upload a clear photo of your syndicate card (Required)
                      </p>
                    )}
                  </div>
                </FormRow>

                <FormRow
                  label={
                    <span>
                      Medical Specialties{" "}
                      <span className="text-red-500">*</span>
                    </span>
                  }>
                  <SpecialtiesSelector
                    selectedSpecialties={selectedSpecialties}
                    onSpecialtiesChange={setSelectedSpecialties}
                    disabled={isSignUpPending}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Enter your medical specialties (Required)
                  </p>
                </FormRow>
              </>
            )}

            {userType === "provider" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-900 mb-2">
                  Ready to Go!
                </h3>
                <p className="text-sm text-green-700">
                  Your provider account is ready. You can start managing clinics
                  and rentals after registration.
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
    <div className="flex items-center justify-center w-full bg-gray-50">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg">
        <div className="p-8">
          <StepIndicator
            currentStep={currentStep}
            totalSteps={3}
            steps={steps}
          />

          <form onSubmit={handleSubmit(onSubmit)}>
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
                      "Complete Registration"
                    )}
                  </Button>
                  {!canProceedToNext() && !isSignUpPending && (
                    <p className="text-sm text-red-500 mt-2 text-right">
                      Please complete all required fields to finish registration
                    </p>
                  )}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
