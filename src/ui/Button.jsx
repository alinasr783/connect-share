import {Link} from "react-router-dom";

function Button({
  children,
  disabled,
  to,
  variation = "primary",
  onClick,
  size = "medium",
  className,
}) {
  const sizeStyles = {
    small: ` text-xs sm:text-sm px-3 sm:px-4 py-1.5`,
    medium: ` text-base sm:text-lg px-4 sm:px-6 py-2`,
    large: `text-base sm:text-lg md:text-xl px-6 sm:px-8 py-3`,
  };

  // Base styles for each type
  const baseStyles = {
    icon: ` ${sizeStyles[size]} rounded-full w-10 h-10 flex items-center justify-center
      cursor-pointer hover:bg-gray-200 border border-gray-300 ${className}`,

    primary: ` ${sizeStyles[size]} bg-primary text-white rounded-xl 
              hover:bg-primary/80 transition-colors 
              duration-300 cursor-pointer inline-block disabled:cursor-not-allowed 
              disabled:opacity-50 ${className}`,

    secondary: ` ${sizeStyles[size]} bg-gray-100 border border-gray-300 text-gray-700 rounded-xl 
              hover:bg-gray-100 transition-colors 
              duration-300 cursor-pointer inline-block disabled:cursor-not-allowed 
              disabled:opacity-50 ${className}`,

    link: ` ${sizeStyles[size]} bg-transparent rounded-xl text-primary 
              transition-colors 
              duration-300 cursor-pointer inline-block disabled:cursor-not-allowed 
              disabled:opacity-50 ${className}`,
  };

  if (to) {
    return (
      <Link to={to} className={baseStyles[variation]} disabled={disabled}>
        {children}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={baseStyles[variation]}
        disabled={disabled}>
        {children}
      </button>
    );
  }

  return (
    <button disabled={disabled} className={baseStyles[variation]}>
      {children}
    </button>
  );
}

export default Button;
