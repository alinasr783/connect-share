import React, {useState, useRef, useEffect} from "react";

function DropdownMenu({trigger, children, position = "right", className = ""}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const getPositionClasses = () => {
    switch (position) {
      case "right":
        return "right-0";
      case "left":
        return "left-0";
      case "center":
        return "left-1/2 transform -translate-x-1/2";
      default:
        return "right-0";
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {isOpen && (
        <div
          ref={menuRef}
          className={`absolute top-full mt-1 z-50 bg-white rounded-lg shadow-lg 
             border border-gray-200 py-1 min-w-[160px] ${getPositionClasses()}`}>
          {React.Children.map(children, (child) =>
            React.isValidElement(child)
              ? React.cloneElement(child, {closeMenu})
              : child
          )}
        </div>
      )}
    </div>
  );
}

function MenuItem({
  children,
  onClick,
  disabled = false,
  className = "",
  icon = null,
  closeMenu,
}) {
  const handleClick = async (e) => {
    if (onClick) {
      await onClick(e);
      if (closeMenu) {
        closeMenu();
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 
          disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
               flex items-center gap-3 ${className}`}>
      {icon && <i className={`${icon} text-gray-500`}></i>}
      {children}
    </button>
  );
}

function MenuSeparator() {
  return <div className="border-t border-gray-200 my-1"></div>;
}

export {DropdownMenu, MenuItem, MenuSeparator};
