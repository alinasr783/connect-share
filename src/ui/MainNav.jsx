import {NavLink} from "react-router-dom";

function MainNav({links}) {
  return (
    <nav>
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className={({isActive}) =>
                `flex items-center gap-2 px-4 py-2 rounded-md group ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-gray-500 hover:bg-primary/10 hover:text-primary"
                }`
              }>
              {({isActive}) => (
                <>
                  <span
                    className={`${link.icon} text-xl ${
                      isActive ? "text-primary" : "text-gray-500"
                    } group-hover:text-primary`}></span>
                  <span
                    className={`font-medium text-lg ${
                      isActive ? "text-primary" : "text-gray-500"
                    } group-hover:text-primary`}>
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
