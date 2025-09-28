import {Link} from "react-router-dom";

function Logo() {
  return (
    <Link to="/">
      <span className="sm:text-2xl text-xl text-gray-700 font-semibold">
        Share
      </span>
    </Link>
  );
}

export default Logo;
