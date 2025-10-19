import { Link } from "react-router-dom";

function Logo() {
  return (
    <Link to="/">
      <span className="inline-block">
        <img
          src="https://i.ibb.co/XrbxY53G/a95d0936-9074-422f-b3e3-34b42f08656c.jpg"
          alt="Connect Share logo"
          className="h-12 sm:h-14 md:h-16 inline-block object-contain"
        />
      </span>
    </Link>
  );
}

export default Logo;
