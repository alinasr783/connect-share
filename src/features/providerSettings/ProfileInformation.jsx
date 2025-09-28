import {useRef, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import useUser from "../auth/useUser";
import {useUpdateUser} from "./useUpdateUser";
import Button from "../../ui/Button";
import FormRow from "../../ui/FormRow";
import Spinner from "../../ui/Spinner";

function ProfileInformation() {
  const {user, isUserPending} = useUser();
  const {updateUser, isUpdating} = useUpdateUser();
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {errors, isDirty},
  } = useForm({
    defaultValues: {
      fullName: user?.user_metadata?.fullName || "",
      email: user?.email || "",
      phone: user?.user_metadata?.phone || "",
      avatar: user?.user_metadata?.avatar || "",
      medicalLicenseNumber: user?.user_metadata?.medicalLicenseNumber || "",
      specialty: user?.user_metadata?.specialty || "",
    },
  });

  const avatarValue = watch("avatar");
  const [avatarPreview, setAvatarPreview] = useState(
    user?.user_metadata?.avatar || ""
  );

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      setValue("fullName", user.user_metadata?.fullName || "");
      setValue("email", user.email || "");
      setValue("phone", user.user_metadata?.phone || "");
      setValue("avatar", user.user_metadata?.avatar || "");
      setValue(
        "medicalLicenseNumber",
        user.user_metadata?.medicalLicenseNumber || ""
      );
      setValue("specialty", user.user_metadata?.specialty || "");
      setAvatarPreview(user.user_metadata?.avatar || "");
    }
  }, [user, setValue]);

  // Update avatar preview when avatar value changes
  useEffect(() => {
    if (avatarValue && avatarValue.startsWith("data:image/")) {
      setAvatarPreview(avatarValue);
    }
  }, [avatarValue]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);

      // Convert file to base64 for upload
      const reader = new FileReader();
      reader.onload = (event) => {
        setValue("avatar", event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data) => {
    // Update user data
    const updateData = {
      fullName: data.fullName,
      phone: data.phone,
      avatar: data.avatar,
    };

    // Add doctor-specific fields if user is a doctor
    if (user?.user_metadata?.userType === "doctor") {
      updateData.medicalLicenseNumber = data.medicalLicenseNumber;
      updateData.specialty = data.specialty;
    }

    updateUser(updateData);
  };

  const handleChangePictureClick = () => {
    fileInputRef.current?.click();
  };

  if (isUserPending) return <Spinner />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left side - Avatar */}
        <div className="flex-shrink-0 w-1/3">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleChangePictureClick}
              className="text-blue-600 hover:text-blue-700 
              font-medium text-sm transition-colors">
              Change Picture
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormRow label="Full Name" errors={errors.fullName}>
              <input
                type="text"
                id="fullName"
                className="input"
                placeholder="Enter your full name"
                {...register("fullName", {
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Full name must be at least 2 characters",
                  },
                })}
              />
            </FormRow>

            <FormRow label="Phone Number" errors={errors.phone}>
              <input
                type="tel"
                id="phone"
                className="input"
                placeholder="Enter your phone number"
                {...register("phone", {
                  pattern: {
                    value:
                      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
                    message: "Please enter a valid phone number",
                  },
                })}
              />
            </FormRow>

            {user?.user_metadata?.userType === "doctor" && (
              <>
                {/* Medical License Number */}
                <FormRow
                  label="Medical License Number"
                  errors={errors.medicalLicenseNumber}>
                  <input
                    type="text"
                    id="medicalLicenseNumber"
                    className="input"
                    placeholder="Enter your medical license number"
                    {...register("medicalLicenseNumber", {
                      required: "Medical license number is required",
                      minLength: {
                        value: 3,
                        message: "License number must be at least 3 characters",
                      },
                    })}
                  />
                </FormRow>

                <FormRow label="Specialty" errors={errors.specialty}>
                  <input
                    type="text"
                    id="specialty"
                    className="input"
                    placeholder="Enter your medical specialty"
                    {...register("specialty", {
                      required: "Specialty is required",
                      minLength: {
                        value: 2,
                        message: "Specialty must be at least 2 characters",
                      },
                    })}
                  />
                </FormRow>
              </>
            )}
          </div>

          <FormRow label="Email Address" errors={errors.email}>
            <input
              type="email"
              id="email"
              className="input"
              placeholder="Enter your email address"
              disabled
              {...register("email")}
            />
            <p className="text-sm text-gray-500">Email cannot be changed</p>
          </FormRow>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={isUpdating || !isDirty}
          className="btn-primary">
          {isUpdating ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

export default ProfileInformation;
