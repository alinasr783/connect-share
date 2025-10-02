import {useState} from "react";
import useUser from "../auth/useUser";
import ProfileInformation from "./ProfileInformation";
import ChangePasswordForm from "./ChangePasswordForm";
import Account from "./Account";
import Heading from "../../ui/Heading";
import Spinner from "../../ui/Spinner";

function UpdateProviderData() {
  const {isUserPending} = useUser();
  const [activeTab, setActiveTab] = useState("profile");

  if (isUserPending) return <Spinner />;

  return (
    <div className="py-8">
      <div className="max-w-5xl mx-auto px-4 bg-white rounded-2xl shadow-xs p-8">
        {/* Header */}
        <div className="mb-8">
          <Heading as="h1">Profile Settings</Heading>
          <p className="text-gray-600">
            Update your personal information and security settings.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "profile"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}>
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "password"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}>
                Change Password
              </button>
              <button
                onClick={() => setActiveTab("account")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "account"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}>
                Account
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "profile" && <ProfileInformation />}

        {activeTab === "password" && <ChangePasswordForm />}

        {activeTab === "account" && <Account />}
      </div>
    </div>
  );
}

export default UpdateProviderData;
