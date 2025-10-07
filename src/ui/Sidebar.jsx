import MainNav from "./MainNav";
import User from "./User";
import Button from "./Button";
import useLogout from "../features/auth/useLogout";

function Sidebar({links}) {
  const {logout, isLoggingOut} = useLogout();

  return (
    <aside className="w-72 p-6 border-r border-gray-200 flex flex-col gap-12 h-full">
      <User />

      <MainNav links={links} />

      <div className="mt-auto">
        <button
          onClick={logout}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center gap-2 bg-red-100
          text-red-700 hover:bg-red-200 rounded-lg p-2 cursor-pointer">
          <i className="ri-logout-box-line"></i>
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
