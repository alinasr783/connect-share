import { Link } from "react-router-dom";

function Logo() {
  return (
    <Link to="/">
      <span className="inline-block">
        <img
          src="https://i.ibb.co/mFDjvvsg/Generated-Image-October-22-2025-4-21-AM-1-1.png"
          alt="Connect Share logo"
          className="h-12 sm:h-14 md:h-16 inline-block object-contain w-full"
        />
      </span>
    </Link>
  );
}

export default Logo;
