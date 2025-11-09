import MainNav from "./MainNav";
import User from "./User";
import Button from "./Button"
import useLogout from "../features/auth/useLogout";

function Sidebar({ links }) {
  const { logout, isLoggingOut } = useLogout();

  return (
    <aside className="w-64 p-4 border-r border-gray-200/70 bg-white/80 backdrop-blur-sm flex flex-col gap-6 h-full shadow-sm">
      <User />

      <MainNav links={links} />

      <div className="mt-auto">
        <button
          onClick={logout}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-full p-2 text-sm cursor-pointer transition-all shadow-sm hover:shadow-md"
        >
          <i className="ri-logout-box-line"></i>
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;