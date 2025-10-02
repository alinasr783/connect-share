import {useState} from "react";

function Filter({
  options = [],
  value,
  onChange,
  placeholder = "All",
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option) => {
    onChange?.(option);
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange?.("");
  };

  return (
    <div className={`relative ${className} w-40`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 pr-8 border border-gray-300 rounded-lg 
          focus:ring-2 focus:ring-blue-500 focus:border-transparent 
          bg-white text-left flex items-center justify-between">
        <span className={value ? "text-gray-900" : "text-gray-500"}>
          {value || placeholder}
        </span>
        <div className="flex items-center gap-2">
          {value && (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600">
              <i className="ri-close-line"></i>
            </button>
          )}
          <i
            className={`ri-arrow-down-s-line transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}></i>
        </div>
      </button>

      {isOpen && (
        <div
          className="absolute z-10 w-full mt-1 bg-white border 
            border-gray-300 rounded-lg shadow-lg">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex 
                        items-center justify-between ${
                          value === option
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-900"
                        }`}>
                <span className="capitalize">{option}</span>
                {value === option && (
                  <i className="ri-check-line text-blue-600"></i>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Filter;
