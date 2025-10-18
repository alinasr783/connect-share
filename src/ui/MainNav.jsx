import { NavLink } from "react-router-dom";

function MainNav({ links }) {
  return (
    <nav>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg group transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary border-r-2 border-primary"
                    : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                }`
              }>
              {({ isActive }) => (
                <>
                  <span
                    className={`${link.icon} text-lg ${
                      isActive ? "text-primary" : "text-gray-500"
                    } group-hover:text-primary transition-colors`}></span>
                  <span
                    className={`font-medium text-sm ${
                      isActive ? "text-primary font-semibold" : "text-gray-600"
                    } group-hover:text-primary transition-colors`}>
                    {link.label}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default MainNav;