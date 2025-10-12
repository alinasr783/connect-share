import React, {useState, useRef, useEffect} from "react";
import {createPortal} from "react-dom";

function DropdownMenu({
  trigger,
  children,
  position = "right",
  className = "",
  portal = true,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);
  const [coords, setCoords] = useState({top: 0, left: 0});

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

  // Compute viewport coordinates when opened
  useEffect(() => {
    if (!isOpen || !portal) return;
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Default menu width estimate; will be corrected after first render
    let width = 160;
    const updateCoords = () => {
      const menuRect = menuRef.current?.getBoundingClientRect();
      width = menuRect?.width || width;
      let left = rect.left + window.scrollX;
      if (position === "right") left = rect.right - width + window.scrollX;
      if (position === "center")
        left = rect.left + rect.width / 2 - width / 2 + window.scrollX;
      const top = rect.bottom + 8 + window.scrollY;
      setCoords({top, left});
    };

    updateCoords();

    const onResizeScroll = () => updateCoords();
    window.addEventListener("resize", onResizeScroll);
    window.addEventListener("scroll", onResizeScroll, true);
    return () => {
      window.removeEventListener("resize", onResizeScroll);
      window.removeEventListener("scroll", onResizeScroll, true);
    };
  }, [isOpen, portal, position]);

  const menuContent = (
    <div
      ref={menuRef}
      className={`bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px] z-[1000]`}
      style={
        portal ? {position: "fixed", top: coords.top, left: coords.left} : {}
      }>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, {closeMenu})
          : child
      )}
    </div>
  );

  return (
    <div className={`relative ${className}`}>
      <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {isOpen &&
        (portal ? (
          createPortal(menuContent, document.body)
        ) : (
          <div className="absolute top-full mt-1 right-0">{menuContent}</div>
        ))}
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
