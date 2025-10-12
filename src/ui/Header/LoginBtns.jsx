import {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import useUser from "../../features/auth/useUser";
import Button from "../Button";
import SignOut from "../../features/auth/SignOut";

function LoginBtns() {
  const {user, isUserPending} = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDropdownClose = () => {
    setIsDropdownOpen(false);
  };

  const getUserDisplayName = () => {
    if (!user?.user_metadata?.fullName) return "User";
    const fullName = user.user_metadata.fullName;
    return fullName.split(" ").slice(0, 2).join(" ");
  };

  const getUserInitials = () => {
    if (!user?.user_metadata?.fullName) return "U";
    const fullName = user.user_metadata.fullName;
    return fullName
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getDashboardPath = () => {
    const userType = user?.user_metadata?.userType;
    if (userType === "provider") return "/provider";
    if (userType === "doctor") return "/doctor";
    return "/dashboard";
  };

  if (isUserPending) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-gray-200 rounded-full animate-pulse shadow-sm"></div>
        <div className="hidden md:block space-y-1">
          <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-16 h-2 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        {/* User Avatar and Name */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 
              via-purple-500 to-pink-500 flex items-center justify-center text-white 
              font-bold text-sm shadow-lg ring-2 ring-white ring-offset-2 ring-offset-gray-100">
            {user.user_metadata?.avatar ? (
              <img
                src={user.user_metadata.avatar}
                alt={getUserDisplayName()}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getUserInitials()
            )}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-900">
              {getUserDisplayName()}
            </p>
            <p className="text-xs text-gray-500 capitalize font-medium">
              {user.user_metadata?.userType || ""}
            </p>
          </div>
        </div>

        {/* Dropdown Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-center w-7 h-7 rounded-full 
              bg-gray-100 hover:bg-gray-200 text-gray-600 
                hover:text-gray-800 transition-all duration-200 shadow-sm hover:shadow-md">
            <i
              className={`ri-arrow-down-s-line text-sm transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}></i>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 backdrop-blur-sm">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">
                  {getUserDisplayName()}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user.user_metadata?.userType || "User"}
                </p>
              </div>

              <div className="py-2">
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-3 px-4 py-3 text-sm 
                  text-gray-700 hover:bg-blue-50 hover:text-blue-700 
                  transition-all duration-200 group"
                  onClick={() => setIsDropdownOpen(false)}>
                  <div
                    className="w-8 h-8 rounded-lg bg-blue-100 
                    group-hover:bg-blue-200 flex items-center justify-center transition-colors">
                    <i className="ri-dashboard-line text-blue-600"></i>
                  </div>
                  <div>
                    <p className="font-medium">Dashboard</p>
                    <p className="text-xs text-gray-500">View your dashboard</p>
                  </div>
                </Link>

                <div className="border-t border-gray-100 my-2"></div>

                <div className="px-4 py-3" onClick={handleDropdownClose}>
                  <SignOut className="w-full justify-start" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Button to="/login" type="secondary">
        Log In
      </Button>
      <Button to="/signup" type="primary">
        Sign Up
      </Button>
    </div>
  );
}

export default LoginBtns;
