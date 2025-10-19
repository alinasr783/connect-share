import { Link } from "react-router-dom";

function Logo() {
  return (
    <Link to="/">
      <span className="inline-block">
        <img
          src="https://i.ibb.co/TxMzV8JL/Generated-Image-October-19-2025-11-44-PM.png"
          alt="Connect Share logo"
          className="h-12 sm:h-14 md:h-16 inline-block object-contain"
        />
      </span>
    </Link>
  );
}

export default Logo;
