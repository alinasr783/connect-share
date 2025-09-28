import {useForm} from "react-hook-form";
import {useState, useRef} from "react";
import Button from "../../ui/Button";
import useSignup from "./useSignup";
import SpinnerMini from "../../ui/SpinnerMini";
import FormRow from "../../ui/FormRow";
import SpecialtiesSelector from "../../ui/SpecialtiesSelector";

const userTypeOptions = [
  {value: "provider", label: "Provider"},
  {value: "doctor", label: "Doctor"},
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

  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-full max-w-md  bg-white rounded-sm shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
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

          <FormRow label="I am a" errors={errors.userType}>
            <select
              id="userType"
              disabled={isSignUpPending}
              {...register("userType", {required: "Please select a user type"})}
              className={`input ${
                errors.userType ? "border-red-500" : "border-gray-300"
              }`}>
              <option value="">Select...</option>
              {userTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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

          {/* Doctor-specific fields */}
          {userType === "doctor" && (
            <>
              <FormRow
                label={
                  <span>
                    Syndicate Card Image <span className="text-red-500">*</span>
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
                    className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${
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

              {/* Specialties Selection */}
              <FormRow
                label={
                  <span>
                    Medical Specialties <span className="text-red-500">*</span>
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

          <div className="flex items-center justify-center">
            <Button
              type="primary"
              size="medium"
              disabled={isSignUpPending}
              className="w-full"
              onClick={handleSubmit(onSubmit)}>
              {isSignUpPending ? <SpinnerMini /> : "Sign Up"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupForm;
