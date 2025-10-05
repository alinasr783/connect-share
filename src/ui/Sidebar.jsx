import MainNav from "./MainNav";
import User from "./User";

function Sidebar({links}) {
  return (
    <aside className="w-72 p-6 border-r border-gray-200 flex flex-col gap-12">
      <User />

      <MainNav links={links} />
    </aside>
  );
}

export default Sidebar;
