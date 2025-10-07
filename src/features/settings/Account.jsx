import useUser from "../auth/useUser";
import SignOut from "../auth/SignOut";
import Heading from "../../ui/Heading";

function Account() {
  const {user} = useUser();

  return (
    <div className="bg-white rounded-2xl shadow-xs p-8">
      <div className="mb-8">
        <Heading as="h2">Account Settings</Heading>
        <p className="text-gray-600">
          Manage your account and security preferences.
        </p>
      </div>

      <div className="space-y-8">
        {/* Account Actions */}
        <div className="border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Account Actions
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
              <div>
                <h4 className="font-medium text-red-900">Sign Out</h4>
                <p className="text-sm text-red-700">
                  Sign out of your account on this device
                </p>
              </div>
              <div className="flex items-center gap-2">
                <SignOut className="bg-red-600 hover:bg-red-700 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Account Information
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">Email</span>
              <span className="text-sm text-gray-900">{user?.email}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">
                User Type
              </span>
              <span className="text-sm text-gray-900 capitalize">
                {user?.user_metadata?.userType || "User"}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-sm font-medium text-gray-600">
                Member Since
              </span>
              <span className="text-sm text-gray-900">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
