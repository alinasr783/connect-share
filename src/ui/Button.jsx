import {Link} from "react-router-dom";

function Button({
  children,
  disabled,
  to,
  variation = "primary",
  onClick,
  size = "medium",
  className,
  type = "button",
}) {
  const sizeStyles = {
    small: ` text-xs sm:text-sm px-3 sm:px-4 py-1.5`,
    medium: ` text-base sm:text-lg px-4 sm:px-6 py-2`,
    large: `text-base sm:text-lg md:text-xl px-6 sm:px-8 py-3`,
  };

  // Base styles for each type
  const baseStyles = {
    icon: ` ${sizeStyles[size]} text-gray-600 rounded-full 
              hover:bg-gray-300 transition-colors 
              duration-300 cursor-pointer inline-block disabled:cursor-not-allowed 
              disabled:opacity-50 ${className}`,

    primary: ` ${sizeStyles[size]} bg-primary text-white rounded-xl 
              hover:bg-primary/80 transition-colors 
              duration-300 cursor-pointer inline-block disabled:cursor-not-allowed 
              disabled:opacity-50 ${className}`,

    secondary: ` ${sizeStyles[size]} bg-secondary text-white rounded-xl 
              hover:bg-secondary/80 transition-colors 
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
        disabled={disabled}
        type={type}>
        {children}
      </button>
    );
  }

  return (
    <button disabled={disabled} className={baseStyles[variation]} type={type}>
      {children}
    </button>
  );
}

export default Button;
