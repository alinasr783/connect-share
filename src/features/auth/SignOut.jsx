import useLogout from "./useLogout";

function SignOut({className = "", children}) {
  const {logout, isLoggingOut} = useLogout();

  return (
    <button
      onClick={logout}
      disabled={isLoggingOut}
      className={`flex items-center gap-2 px-4 py-2 text-sm text-red-600 
      hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 
      w-full text-left cursor-pointer ${className}`}>
      <i className="ri-logout-box-line"></i>
      <span>{isLoggingOut ? "Signing out..." : children || "Sign Out"}</span>
    </button>
  );
}

export default SignOut;
